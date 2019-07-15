initFGSM = function (trainedModel, pixelMin = -1.0, pixelMax = 1.0) {

    const obj = {};

    obj.model = trainedModel;
    obj.pixelMin = pixelMin;
    obj.pixelMax = pixelMax;
    obj.numOutputs = obj.model.model.outputShape[1];

    /***************************************************************************
     *  Internal helper functions
     ****************************************************************************/

    const initCalculateGradient = function (clazz) {
        const clazzOneHot = tf.oneHot([clazz], obj.numOutputs);
        const calculateLoss = x => tf.losses.softmaxCrossEntropy(clazzOneHot, obj.model.model.predict(x));
        return tf.grad(calculateLoss);
    };

    const performAttack = function (image, gradientFunction, addOrSubtract, epsilon, numSteps) {
        return tf.tidy(() => {
            const epsilonPerStep = epsilon / numSteps;

            // perform iterative attack with numSteps, if numSteps=1 -> standard non-iterative attack
            let adversarial = image;
            for (let i = 0; i < numSteps; i++) {
                const gradient = gradientFunction(adversarial);
                const perturbation = gradient.sign().mul(epsilonPerStep);
                adversarial = addOrSubtract(adversarial, perturbation);
                adversarial = adversarial.clipByValue(obj.pixelMin, obj.pixelMax);
                adversarial = obj.model.scaleImage(obj.model.unscaleImage(adversarial).round());
            }

            return adversarial
        });
    };

    /***************************************************************************
     *  Exported attack functions
     ****************************************************************************/

    obj.untargetedPerturbation = function (image, originalClass, epsilon, numSteps = 1) {
        return tf.tidy(() => {
            const calculateGradient = initCalculateGradient(originalClass);
            const adversarial = performAttack(image, calculateGradient, tf.add, epsilon, numSteps);
            const perturbation = image.sub(adversarial);
            return perturbation;
        });
    };

    obj.targetedPerturbation = function (image, targetClass, epsilon, numSteps = 1) {
        return tf.tidy(() => {
            const calculateGradient = initCalculateGradient(targetClass);
            const adversarial = performAttack(image, calculateGradient, tf.sub, epsilon, numSteps);;
            return adversarial;
        });
    };

    return obj;
};


function generateNoise(opacityLevels) {
    return tf.tidy(() => {
        const noise = tf.randomUniform([IMAGE_HEIGHT, IMAGE_WIDTH, 3], 0, 255).toInt();

        const noiseWithOpacity = function(opacityLevel){
            const opacity = tf.fill([IMAGE_HEIGHT, IMAGE_WIDTH, 1], opacityLevel);
            return noise.concat(opacity, 2).data();
        };

        return opacityLevels.map(noiseWithOpacity);
    });
}


function generateAdversarials(model, image, opacityLevels){

    return tf.tidy(() => {
        const FGSM = initFGSM(model);

        const imageTensor = tf.browser.fromPixels(image).expandDims();
        const imageResized = tf.image.resizeBilinear(imageTensor,[MODEL_INPUT_SIZE,MODEL_INPUT_SIZE]);
        const imageTensorScaled = model.scaleImage(imageResized);
        const opacity = tf.fill([IMAGE_HEIGHT, IMAGE_WIDTH, 1], 255);

        const calculatePerturbation = function(perturbationLevel){
            const adversarialScaled = FGSM.targetedPerturbation(imageTensorScaled, 1, perturbationLevel / 255, 20);
            const perturbation = model.unscaleImage(adversarialScaled).toInt().gather(0);
            const perturbationResized =  tf.image.resizeBilinear(perturbation,[IMAGE_HEIGHT, IMAGE_WIDTH]);
            return perturbationResized.concat(opacity, 2).data();
        };

        return opacityLevels.map(calculatePerturbation);
    })
}
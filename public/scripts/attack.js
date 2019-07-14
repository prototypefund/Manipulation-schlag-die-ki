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

    obj.untargetedAttack = function (image, originalClass, epsilon, numSteps = 1) {
        return tf.tidy(() => {
            const calculateGradient = initCalculateGradient(originalClass);
            return performAttack(image, calculateGradient, tf.add, epsilon, numSteps);
        });
    };

    obj.targetedAttack = function (image, targetClass, epsilon, numSteps = 1) {
        return tf.tidy(() => {
            const calculateGradient = initCalculateGradient(targetClass);
            return performAttack(image, calculateGradient, tf.sub, epsilon, numSteps);
        });
    };

    return obj;
};


function generateNoise(width, height, opacityLevels) {
    return tf.tidy(() => {
        const randomChannelData = () => tf.randomUniform([width, height, 1], 0, 255).toInt();

        const red = randomChannelData();
        const green = randomChannelData();
        const blue = randomChannelData();

        const noiseWithOpacity = function(opacityLevel){
            const opacity = tf.fill([width, height, 1], opacityLevel);
            const noise = tf.concat([red, green, blue, opacity], 2);
            return noise.data();
        };

        return opacityLevels.map(noiseWithOpacity);
    });
}


function generateAdversarials(model, image, opacityLevels){

    return tf.tidy(() => {
        const FGSM = initFGSM(model);

        const imageTensor = tf.browser.fromPixels(image).expandDims();
        const imageTensorScaled = model.scaleImage(imageTensor);
        const realClass = model.model.predict(imageTensorScaled).slice(0).argMax().dataSync()[0]; // todo sync
        /*console.log(realClass);*/

        const calculatePerturbation = function(perturbationLevel){
            const adversarialScaled = FGSM.targetedAttack(imageTensorScaled, 1, perturbationLevel / 255, 20);
            const adversarial = model.unscaleImage(adversarialScaled).toInt().gather(0);
            //const perturbation = imageTensor.sub(adversarial).toInt().gather(0);  // todo add or subtract correct?
            const opacity = tf.fill([224, 224, 1], 255);
            return adversarial.concat(opacity, 2).data();
        };

        return opacityLevels.map(calculatePerturbation);
    })
}
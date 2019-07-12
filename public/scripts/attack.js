initFGSM = function (trainedModel, pixelMin = -1.0, pixelMax = 1.0) {

    const obj = {};

    obj.model = trainedModel;
    obj.pixelMin = pixelMin;
    obj.pixelMax = pixelMax;
    obj.numOutputs = obj.model.outputShape[1];

    /***************************************************************************
     *  Internal helper functions
     ****************************************************************************/

    const initCalculateGradient = function (clazz) {
        const clazzOneHot = tf.oneHot([clazz], obj.numOutputs);
        const calculateLoss = x => tf.losses.softmaxCrossEntropy(clazzOneHot, obj.model.predict(x));
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
                adversarial = scaleImage(unscaleImage(adversarial).round());
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


async function generateNoise(width, height) {
    let noise = new Array(width*height*4).fill(0);

    let i = 0;
    while (i < noise.length) {
        // RGB
        noise[i++] = Math.floor(Math.random() * 255);
        noise[i++] = Math.floor(Math.random() * 255);
        noise[i++] = Math.floor(Math.random() * 255);
        // opacity
        noise[i++] = 210;
    }

    return noise;
}

async function setNoiseOpacity(noise, opacity){
    const newNoise = (await noise).slice(); // copy  //todo the await
    for (let i=3; i<newNoise.length; i+=4)
        newNoise[i] = opacity;
    return newNoise;
}
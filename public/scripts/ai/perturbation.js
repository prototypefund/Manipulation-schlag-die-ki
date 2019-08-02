function PerturbationFactory(model, config){
    const obj = {};

    obj.generatePerturbations = async function(originalImage, perturbationType){
        if (perturbationType === PERTURBATION_TYPES.NOISE){
            return await Promise.all(generateNoise(originalImage, config.PERTURBATION_LEVELS));
        }
        else if (perturbationType === PERTURBATION_TYPES.ADVERSARIAL){
            if (config.USE_PREFAB_ADVERSARIALS)
                return await Promise.all(loadPrefabricatedAdversarials(originalImage, config.PERTURBATION_LEVELS, config.ADVERSARIAL_DIRECTORY));
            else {
                model = await model;
                return await Promise.all(generateAdversarials(originalImage, config.PERTURBATION_LEVELS, model));
            }
        }
        else if (perturbationType === PERTURBATION_TYPES.NONE){
            return null;
        }
        else
            throw Error("Unknown perturbation type");
    };


    return obj;
}

// returns only the noise with some opacity, the original image will be shown behind the noise
function generateNoise(originalImage, opacityLevels) {
    return tf.tidy(() => {
        const noise = tf.randomUniform([originalImage.height, originalImage.width, 3], 0, 255).toInt();

        const noiseWithOpacity = function(opacityLevel){
            const opacity = tf.fill([originalImage.height, originalImage.width, 1], opacityLevel);
            return noise.concat(opacity, 2).data();
        };

        return opacityLevels.map(noiseWithOpacity);
    });
}

// returns the original image + the perturbation with opacity 255; original image will be shown behind but not visible
function generateAdversarials(originalImage, perturbationLevels, model){

    return tf.tidy(() => {
        const FGSM = initFGSM(model);

        const imageTensor = model.prepareImage(originalImage);
        const opacity = tf.fill([originalImage.height, originalImage.width, 1], 255);

        const calculateAdversarial = function(perturbationLevel){
            const adversarialScaled = FGSM.targetedPerturbation(imageTensor, 1, perturbationLevel / 255, 20);
            const adversarial = model.unscaleImage(adversarialScaled).toInt().gather(0);
            const adversarialResized =  tf.image.resizeBilinear(adversarial,[originalImage.height, originalImage.width]);
            return adversarialResized.concat(opacity, 2).toInt().data();
        };

        return perturbationLevels.map(calculateAdversarial);
    })
}

// returns the original image + the perturbation with opacity 255; original image will be shown behind but not visible
function loadPrefabricatedAdversarials(originalImage, perturbationLevels, adversarialDirectory){
    // finding the right adversarial image for the perturbation level
    const path = originalImage.src.split("/").slice(-1)[0];
    const [baseName, ext] = path.split(".");
    const getAdversarialName = perturbationLevel => baseName + "." + perturbationLevel +"." + ext;

    function imageToTensor(image){
        return tf.tidy(() => {
            const imageTensor = tf.browser.fromPixels(image);
            const opacity = tf.fill([originalImage.height, originalImage.width, 1], 255);
            return imageTensor.concat(opacity, 2).toInt();
        });
    }

    async function loadAdversarial(perturbationLevel){
        const imagePath = adversarialDirectory + getAdversarialName(perturbationLevel);
        const image = await preloadImage(imagePath, originalImage.width, originalImage.height);
        return imageToTensor(image).data(); // memory leak? todo
    }

    return perturbationLevels.map(loadAdversarial);
}
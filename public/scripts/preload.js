
function preloadImage(imageURL) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = error => reject(error);
        image.src = imageURL;
        image.width = IMAGE_WIDTH;
        image.height = IMAGE_HEIGHT;
    });
}


async function loadAssetsForRound(data, model){
    data.image = await preloadImage(data.image);

    if (data.perturbationType === PERTURBATION_TYPES.NOISE){
        data.perturbations = await Promise.all(generateNoise(data.perturbationLevels));
    }
    else if (data.perturbationType === PERTURBATION_TYPES.ADVERSARIAL){
        model = await model;
        data.perturbations = await Promise.all(generateAdversarials(model, data.image, data.perturbationLevels));
    }

    return data;
}


function preloadAssets(data) {
    data.model = Model(data.model);
    data.rounds = data.rounds.map(round => loadAssetsForRound(round, data.model));
    return data;
}
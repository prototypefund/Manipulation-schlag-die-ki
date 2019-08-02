function selectCategories(images, numRounds){
    const availableCategories = Array.from(new Set(images.map(map => map.category)));
    if (availableCategories.length < numRounds)
        throw Error("Too few categories");

    return shuffle(availableCategories).slice(0, numRounds);
}

function selectImage(category, images){
    const imagesForCategory = images.filter(image => image.category === category);
    if (imagesForCategory.length < 1)
        throw Error("Too few images");

    return shuffle(imagesForCategory)[0];
}

function selectAnswers(category, label) {
    const possibleAnswers = Object.keys(IMAGENET_CATEGORIES[category]);
    if (possibleAnswers.length < 3)
        throw Error("Too few labels in category " + category);

    const incorrectAnswers = possibleAnswers.filter(answer => answer !== label);
    const selectedIncorrectAnswers = shuffle(incorrectAnswers).slice(0, 2);
    const answers = selectedIncorrectAnswers.concat(label);
    return shuffle(answers);
}


async function prepareRound(model, roundId, category, config){
    const imageConfig = selectImage(category, config.IMAGES);
    const imageData = await preloadImage(config.IMAGE_DIRECTORY + imageConfig.image, config.IMAGE_WIDTH, config.IMAGE_HEIGHT);
    const answers = selectAnswers(category, imageConfig.label);

    const perturbationType = config.ROUNDS[roundId];
    const perturbations = await PerturbationFactory(model, config).generatePerturbations(imageData, perturbationType);

    return {roundId: roundId+1, // humans count from 1
            category: category, label: imageConfig.label, answers: answers,
            image: imageData, perturbations: perturbations};

}

async function prepareData(config){
    const preparedData = {};
    preparedData.model = await MobilenetWrapper(config.MODEL);

    const numRounds = config.ROUNDS.length;
    const categories = selectCategories(config.IMAGES, numRounds);

    preparedData.rounds = await Promise.all(categories.map((category, i) => prepareRound(preparedData.model, i, category, config)));

    return preparedData
}
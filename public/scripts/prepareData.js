
function preloadImage(imageName) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = error => reject(error);
        image.src = IMAGE_PATH + imageName;
        image.width = IMAGE_WIDTH;
        image.height = IMAGE_HEIGHT;
    });
}


async function createPerturbations(model, image, perturbationType){
    if (perturbationType === PERTURBATION_TYPES.NOISE){
        return await Promise.all(generateNoise(PERTURBATION_LEVELS));
    }
    else if (perturbationType === PERTURBATION_TYPES.ADVERSARIAL){
        model = await model;
        return await Promise.all(generateAdversarials(model, image, PERTURBATION_LEVELS));
    }
    else if (perturbationType === PERTURBATION_TYPES.NONE){
        return null;
    }
    else
        throw Error("Unknown perturbation type");
}


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
        throw Error("Too few labels in category "+category);

    const incorrectAnswers = possibleAnswers.filter(answer => answer !== label);
    const selectedIncorrectAnswers = shuffle(incorrectAnswers).slice(0,2);
    const answers = selectedIncorrectAnswers.concat(label);
    return shuffle(answers);
}


async function prepareData(data){
    const preparedData = {};
    preparedData.model = await Model(data.model);

    // choose which categories / questions / answers will be shown
    const numRounds = data.rounds.length;
    const categories = selectCategories(data.images, numRounds);
    const images = categories.map(category => selectImage(category, data.images));
    const answers = images.map(image => selectAnswers(image.category, image.label));

    // compile and preload all data for the rounds
    preparedData.rounds = [];
    for (let i=0; i<numRounds; i++){
        const image = await preloadImage(images[i].image);
        const perturbations = await createPerturbations(preparedData.model, image, data.rounds[i]);
        const round = {roundId: i+1, category: images[i].category, label: images[i].label,
                       image: image, answers: answers, perturbations: perturbations};
        preparedData.rounds.push(round);
    }

    return preparedData
}

function preloadImage(imageURL){
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = error => reject(error);
        image.src = imageURL;
    });
}

function RoundAssets(image, perturbations, answers, correct,){
    const obj = {};

    obj.load = async function(){
        return {image: await image,
                perturbations: await perturbations,
                answers: answers,
                correct: correct}
    };

    return obj;
}

function loadRound1Assets(data){
    return RoundAssets(preloadImage(data.image), null, data.answers, data.correct);
}

function loadRound2Assets(data){
    const noise = generateNoise(400, 300);
    const perturbationLevels = Array.from(range(0.0, 1.0, 0.1)).reverse().map(e => e*255);
    const perturbations = Promise.all(perturbationLevels.map(opacity => setNoiseOpacity(noise, opacity)));
    return RoundAssets(preloadImage(data.image), perturbations, data.answers, data.correct);
}

function loadRound3Assets(data){
    const noise = generateNoise(400, 300);
    const perturbationLevels = Array.from(range(0.0, 1.0, 0.1)).reverse().map(e => e*255);
    const perturbations = Promise.all(perturbationLevels.map(opacity => setNoiseOpacity(noise, opacity)));
    return RoundAssets(preloadImage(data.image), perturbations, data.answers, data.correct);
}


function preloadAssets(data) {
    const assets = {};
    mobilenet.load().then(model => assets.model = model);
    assets.rounds = [loadRound1Assets(data[0]), loadRound2Assets(data[1]), loadRound3Assets(data[2])];
    return assets;
}
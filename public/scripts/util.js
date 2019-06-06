const RESULT = {"CORRECT": "correct", "INCORRECT": "incorrect"};

function Timer(stepLength, totalSteps, onStep, onTimeout){
    let obj = {};

    obj.steps = 0;
    obj.timer = null;

    obj.start = function() {
        obj.timer = setInterval(obj.onStep, stepLength);
    };

    obj.onStep = function() {
        obj.steps += 1;

        if (onStep instanceof Function)
            onStep();

        if (obj.steps == totalSteps){
            clearInterval(obj.timer);
            if (onTimeout instanceof Function)
                onTimeout();
        }
    };

    obj.cancel = function() {
        clearInterval(obj.timer);
    };

    return obj;
}

function generateNoise(width, height) {
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

ASSETS = {"images": {}};

function preloadAssets(data) {
    for (let round in data) {
        let imageURL = data[round].image;

        let imageData = new Image();
        imageData.crossOrigin = "anonymous";
        imageData.onload = () => ASSETS["images"][imageURL] = imageData;
        imageData.src = imageURL;
    }

    mobilenet.load().then(model => ASSETS["model"] = model);
}
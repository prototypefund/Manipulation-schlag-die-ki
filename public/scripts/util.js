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
            onStep(obj.steps);

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



function shuffle(a) {
    a = [...a]; // copy
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}



function preloadImage(imagePath, width, height) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = error => reject(error);
        image.src = imagePath;
        image.width = width;
        image.height = height;
    });
}

async function imageFromTensor(tensor){

}

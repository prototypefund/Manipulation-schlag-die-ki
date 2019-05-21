

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

    return obj;
}

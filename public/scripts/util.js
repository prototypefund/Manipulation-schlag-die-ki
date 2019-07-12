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



function zip(array1, array2){
    if (array1.length != array2.length)
        throw Error("Arrays for zip must be the same length");
    return array1.map((value1, index) => [value1, array2[index]]);
}

function* range(start, end, step){
    if (step < 0)
        throw Error("Negative ranges not supported");
    for (let i=start; i<end; i+=step)
        yield i;
}
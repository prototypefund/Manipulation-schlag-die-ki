const RESULT = {"CORRECT": "correct", "INCORRECT": "incorrect"};
const STATUS = {"NOT_STARTED": "not_started", "WAITING": "waiting", "FINISHED": "finished"};


// riot mount allows mounting to elements with some given ID or class
// since there might be multiple elements with some class, mounting returns an array
// since we always to ID and never to class, we are only ever interested in the first item of that array
// -> let's make this explicit
function mountToId(id, tagName, opts) {
    let selector = "#" + id;
    let mounted = riot.mount(selector, tagName, opts);
    return mounted[0];
}

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
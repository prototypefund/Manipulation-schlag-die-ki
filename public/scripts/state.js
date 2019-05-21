const RESULT = {"CORRECT": "correct", "INCORRECT": "incorrect"};
const STATUS = {"NOT_STARTED": "not_started", "WAITING": "waiting", "FINISHED": "finished"};


function State() {
    let obj = {};
    obj.mounted = {};

    // riot mount allows mounting to elements with some given ID or class
    // since there might be multiple elements with some class, mounting returns an array
    // since we always to ID and never to class, we are only ever interested in the first item of that array
    obj.mount = function(id, tagName, opts) {
        let selector = "#" + id;
        obj.mounted[id] = riot.mount(selector, tagName, opts)[0];
    };

    obj.unmount = function(id) {
        if (id in obj.mounted){
            obj.mounted[id].unmount(true); // true = keep parent element
            delete obj.mounted[id];
        } else {
            console.log("Trying to unmount already unmounted element "+id)
            //throw Error("Trying to unmount already unmounted element "+id);
        }
    };

    obj.update = function(id, opts) {
        if (id in obj.mounted){
            for (let key in opts)
                obj.mounted[id].opts[key] = opts[key];
            obj.mounted[id].update();
        } else {
            throw Error("Trying to update unmounted element "+id);
        }
    };

    return obj;
}
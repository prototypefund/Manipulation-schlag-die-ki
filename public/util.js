// riot mount allows mounting to elements with some given ID or class
// since there might be multiple elements with some class, mounting returns an array
// since we always to ID and never to class, we are only ever interested in the first item of that array
// -> let's make this explicit
function mountToId(id, tagName, opts) {
    let selector = "#" + id;
    let mounted = riot.mount(selector, tagName, opts);
    return mounted[0];
}

const RESULT = {"CORRECT": "correct", "INCORRECT": "incorrect"};
const STATUS = {"NOT_STARTED": "not_started", "WAITING": "waiting", "FINISHED": "finished"};
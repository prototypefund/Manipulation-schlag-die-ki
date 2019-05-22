function AI(roundIndex, onFinished) {
    let obj = {};

    obj.start = function() {
        let timeout = 300;
        if (roundIndex == 1)
            timeout = 2000;
        if (roundIndex == 2)
            timeout = 10000;

        obj.timer = setTimeout(onFinished, timeout);
    };

    obj.stop = function(){
        clearTimeout(obj.timer);
    };

    return obj;
}
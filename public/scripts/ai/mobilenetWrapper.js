async function MobilenetWrapper(modelURL){
    MODEL_INPUT_SIZE = 224;
    OFFSET = 127.5;

    let obj = {};

    obj.model = await tf.loadLayersModel(modelURL);


    obj.scaleImage = function(image){
        return tf.tidy(() => {
            const offset = tf.scalar(OFFSET);
            return image.toFloat().sub(offset).div(offset)
        });
    };

    obj.unscaleImage = function(image){
        return tf.tidy(() => {
            const offset = tf.scalar(OFFSET);
            return image.toFloat().mul(offset).add(offset)
        });
    };

    obj.prepareImage = function(image){
        return tf.tidy(() => {
            const imageTensor = tf.browser.fromPixels(image).expandDims();
            const imageResized = tf.image.resizeBilinear(imageTensor,[MODEL_INPUT_SIZE,MODEL_INPUT_SIZE]);
            const imageScaled = obj.scaleImage(imageResized);
            return imageScaled
        });
    };

    obj.predict = function(image) {
        return tf.tidy(() => {
            return obj.model.predict(obj.prepareImage(image));
        });
    };

    obj.classify = function(image){
        const predictions = obj.predict(image);
        const indexTop = predictions.argMax(1).dataSync()[0]; // todo sync
        const scoreTop = predictions.dataSync()[indexTop]; // todo sync
        const nameTop = IMAGENET_CLASSES[indexTop];
        return {classIndex: indexTop, score: scoreTop, name: nameTop};
    };

    return obj;

}

// export for node.js
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {MobilenetWrapper};

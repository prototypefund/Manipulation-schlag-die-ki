mapping = {"Katze" :["Egyptian cat", "Persian cat", "Siamese cat", "tabby, tabby cat", "tiger cat", "cougar, puma, ",
                     "catamount, mountain lion, painter, panther, Felis concolor", "lynx, catamount"],
           "Strand": ["seashore, coast, seacoast, sea-coast", "sandbar, sand bar"],
           "Boot": ["speedboat", "lifeboat"]};

MODEL_INPUT_SIZE = 224;

async function Model(modelURL){
    let obj = {};

    obj.model = await tf.loadLayersModel(modelURL);

    obj.scaleImage = function(image){
        return tf.tidy(() => {
            const offset = tf.scalar(127.5);
            return image.toFloat().sub(offset).div(offset)
        });
    };

    obj.unscaleImage = function(image){
        return tf.tidy(() => {
            const offset = tf.scalar(127.5);
            return image.toFloat().mul(offset).add(offset)
        });
    };


    obj.predictAndCheck = async function(image, correctAnswer) {
        return tf.tidy(() => {
            const imageTensor = tf.browser.fromPixels(image).expandDims();
            const imageResized = tf.image.resizeBilinear(imageTensor,[MODEL_INPUT_SIZE,MODEL_INPUT_SIZE]);
            const imageScaled = obj.scaleImage(imageResized);
            const predictions = obj.model.predict(imageScaled);

            const indexTop = predictions.argMax(1).dataSync()[0]; // todo sync
            const scoreTop = predictions.dataSync()[indexTop]; // todo sync
            const classTop = IMAGENET_CLASSES[indexTop];
            console.log(classTop, scoreTop);

            // todo what is a good probability cutoff?
            if (mapping[correctAnswer].includes(classTop))
                return [CONTESTANTS.MACHINE, RESULTS.CORRECT];
            else
                return [CONTESTANTS.MACHINE, RESULTS.INCORRECT];
        });
    };

    return obj;

}

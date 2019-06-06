mapping = {"Katze" :["Egyptian cat", "Persian cat", "Siamese cat", "tabby, tabby cat", "tiger cat", "cougar, puma, ",
                     "catamount, mountain lion, painter, panther, Felis concolor", "lynx, catamount"],
           "Strand": ["seashore, coast, seacoast, sea-coast"],
           "Boot": ["speedboat"]};

function AI(image, correctAnswer, onPredicted) {
    let obj = {};

    obj.canceled = false;

    obj.predict = function() {
        ASSETS["model"].classify(image, 3).then(obj.checkAnswer);
    };

    obj.checkAnswer = function(topPredictions){
        // do not perform the callback if the ai has been canceled
        if (obj.canceled)
            return;

        let top = topPredictions[0];

        if ((top.probability >= 0.5) && (mapping[correctAnswer].includes(top.className)))
            onPredicted(RESULT.CORRECT);
        else
            onPredicted(RESULT.INCORRECT);
    };

    obj.cancel = () => obj.canceled = true;

    return obj;
}
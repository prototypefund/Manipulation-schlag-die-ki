function AIContestant(model){

    const obj = {};

    obj.predictAndCheck = async function(image, category, label) {
        return tf.tidy(() => {
            const result = model.classify(image);
            console.log(result);

            // todo what is a good probability cutoff?
            if (IMAGENET_CATEGORIES[category][label].includes(result.classIndex.toString()))
                return [CONTESTANTS.MACHINE, RESULTS.CORRECT];
            else
                return [CONTESTANTS.MACHINE, RESULTS.INCORRECT];
        });
    };

    return obj;
}
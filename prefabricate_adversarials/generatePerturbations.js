// external modules
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs").promises;
const path = require("pathlib");
const jpeg = require("jpeg-js");
const { createCanvas, loadImage } = require("canvas");

// own modules
const {MobilenetWrapper} = require("../public/scripts/ai/mobilenetWrapper.js");
const {initFGSM} = require("../public/scripts/ai/FGSM.js");
// import/export is a mess when script should support both browser as well as node.js
// workaround: put the needed variables into global scope
global.tf = tf;

// all this is necessary just to load config...
const {PERTURBATION_TYPES} = require("../public/scripts/types/enums.js");
const {TRANSLATION} = require("../public/scripts/translation.js");
global.PERTURBATION_TYPES = PERTURBATION_TYPES;
global.TRANSLATION = TRANSLATION;
const {CONFIG} = require("../public/scripts/config.js");

async function prepareDirectories(){

    // point to base path "public"
    const BASE_PATH = path("public");
    CONFIG.IMAGE_DIRECTORY = BASE_PATH.extend(CONFIG.IMAGE_DIRECTORY);
    CONFIG.ADVERSARIAL_DIRECTORY = BASE_PATH.extend(CONFIG.ADVERSARIAL_DIRECTORY);

    // create output directory, if necessary
    await fs.mkdir(CONFIG.ADVERSARIAL_DIRECTORY.path, { recursive: true });
}


async function loadImageToCanvas(imagePath){
    const image = await loadImage(imagePath);
    const canvas = createCanvas(CONFIG.IMAGE_WIDTH, CONFIG.IMAGE_HEIGHT);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
}


async function saveImage(imageDataPromise, imagePath){
    const imageData = await imageDataPromise;
    const imageWithMetadata = {data: imageData, width: CONFIG.IMAGE_WIDTH, height: CONFIG.IMAGE_HEIGHT};
    const jpegImageData = jpeg.encode(imageWithMetadata, 100);
    return fs.writeFile(imagePath, jpegImageData.data);
}

function getAdversarialOutputPath(originalImageName, perturbationLevel){
    const parts = path(originalImageName).parse();
    const newName = parts.name + "." + perturbationLevel + parts.ext;
    return CONFIG.ADVERSARIAL_DIRECTORY.extend(newName).path;
}


async function createAdversarial(model, imageName, perturbationLevel){
    // load
    const FGSM = initFGSM(model);
    const imageCanvas = await loadImageToCanvas(CONFIG.IMAGE_DIRECTORY.extend(imageName).path);

    // attack
    const adversarial = tf.tidy(() => {
        const imageTensor = model.prepareImage(imageCanvas);

        // run attack
        const adversarialScaled = FGSM.targetedPerturbation(imageTensor, 1, perturbationLevel / 255, 20);
        const adversarialUnscaled = model.unscaleImage(adversarialScaled).toInt().gather(0);
        const adversarialResized = tf.image.resizeBilinear(adversarialUnscaled, [CONFIG.IMAGE_HEIGHT, CONFIG.IMAGE_WIDTH]);

        // add opacity channel
        const opacity = tf.fill([CONFIG.IMAGE_HEIGHT, CONFIG.IMAGE_WIDTH, 1], 255);
        const adversarialWithOpacity = adversarialResized.concat(opacity, 2).toInt();
        return adversarialWithOpacity;
    });

    // write
    const outputPath = getAdversarialOutputPath(imageName, perturbationLevel);
    await saveImage(await adversarial.data(), outputPath);
    console.log("Finished generating "+outputPath);
}

async function main(){
    await prepareDirectories();

    const model = await MobilenetWrapper(CONFIG.MODEL);
    console.log("Model loaded");
    console.log("Generating adversarials, this will take a while");

    let jobs = [];
    for (let img in CONFIG.IMAGES){
        for (let level in CONFIG.PERTURBATION_LEVELS){
            jobs.push(createAdversarial(model, CONFIG.IMAGES[img].image, CONFIG.PERTURBATION_LEVELS[level]));
        }
    }

    await Promise.all(jobs);
}

main();

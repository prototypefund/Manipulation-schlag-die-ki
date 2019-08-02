const CONFIG = {};

CONFIG.MODEL = "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json";
CONFIG.MODEL_NAME = CONFIG.MODEL.split("/").slice(-2)[0]; // modelname is hopefully second to last element

CONFIG.IMAGE_WIDTH = 400;
CONFIG.IMAGE_HEIGHT = 300;
CONFIG.IMAGE_DIRECTORY = "images/original/"+CONFIG.IMAGE_WIDTH+"x"+CONFIG.IMAGE_HEIGHT+"/";
CONFIG.ADVERSARIAL_DIRECTORY = "images/adversarial/"+CONFIG.IMAGE_WIDTH+"x"+CONFIG.IMAGE_HEIGHT+"/"+CONFIG.MODEL_NAME+"/";

CONFIG.IMAGES = [
    {"category": "vegetable", "label": "bell pepper", "image": "22412161608_b4e56f6f68_o.jpg"},
    {"category": "vegetable", "label": "cucumber", "image": "20086102049_6a6fe8324b_o.jpg"},
    {"category": "fruit", "label": "orange", "image": "15804841441_d1a7ebf220_o.jpg"},
    {"category": "fruit", "label": "lemon", "image": "18137869969_2c73df3093_o.jpg"},
    {"category": "fruit", "label": "apple", "image": "15641552107_1499cf3467_o.jpg"},
    {"category": "fruit", "label": "pineapple", "image": "15641118878_218751aea3_o.jpg"},
    {"category": "food", "label": "ice cream", "image": "37981694425_13bd0d73a3_o.jpg"},
    {"category": "food", "label": "pretzel", "image": "5539777265_ca5f5df28b_o.jpg"},
    {"category": "musical instrument", "label": "violin", "image": "26866545124_60586dd931_o.jpg"},
    {"category": "musical instrument", "label": "piano", "image": "3042002017_d257a85689_o.jpg"},
    {"category": "tool", "label": "hammer", "image": "40417809310_f91c56e595_o.jpg"},
    {"category": "tool", "label": "shovel", "image": "14098179450_d90af4cd9e_o.jpg"},
    {"category": "tool", "label": "hammer", "image": "30819423400_fbc99efd8d_o.jpg"},
    {"category": "vehicle", "label": "bike", "image": "14703320621_06d6483764_o.jpg"},
    {"category": "vehicle", "label": "train", "image": "4910981388_2b6f7dbc2e_b.jpg"},
    {"category": "vehicle", "label": "watercraft", "image": "3564045297_3580780c97_o.jpg"},
    {"category": "animal", "label": "insect", "image": "30336870188_1494167bbc_o.jpg"},
    {"category": "animal", "label": "cat", "image": "16114914770_ea52f6f8e1_o.jpg"},
    {"category": "animal", "label": "rabbit/hare", "image": "5251390861_83fd45732d_o.jpg"},
    {"category": "animal", "label": "fox", "image": "4306396499_94c5dd3159_o.jpg"},
    {"category": "animal", "label": "bird", "image": "5219382726_6a75b28337_o.jpg"},
    {"category": "animal", "label": "bird", "image": "41039412502_e70dd5cb1c_o.jpg"},
];

CONFIG.PERTURBATION_LEVELS = [210 , 185, 160, 135, 110, 85, 60, 35, 15];
CONFIG.ROUNDS = [PERTURBATION_TYPES.NONE, PERTURBATION_TYPES.NOISE, PERTURBATION_TYPES.ADVERSARIAL];
CONFIG.USE_PREFAB_ADVERSARIALS = true;

// export for node.js
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {CONFIG};
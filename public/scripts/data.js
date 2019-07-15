const PERTURBATION_TYPES = {"NOISE": "NOISE", "ADVERSARIAL": "ADVERSARIAL"};

const round1 = {"image": "https://www.fodors.com/wp-content/uploads/2018/04/National-Seashores-Cape-Cod-National-Seashore-Massachusetts.jpg",
                "answers": ["Strand", "Haus", "Mensch"],
                "correct": 0};

const round2 = {"image": "https://news.nationalgeographic.com/content/dam/news/2018/05/17/you-can-train-your-cat/02-cat-training-NationalGeographic_1484324.ngsversion.1526587209178.adapt.1900.1.jpg",
                "answers": ["Hund", "Maus", "Katze"],
                "correct": 2,
                "perturbationType": PERTURBATION_TYPES.NOISE,
                "perturbationLevels": [210, 185, 160, 135, 110, 85, 60, 35, 15]};

const round3 = {"image": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Motorboat_at_Kankaria_lake.JPG",
                "answers": ["Boot", "Stuhl", "Fahrrad"],
                "correct": 0,
                "perturbationType": PERTURBATION_TYPES.NOISE,
                "perturbationLevels": [210, 185, 160, 135, 110, 85, 60, 35, 15]};

const DATA = {"model": "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json",
              "rounds": [round3, round2, round1]};
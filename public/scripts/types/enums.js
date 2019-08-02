const CONTESTANTS = {"HUMAN": "HUMAN", "MACHINE": "MACHINE", "TIMEOUT": "TIMEOUT"};
const RESULTS = {"CORRECT": "CORRECT", "INCORRECT": "INCORRECT"};
const PERTURBATION_TYPES = {"NONE": "NONE", "NOISE": "NOISE", "ADVERSARIAL": "ADVERSARIAL"};

// export for node.js
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {PERTURBATION_TYPES};
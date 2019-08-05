main:
	@echo "Supported commands: 'make adversarials'"

.PHONY: adversarial
adversarials:
	docker build -t tfjs-node -f prefabricate_adversarials/Dockerfile .
	docker run --rm -it -u `id -u`:`id -g` -v $(PWD):/usr/src/app tfjs-node node prefabricate_adversarials/generatePerturbations.js


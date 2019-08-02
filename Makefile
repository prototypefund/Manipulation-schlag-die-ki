main:
	@echo "Supported commands: 'make adversarials'"

.PHONY: adversarial
adversarials:
	docker build -t tfjs-node -f adversarial/Dockerfile .
	docker run --rm -it -u `id -u`:`id -g` -v $(PWD):/usr/src/app tfjs-node node adversarial/generatePerturbations.js

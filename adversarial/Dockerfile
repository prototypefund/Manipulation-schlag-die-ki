FROM node:12.7.0
RUN npm install jpeg-js
RUN npm install @tensorflow/tfjs-node
RUN rm -rf node_modules/@tensorflow/tfjs-converter/.git/
RUN npm install canvas
RUN npm install -S pathlib
WORKDIR /usr/src/app

FROM node:16-alpine

EXPOSE 3567

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install

RUN npm install -g expo-cli

RUN npm install eas-cli

RUN eas login

CMD npx expo start --dev-client
FROM ghcr.io/puppeteer/puppeteer:21.0.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY index.js .

EXPOSE 3000
CMD ["node", "index.js"]

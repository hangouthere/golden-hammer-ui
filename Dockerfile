FROM node:18-alpine3.15

ENV NODE_ENV=production

# Node Compilation stuff
RUN apk add --no-cache \
    g++ \
    gcc \
    git \
    libgcc \
    libstdc++ \
    linux-headers \
    make \
    python3 \
    sqlite && \
    mkdir /app && chown -R node.node /app

WORKDIR /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install --production

COPY --chown=node:node . .

CMD ["npm", "start"]

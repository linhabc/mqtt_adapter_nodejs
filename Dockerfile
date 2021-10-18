FROM node:14-alpine

ENV ADAPTER_MQTT_PORT=1881

ENV MQTT_HOST="mqtt://10.4.200.147:1883"

ENV USER_NAME_DEFAULT=linh
ENV PASSWORD_DEFAULT=linh
ENV CHANNEL_DEFAULT=/h/2
ENV CHANNEL_RECEIVE_DEFAULT=/log

# ENV REDIS_HOST="host.docker.internal"
# ENV REDIS_PORT="6379"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
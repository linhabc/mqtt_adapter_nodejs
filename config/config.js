module.exports = {
  adapterMqttport: process.env.ADAPTER_MQTT_PORT,

  mqttHost: process.env.MQTT_HOST,

  defaultUserName: process.env.USER_NAME_DEFAULT,
  defaultPassword: process.env.PASSWORD_DEFAULT,
  defaultChannel: process.env.CHANNEL_DEFAULT,
  channelReceiveDefault: process.env.CHANNEL_RECEIVE_DEFAULT,

  redisMaster: process.env.REDIS_MASTER,
  redisSentinel1: process.env.REDIS_SENTINEL_1,
  redisSentinelPort1: process.env.REDIS_SENTINEL_PORT_1,
  redisSentinel2: process.env.REDIS_SENTINEL_2,
  redisSentinelPort2: process.env.REDIS_SENTINEL_PORT_2,
  redisSentinel3: process.env.REDIS_SENTINEL_3,
  redisSentinelPort3: process.env.REDIS_SENTINEL_PORT_3,

  // redisHost: process.env.REDIS_HOST,
  // redisPort: process.env.REDIS_PORT,
};

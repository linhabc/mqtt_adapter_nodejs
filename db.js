// // const redis = require("redis");
// const { promisifyAll } = require("bluebird");
// var {
//   redisMaster,
//   redisSentinel1,
//   redisSentinelPort1,
//   redisSentinel2,
//   redisSentinelPort2,
//   redisSentinel3,
//   redisSentinelPort3,
// } = require("./config/config.js");

// // sentinel
// const Redis = require("ioredis");

// const redis = new Redis({
//   sentinels: [
//     { host: redisSentinel1, port: redisSentinelPort1 },
//     { host: redisSentinel2, port: redisSentinelPort2 },
//     { host: redisSentinel3, port: redisSentinelPort3 },
//   ],
//   name: redisMaster,
// });

// promisifyAll(redis);

// const setKeyAndValue = async (key, value) => {
//   await redis.setAsync(key, JSON.stringify(value));
// };

// const getValueByKey = async (key) => {
//   var res = await redis.getAsync(key);
//   return JSON.parse(res);
// };

// // redis.set("foo", "bar");

// // const options = {
// //   host: redisHost,
// //   port: redisPort,
// // };

// // const redisClient = redis.createClient(options);

// // const setKeyAndValue = async (key, value) => {
// //   await redisClient.setAsync(key, JSON.stringify(value));
// // };

// // const getValueByKey = async (key) => {
// //   var res = await redisClient.getAsync(key);
// //   return JSON.parse(res);
// // };

// module.exports = {
//   setKeyAndValue,
//   getValueByKey,
// };

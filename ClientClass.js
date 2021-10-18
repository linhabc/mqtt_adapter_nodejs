var mqtt = require("mqtt");
var aedes = require("./aedes.js");
var {
  mqttHost,
  channelReceiveDefault,
  defaultUserName,
  defaultPassword,
  defaultChannel,
} = require("./config/config.js");

class Client {
  constructor(clientConfig) {
    this.client;
    this.clientConfig = clientConfig;
  }

  createClient() {
    var self = this;
    var options = {
      clientId: this.clientConfig.clientId,
      username: this.clientConfig.username,
      password: this.clientConfig.password,
      reconnectPeriod: 1000,
      clean: true,
      encoding: "utf8",
    };
    this.client = mqtt.connect(mqttHost, options);

    this.client.on("connect", function () {
      // self.client.subscribe(self.clientConfig.channel + "/#");
      self.client.subscribe(self.clientConfig.channel);

      // self.client.publish(self.clientConfig.channel, "Hello from client A");

      console.log("[VERNEMQ] Client connected to vernemq");
    });

    this.client.on("disconnect", function (packet) {
      if (packet) {
        console.log("[VERNEMQ] clientDisconnect: ", packet.payload.toString());
      }
    });

    this.client.on("message", function (topic, message, packet) {
      if (topic) {
        console.log("[VERNEMQ] topic on message: ", topic.toString());
      }
      if (message) {
        console.log("[VERNEMQ] message on message: ", message.toString());
      }
      if (packet) {
        console.log("[VERNEMQ] message on message: ", JSON.stringify(packet));
      }

      console.log("[VERNEMQ] channel: " + topic);
      // if (packet && topic === channel) {
      //   console.log(
      //     "[VERNEMQ] Publish message to device: ",
      //     packet.payload.toString()
      //   );

      // if (topic.includes("/b/"))

      aedes.publish({
        cmd: "publish",
        qos: 0,
        topic: topic,
        payload: packet.payload,
        retain: false,
      });
      // }
    });

    this.client.on("packetreceive", function (packet) {
      if (packet) {
        // console.log("packetreceive: ", packet);
      }
    });
  }

  publishMessage(topic, packet) {
    console.log("[VERNEMQ] publishMessage: ", packet.payload);
    this.client.publish(topic, packet.payload);
  }

  disconnectClient() {
    this.client.end();
  }
}

module.exports = Client;

require("dotenv").config();
var aedes = require("./aedes.js");
var server = require("net").createServer(aedes.handle);
var Client = require("./ClientClass.js");
// var { setKeyAndValue, getValueByKey } = require("./db.js");

var { adapterMqttport, channelReceiveDefault } = require("./config/config.js");

var {
  defaultUserName,
  defaultPassword,
  defaultChannel,
} = require("./config/config.js");

// (async (key) => {
//   await setKeyAndValue("361581dc-2552-4fe9-8016-2e5940c5ff8c", {
//     clientId: "394d1824-e86d-429a-9213-be9b10a82f3b",
//     username: "394d1824-e86d-429a-9213-be9b10a82f3b",
//     password: "c46e7735-d5dc-4346-aa00-21177795b008",
//     channel: "/channels/cd0d0307-9039-4a13-adb3-31d6d67a4787/messages",
//     channelClientSub: defaultChannel + "/h/sub",
//     channelClientPub: defaultChannel + "/h/pub",
//   });
//   const res = await getValueByKey("361581dc-2552-4fe9-8016-2e5940c5ff8c");
//   console.log(res);
// })();

let clientSet = {};

let clientDefault = new Client({
  clientId: "client.id",
  username: defaultUserName,
  password: defaultPassword,
  channel: defaultChannel,
});
clientDefault.createClient();

aedes.on("client", async (client) => {
  console.log("[MQTT_NODE] Client: " + client.id + " connected to mqtt_node");
  // moi khi co mot ket noi moi den adapter -> tao mot client de ket noi den vernemq
  if (!clientSet.hasOwnProperty(client.id)) {
    let clientConfig = {
      clientId: client.id,
      username: defaultUserName,
      password: defaultPassword,
      channel: defaultChannel,
    };

    // let newClient = new Client(clientConfig);
    // newClient.createClient();
    // clientSet[client.id] = newClient;
  } else {
    console.log("[MQTT_NODE] Client with id: " + client.id + " already exist");
  }
});

// client publish message to adapter
aedes.on("publish", function (packet, client) {
  if (client) {
    console.log(
      "[MQTT_NODE] message from " + client.id + " : " + JSON.stringify(packet)
    );

    // forward to Mainflux
    // clientDefault.client.on("message", function (topic, message, packet) {});
    console.log("object: " + packet.topic);
    clientDefault.publishMessage(channelReceiveDefault + packet.topic, packet);
  }
});

aedes.on("subscribe", function (subscriptions, client) {
  if (client) {
    clientDefault.clientConfig.channel = subscriptions[0].topic;

    // console.log(clientSet[client.id]);
    // console.log(channelReceiveDefault + subscriptions[0].topic);

    clientDefault.client.subscribe(subscriptions[0].topic);
    console.log(
      "[MQTT_NODE] subscribe from client: ",
      subscriptions,
      client.id
    );
  }
});

aedes.on("clientDisconnect", function (client) {
  if (client) {
    console.log("[MQTT_NODE] clientDisconnect: ", client.id);
    if (clientSet.hasOwnProperty(client.id)) {
      clientSet[client.id].disconnectClient();
      delete clientSet[client.id];
    }
  }
});

aedes.on("clientError", function (client, err) {
  console.log("[MQTT_NODE] client error: ", client.id, err.message, err.stack);
});

server.listen(adapterMqttport, function () {
  console.log("[MQTT_NODE] server listening on port", adapterMqttport);
});

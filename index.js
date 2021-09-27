require("dotenv").config();
var aedes = require("./aedes.js");
var server = require("net").createServer(aedes.handle);
var Client = require("./ClientClass.js");
var { setKeyAndValue, getValueByKey } = require("./db.js");

var { adapterMqttport } = require("./config/config.js");

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

aedes.on("client", async (client) => {
  console.log("Client: " + client.id + " connected to mqtt_node");
  // moi khi co mot ket noi moi den adapter -> tao mot client de ket noi den mainflux
  if (!clientSet.hasOwnProperty(client.id)) {
    let clientConfigRes = await getValueByKey(client.id.substring(0, 36)); // query database ra clientConfig -> truyen vao constructor

    if (clientConfigRes == null) {
      clientConfigRes = {
        clientId: client.id,
        username: defaultUserName,
        password: defaultPassword,
        channel: defaultChannel,
        // channelClient: "/h/2",
      };
    }

    let newClient = new Client(clientConfigRes);
    newClient.createClient();
    clientSet[client.id] = newClient;
  } else {
    console.log("Client with id: " + client.id + " already exist");
  }
});

// client publish message to adapter
aedes.on("publish", function (packet, client) {
  if (client) {
    console.log("message from client: ", client.id);
    console.log(packet.payload.toString());

    // forward to Mainflux
    clientSet[client.id].publishMessage(packet);
  }
});

aedes.on("subscribe", function (subscriptions, client) {
  if (client) {
    clientSet[client.id].clientConfig.channelClient = subscriptions[0].topic;

    // adding client topic to the end of
    clientSet[client.id].clientConfig.channelSending =
      clientSet[client.id].clientConfig.channel +
      subscriptions[0].topic +
      "/client";

    console.log(clientSet[client.id]);
    console.log("subscribe from client: ", subscriptions, client.id);
  }
});

aedes.on("clientDisconnect", function (client) {
  if (client) {
    console.log("clientDisconnect: ", client.id);
    if (clientSet.hasOwnProperty(client.id)) {
      clientSet[client.id].disconnectClient();
      delete clientSet[client.id];
    }
  }
});

aedes.on("clientError", function (client, err) {
  console.log("client error: ", client.id, err.message, err.stack);
});

server.listen(adapterMqttport, function () {
  console.log("server listening on port", adapterMqttport);
});

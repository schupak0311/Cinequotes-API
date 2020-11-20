const pubsub = require("@google-cloud/pubsub");
const grpc = require("@grpc/grpc-js");

const [pubsubHost, pubsubPort] = process.env.PUBSUB_EMULATOR_HOST.split(":");
const options = {
  projectId: "dummy", // projectId doesn’t matter while using the emulator
  servicePath: pubsubHost,
  port: pubsubPort,
  sslCreds: grpc.credentials.createInsecure(),
};

const pubSubClient = new pubsub.PubSub(options);

export const createTopic = async (topicName: string) => {
  try {
    await pubSubClient.createTopic(topicName);
  } catch (e) {
    console.warn(e.details);
  }
};

export const publishToTopic = async (topicName: string, data: any) => {
  const payload = JSON.stringify(data);
  const dataBuffer = Buffer.from(payload);

  await createTopic(topicName)
  const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
  return messageId;
};

export const createSubscription = async (
  topicName: string,
  subscriptionName: string
) => {
  try {
    await pubSubClient.topic(topicName).createSubscription(subscriptionName);
  } catch (e) {
    console.warn(e.details);
  }
};

export const listenForPullMessages = (
  subscriptionName: string,
  timeout: number
) => {
  const subscription = pubSubClient.subscription(subscriptionName);

  let messageCount = 0;
  const messageHandler = (message: any) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    message.ack();
  };

  subscription.on("message", messageHandler);

  setTimeout(() => {
    subscription.removeListener("message", messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
};

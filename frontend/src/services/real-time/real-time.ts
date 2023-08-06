//@ts-ignore-next-line
import mqtt, { MqttClient } from 'mqtt/dist/mqtt';

export function RealTimeService(topics?: string[]) {
  let client: MqttClient | undefined;
  
  const validateClientConnected = () => {
    if (!client) {
      throw new Error("Client is not connected yet. Call client.connect() first!");
    }
  };
  
  const connect = (url: string) => {
    console.log(`Connecting to mqtt broker at url`, url)
    client = mqtt.connect(url);
    console.log('after connect')
    addConnectListener(() => {
      console.log('Connected to MQTT Broker');
      topics?.forEach((topic) => subscribe(topic))
      console.log(`Subscribed to topics ${topics}`);
    });
    addDisconnectListener((params: any) => {
      console.log('Connection to MQTT Broker closed', params);
      disconnect()
    });
  }

  const subscribe = (topic: string) => {
    validateClientConnected()
    client?.subscribe(topic)
  }

  const disconnect = () => {
    client?.end()
    client = undefined
  }

  const addConnectListener = (callback: () => unknown) => {
    client?.on('connect', callback);
  };

  const addDisconnectListener = (callback: (params: unknown) => unknown) => {
    client?.on('close', callback);
  };

  const addMessageReceivedListener = (callback: (message: string, topic: string) => unknown) => {
    client?.on('message', (topic: string, message: string) => {
      console.log(`Received message: ${topic} - ${message}`);
      callback(message.toString(), topic);
    });
  };

  return {
    connect,
    subscribe,
    disconnect,
    addConnectListener,
    addDisconnectListener,
    addMessageReceivedListener
  };
}
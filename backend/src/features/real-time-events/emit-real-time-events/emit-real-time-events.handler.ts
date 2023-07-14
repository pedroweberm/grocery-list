import type { AttributeValue, DynamoDBStreamEvent } from 'aws-lambda';
import { PublishCommand, IoTDataPlaneClient } from '@aws-sdk/client-iot-data-plane';

const iotClient = new IoTDataPlaneClient({});

type DatabaseListItem = {
  partition_key: string;
  sort_key: string;
  item_owner_id: string;
  created_at_timestamp: string;
  item_id: string;
  item_list_id: string;
  item_name: string;
  item_status: string;
};

export const EmitRealTimeEventsHandlerFactory = () => {
  const attributeMapToObject = <T extends { [key: string]: unknown }>(attributeMap: { [key: string]: AttributeValue }): T =>
    Object.entries(attributeMap).reduce((acc, [key, value]) => {
      return { ...acc, [key]: Object.values(value)[0] };
    }, {} as T);

  const eventMapper = {
    INSERT: 'item-created',
    MODIFY: 'item-updated',
    REMOVE: 'item-deleted',
    DEFAULT: 'nop',
  };

  const handler = async (event: DynamoDBStreamEvent) => {
    const record = event.Records[0];
    console.log('received record', JSON.stringify(record, null, 2));

    const eventEntity = record.dynamodb?.NewImage?.['entity'].S ?? record.dynamodb?.OldImage?.['entity'].S;

    console.log(`Entity is ${eventEntity}`);

    if (eventEntity === 'list-item') {
      if (!record.dynamodb?.OldImage && !record.dynamodb?.NewImage) {
        return { succes: false, message: 'Not enough data to emit event' };
      }

      const item = attributeMapToObject<DatabaseListItem>(record.dynamodb?.NewImage ? record.dynamodb?.NewImage : record.dynamodb?.OldImage ?? {});

      const listId = item?.['item_list_id'];

      const topic = `lists/${listId}/${eventMapper[event.Records[0].eventName ?? 'DEFAULT']}`;
      const payload = JSON.stringify(item);

      console.log(`Sending payload ${payload} to topic ${topic}`);

      const response = await iotClient.send(
        new PublishCommand({
          topic,
          payload,
        }),
      );

      console.log(`Response was ${JSON.stringify(response, null, 2)}`);

      return { success: true, message: 'Event emitted succesfully' };
    }

    return { success: true, message: 'No event to send' };
  };

  return { handler };
};

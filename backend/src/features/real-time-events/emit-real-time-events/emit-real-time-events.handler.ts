import type { DynamoDBStreamEvent } from 'aws-lambda';
import { PublishCommand, IoTDataPlaneClient } from '@aws-sdk/client-iot-data-plane';

import { DatabaseListItem } from '@features/create-list-item/create-list-item.repository';
import { attributeMapToObject } from '@src/helpers/dynamodb';

const iotClient = new IoTDataPlaneClient({});

export const EmitRealTimeEventsHandlerFactory = () => {
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

      const databaseItem = attributeMapToObject<DatabaseListItem>(
        record.dynamodb?.NewImage ? record.dynamodb?.NewImage : record.dynamodb?.OldImage ?? {},
      );

      const item = {
        id: databaseItem['item_id'],
        name: databaseItem['item_name'],
        status: databaseItem['item_status'],
        ownerId: databaseItem['item_owner_id'],
        listId: databaseItem['item_list_id'],
        createdAtTimestamp: databaseItem['created_at_timestamp'],
      };

      const listId = item?.listId;

      const event = eventMapper[record.eventName ?? 'DEFAULT'];
      const topic = `lists/${listId}/${event}`;
      const payload = JSON.stringify({
        event,
        data: item,
      });

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

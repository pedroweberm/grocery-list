import { assert, object, optional, string } from 'superstruct';

import type { LogClient } from '@clients/logger';
import { CustomError, isCustomError } from '@src/helpers/error';

import type { UpdateListItemUsecase } from './update-list-item.usecase';
import { UpdateListItemErrorCodes } from './update-list-item.errors';

export type UpdateListItemController = ReturnType<typeof UpdateListItemControllerFactory>;

export function UpdateListItemControllerFactory(usecase: UpdateListItemUsecase, logger: LogClient) {
  const UpdateListItemInput = object({
    userId: string(),
    listId: string(),
    itemId: string(),
    name: optional(string()),
    status: optional(string()),
  });

  const validate = (data: unknown) => {
    assert(data, UpdateListItemInput);

    return data;
  };

  const updateListItem = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);

        if (!validated.name && !validated.status) {
          throw new Error('At least 1 update property is required');
        }
      } catch (error: any) {
        throw new CustomError(UpdateListItemErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 204,
        body: {
          success: true,
          message: 'List item updated successfully',
          data: response,
        },
      };
    } catch (err: unknown) {
      if (isCustomError(err)) {
        const error = err as CustomError<UpdateListItemErrorCodes>;

        const mappedError = errorHandler[error.code ?? UpdateListItemErrorCodes.Default](error);

        logger.error('Mapped error while updating list item', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while updating list item', err);

      return errorHandler[UpdateListItemErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [UpdateListItemErrorCodes.InvalidParameters]: (error: CustomError<UpdateListItemErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [UpdateListItemErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { updateListItem };
}

import { assert, object, string } from 'superstruct';

import type { LogClient } from '@clients/logger';
import { CustomError, isCustomError } from '@src/helpers/error';

import type { DeleteListItemUsecase } from './delete-list-item.usecase';
import { DeleteListItemErrorCodes } from './delete-list-item.errors';

export type DeleteListItemController = ReturnType<typeof DeleteListItemControllerFactory>;

export function DeleteListItemControllerFactory(usecase: DeleteListItemUsecase, logger: LogClient) {
  const DeleteListItemInput = object({
    userId: string(),
    listId: string(),
    itemId: string(),
  });

  const validate = (data: unknown) => {
    assert(data, DeleteListItemInput);

    return data;
  };

  const deleteListItem = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(DeleteListItemErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 204,
        body: {
          success: true,
          message: 'List item deleted successfully',
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (isCustomError(err)) {
        const error = err as CustomError<DeleteListItemErrorCodes>;

        const mappedError = errorHandler[error.code ?? DeleteListItemErrorCodes.Default](error);

        logger.error('Mapped error while deleting list item', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while deleting list item', err);

      return errorHandler[DeleteListItemErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [DeleteListItemErrorCodes.InvalidParameters]: (error: CustomError<DeleteListItemErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [DeleteListItemErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { deleteListItem };
}

import { assert, object, string } from 'superstruct';

import type { LogClient } from '@clients/logger';
import { CustomError, isCustomError } from '@src/helpers/error';

import type { CreateListItemUsecase } from './create-list-item.usecase';
import { CreateListItemErrorCodes } from './create-list-item.errors';

export type CreateListItemController = ReturnType<typeof CreateListItemControllerFactory>;

export function CreateListItemControllerFactory(usecase: CreateListItemUsecase, logger: LogClient) {
  const CreateListItemInput = object({
    name: string(),
    userId: string(),
    listId: string(),
  });

  const validate = (data: unknown) => {
    assert(data, CreateListItemInput);

    return data;
  };

  const createListItem = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(CreateListItemErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 201,
        body: {
          success: true,
          message: 'List item created successfully',
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (isCustomError(err)) {
        const error = err as CustomError<CreateListItemErrorCodes>;

        const mappedError = errorHandler[error.code ?? CreateListItemErrorCodes.Default](error);

        logger.error('Mapped error while creating list item', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while creating list item', err);

      return errorHandler[CreateListItemErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [CreateListItemErrorCodes.InvalidParameters]: (error: CustomError<CreateListItemErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [CreateListItemErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { createListItem };
}

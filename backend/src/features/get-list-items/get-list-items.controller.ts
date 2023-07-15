import { assert, object, string } from 'superstruct';

import type { LogClient } from '@clients/logger';
import { CustomError, isCustomError } from '@src/helpers/error';

import type { GetListItemsUsecase } from './get-list-items.usecase';
import { GetListItemsErrorCodes } from './get-list-items.errors';

export type GetListItemsController = ReturnType<typeof GetListItemsControllerFactory>;

export function GetListItemsControllerFactory(usecase: GetListItemsUsecase, logger: LogClient) {
  const GetListItemsInput = object({
    userId: string(),
    listId: string(),
  });

  const validate = (data: unknown) => {
    assert(data, GetListItemsInput);

    return data;
  };

  const getListItems = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(GetListItemsErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 200,
        body: {
          success: true,
          message: 'List items retrieved successfully',
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (isCustomError(err)) {
        const error = err as CustomError<GetListItemsErrorCodes>;

        const mappedError = errorHandler[error.code ?? GetListItemsErrorCodes.Default](error);

        logger.error('Mapped error while retrieving list items', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while retrieving list items', err);

      return errorHandler[GetListItemsErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [GetListItemsErrorCodes.InvalidParameters]: (error: CustomError<GetListItemsErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [GetListItemsErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { getListItems };
}

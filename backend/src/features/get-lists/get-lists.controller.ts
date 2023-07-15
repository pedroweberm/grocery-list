import { assert, object, string } from 'superstruct';

import type { LogClient } from '@clients/logger';
import { CustomError, isCustomError } from '@src/helpers/error';

import type { GetListsUsecase } from './get-lists.usecase';
import { GetListsErrorCodes } from './get-lists.errors';

export type GetListsController = ReturnType<typeof GetListsControllerFactory>;

export function GetListsControllerFactory(usecase: GetListsUsecase, logger: LogClient) {
  const GetListsInput = object({
    userId: string(),
  });

  const validate = (data: unknown) => {
    assert(data, GetListsInput);

    return data;
  };

  const getListItems = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(GetListsErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 200,
        body: {
          success: true,
          message: 'List retrieved successfully',
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (isCustomError(err)) {
        const error = err as CustomError<GetListsErrorCodes>;

        const mappedError = errorHandler[error.code ?? GetListsErrorCodes.Default](error);

        logger.error('Mapped error while retrieving lists', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while retrieving lists', err);

      return errorHandler[GetListsErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [GetListsErrorCodes.InvalidParameters]: (error: CustomError<GetListsErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [GetListsErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { getListItems };
}

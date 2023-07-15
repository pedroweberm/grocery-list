import { assert, object, string } from 'superstruct';

import type { LogClient } from '@clients/logger';
import { CustomError, isCustomError } from '@src/helpers/error';

import type { AddListMemberUsecase } from './add-list-member.usecase';
import { AddListMemberErrorCodes } from './add-list-member.errors';

export type AddListMemberController = ReturnType<typeof AddListMemberControllerFactory>;

export function AddListMemberControllerFactory(usecase: AddListMemberUsecase, logger: LogClient) {
  const AddListMemberInput = object({
    username: string(),
    listId: string(),
    userId: string(),
  });

  const validate = (data: unknown) => {
    assert(data, AddListMemberInput);

    return data;
  };

  const addListMember = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(AddListMemberErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 201,
        body: {
          success: true,
          message: 'Member added successfully',
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (isCustomError(err)) {
        const error = err as CustomError<AddListMemberErrorCodes>;

        const mappedError = errorHandler[error.code ?? AddListMemberErrorCodes.Default](error);

        logger.error('Mapped error while adding list member', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while adding list member', err);

      return errorHandler[AddListMemberErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [AddListMemberErrorCodes.InvalidParameters]: (error: CustomError<AddListMemberErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [AddListMemberErrorCodes.UserNotMemberOfList]: (error: CustomError<AddListMemberErrorCodes>) => ({
      status: 403,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [AddListMemberErrorCodes.UsernameNotFound]: (error: CustomError<AddListMemberErrorCodes>) => ({
      status: 404,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [AddListMemberErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { addListMember };
}

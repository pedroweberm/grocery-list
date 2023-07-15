import { v4 as uuid } from 'uuid';

export type LogClient = ReturnType<typeof LoggerFactory>;

type LogModes = 'DEBUG' | 'WARN' | 'INFO' | 'SILENT';

export function LoggerFactory(service: string, environment: string, mode: LogModes = 'DEBUG') {
  const logger: Console = console;
  let requestId: string;

  function setRequestId(id?: string) {
    if (id && id.length > 0) {
      requestId = id;

      return requestId;
    }

    requestId = uuid();

    return requestId;
  }

  function getRequestId() {
    if (requestId && requestId.length > 0) {
      return requestId;
    }

    return setRequestId();
  }

  function debug(message: string, data?: unknown) {
    if (mode === 'DEBUG') {
      logger.debug(
        JSON.stringify(
          {
            timestamp: new Date().getTime(),
            serviceName: service,
            level: 'DEBUG',
            requestId,
            environment: environment,
            message,
            data,
          },
          null,
          2,
        ),
      );
    }
  }

  function info(message: string, data?: unknown) {
    if (mode === 'DEBUG' || mode === 'WARN' || mode === 'INFO') {
      logger.info(
        JSON.stringify(
          {
            timestamp: new Date().getTime(),
            serviceName: service,
            level: 'INFO',
            requestId,
            environment: environment,
            message,
            data,
          },
          null,
          2,
        ),
      );
    }
  }

  function warn(message: string, data?: unknown) {
    if (mode === 'DEBUG' || mode === 'WARN') {
      logger.warn(
        JSON.stringify(
          {
            timestamp: new Date().getTime(),
            serviceName: service,
            level: 'WARN',
            requestId,
            environment: environment,
            message,
            data,
          },
          null,
          2,
        ),
      );
    }
  }

  function error(message: string, data?: unknown) {
    if (mode === 'DEBUG' || mode === 'WARN' || mode === 'INFO') {
      logger.error(
        JSON.stringify(
          {
            timestamp: new Date().getTime(),
            serviceName: service,
            level: 'ERROR',
            requestId,
            environment: environment,
            message,
            data,
          },
          null,
          2,
        ),
      );
    }
  }

  function start(id: string) {
    if (mode === 'DEBUG') {
      logger.time(`${id}`);
    }
  }

  function end(id: string) {
    if (mode === 'DEBUG') {
      logger.timeEnd(`${id}`);
    }
  }

  return {
    debug,
    info,
    warn,
    error,
    start,
    end,
    setRequestId,
    getRequestId,
  };
}

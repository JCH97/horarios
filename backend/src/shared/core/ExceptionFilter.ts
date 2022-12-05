import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  private logger: Logger;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.logger = new Logger(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {

    this.logger.error(exception);

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      error: (exception instanceof HttpException)
        ? exception.message
        : 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };


    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
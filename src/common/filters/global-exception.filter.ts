import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ERROR');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorLog = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      message: typeof message === 'object' ? (message as any).errorMessage || message : message,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    this.logger.error(JSON.stringify(errorLog));

    response.status(status).json({
      statusCode: status,
      message: typeof message === 'object' ? (message as any).errorMessage || message : message,
      timestamp: errorLog.timestamp,
    });
  }
}

import { Middleware, ExpressErrorMiddlewareInterface, HttpError, BadRequestError } from 'routing-controllers';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';
import logger from '../utils/logger';
import { GeneralError, TechnicalError, ValidateRequestError } from '../utils/errors';

@Middleware({ type: 'after' })
export default class LoggingErrorMiddleware implements ExpressErrorMiddlewareInterface {

  error(error: any, request: Request, response: Response, next?: (err?: any) => any): any {
    logger.error({
      action: 'End transaction',
      event: request.method + ' ' + request.url,
      responseTime: Date.now() - parseInt(response.get('starttime'), 10),
      status: error.statusCode,
      code: error.code + ': ' + error.name,
      message: error,
    });

    this.handleError(error, request, response);

    next();

  }

  /**
   * Custom handleError: https://github.com/typestack/routing-controllers/issues/87#issuecomment-282260085
   * @param error 
   * @param request 
   * @param response 
   */
  private handleError(error: any, request: Request, response: Response) {
    // if its an array of ValidationError
    if (Array.isArray(error.errors) && error.errors.every((e: any) => e instanceof ValidationError)) {
      // Get error message list
      const messages: string[] = [];
      for (const err of error.errors) {
        const constraints = Object.keys(err.constraints);
        for (const constraint of constraints) {
          messages.push(err.constraints[constraint]);
        }
      }
      response.status(400).send(new ValidateRequestError(messages.join('\n')));
    } else {
      // set http status
      if (error instanceof HttpError && error.httpCode) {
        response.status(error.httpCode);
        response.send(error);
      }else if(!(error instanceof GeneralError)) {
        const technicalError = new TechnicalError(error);
        response.status(technicalError.statusCode);
        response.send(technicalError);
      } else {
        response.status(error.statusCode);
        response.send(error);
      }
    }
  }

}

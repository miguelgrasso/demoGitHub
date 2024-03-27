import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';
import logger from '../utils/logger';

@Middleware({ type: 'after' })
export default class LoggingAfterMiddleware implements ExpressMiddlewareInterface {

  use(request: Request, response: Response, next?: (err?: any) => any): any {

    logger.info({
      action: 'End transaction',
      event: request.method + ' ' + request.url,
      responseTime: Date.now() - parseInt(response.get('starttime'), 10),
      status: response.statusMessage,
      code: response.statusCode,
      message: response.statusMessage || 'Success Response',   // response.body
    });

    next();

  }

}
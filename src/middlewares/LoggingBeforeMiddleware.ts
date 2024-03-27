import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';
import logger from '../utils/logger';

@Middleware({ type: 'before', priority: 1 })
export default class LoggingBeforeMiddleware implements ExpressMiddlewareInterface {
  
  use(request: Request, response: Response, next?: (err?: any) => any): any {
    logger.info({
      action: 'Start transaction',
      event: request.method + ' ' + request.url,
      responseTime: 0,
      status: 'OK',
      code: 0,
      message: {query: request.query, params: request.params, body: request.body},
    });

    // Remember variables
    response.set('starttime', Date.now() + '');

    next();
    
  }

}
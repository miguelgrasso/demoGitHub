import {Middleware, ExpressMiddlewareInterface} from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

// fix body request in middleware: github.com/typestack/routing-controllers/issues/401
@Middleware({ type: 'before', priority: 5 })
export default class BodyParser implements ExpressMiddlewareInterface {

  private jsonBodyParser;

  constructor() {
      this.jsonBodyParser = bodyParser.json();
  }

  use(req: Request, res: Response, next: NextFunction) {
      this.jsonBodyParser(req, res, next);
  }

}

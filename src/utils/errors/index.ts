/* tslint:disable:max-classes-per-file */
import HttpStatus from 'http-status-codes';

/**
 * Top Category Errors
 */

export class GeneralError extends Error {
  status: string;
  statusCode: number;
  code: string;
  type: string;
  datetime?: string;
  data?: any;
  constructor(error: string | Error) {

    if(typeof error === 'string') {
      super(error);
      this.code = 'EG000';
      this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      this.type = this.constructor.name;
      this.name = this.constructor.name + '[' + Object.getPrototypeOf(this.constructor).name + ']'; // https://stackoverflow.com/a/31653687/2823916
      this.datetime = new Date(Date.now()).toString();
    } else if (error instanceof GeneralError) {
      super(error.message);
      this.code = error.code;
      this.statusCode = error.statusCode;
      this.type = error.type;
      this.name = this.constructor.name + '\\' + error.name;
      this.datetime = error.datetime;
      this.stack = error.stack;
    } else {
      super(error.message);
      this.code = 'ET000';
      this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      this.type = this.constructor.name;
      this.name = this.constructor.name + '\\' + error.name;
      this.datetime = new Date(Date.now()).toString();
      this.stack = error.stack;
    }

    this.status = 'Fail';
    this.data = null;

  }

  toJSON() {
    return {
      'status': this.status,
      'code': this.code,
      'type': this.type,
      'name': this.name,
      'message': this.message || 'Something went wrong!',
      'date': this.datetime,
      'data': this.data,
      'stack': (process.argv[1].endsWith('.ts') && this.stack != null) ? this.stack.split('\n') : undefined,
    };
  }

}

export class FunctionalError extends GeneralError {  // Business
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'EF000';
      this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    }
  }
}

export class TechnicalError extends GeneralError { // System
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'ET000';
      this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}

/**
 * Functional Category Errors
 */

export class IncompleteRequestError extends FunctionalError {
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'EF001';
      this.statusCode = HttpStatus.BAD_REQUEST;
    }
  }
}

export class ValidateRequestError extends FunctionalError {
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'EF002';
      this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    }
  }
}

export class DataNotFoundException extends FunctionalError {
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'EF003';
      this.statusCode = HttpStatus.NOT_FOUND;
    }
  }
}

export class AuthenticationException extends FunctionalError {
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'EF004';
      this.statusCode = HttpStatus.NOT_FOUND;
    }
  }
}

/**
 * Technical Category Errors
 */

export class DatabaseConnectionError extends TechnicalError {
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'ET001';
    }
  }
}

export class ResourceUnavailableError extends TechnicalError {
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'ET002';
    }
  }
}

export class RepositoryError extends TechnicalError {
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'ET003';
    }
  }
}

export class ServiceError extends TechnicalError {
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'ET004';
    }

  }
}

export class ControllerError extends TechnicalError {
  constructor(error: string | Error) {
    super(error);
    if(typeof error === 'string') {
      this.code = 'ET005';
    }
  }
}

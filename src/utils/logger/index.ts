import pino from 'pino';
import os from 'os';

const version = require('../../../package.json').version;
const serviceName = require('../../../package.json').name;

// const loggerOptions: pino.LoggerOptions = {
//   base: null,
//   prettyPrint: false,
// };

const loggerOptions: pino.LoggerOptions = {
  level: process.env.LOGGER_LEVEL || 'info',
  timestamp: () => {
		return ',"time":"' + new Date().toLocaleString('en-GB', {
      timeZone: 'America/Lima',
      hour12: false,
    })+'"';
	},
  base: {
    serviceName,
    version,
    urlService: os.hostname+'',
    // Variables
    action: 'logging',  // startup, start/end Transaction, request to/response from name-service
    event: '',          // request.method + ' ' + request.url,
    // idTransaccion: '',  // b36ef3340827654a
    responseTime: 0,    // 500
    status: 0,          // 200, 404, 500
    code: '',           // EG000, EF000, ET000
  },
  messageKey: 'message',
  enabled: true,
  // nestedKey: 'payload',
};

export default pino(loggerOptions);

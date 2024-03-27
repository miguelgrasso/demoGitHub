import { Service, Inject } from 'typedi';
import * as request from 'superagent';
import logger from '../../utils/logger';
import { ServiceError } from '../../utils/errors';
import url from 'url';

@Service()
export default class Http {

    async make(action: (request: any) => any) {
        const startime = Date.now();
        let requestPromise: any;
        try {
    
            requestPromise = action(request);

            logger.info({
                // idTransaccion: this.zipkinTracer.tracer.id.traceId,
                action: `Request to ${url.parse(requestPromise.url).pathname}`,
                event: requestPromise.method + ' ' + requestPromise.url,
                responseTime: 0,
                status: 'OK',
                code: 0,
                message: { source: `${requestPromise.method} ${requestPromise.url}`, body: requestPromise._data },
            });
            
            const response: any = await requestPromise
                .timeout({
                    response: process.env.HTTP_TIMEOUT_RESPONSE || 15000,  // Wait 5 seconds for the server to start sending,
                    deadline: process.env.HTTP_TIMEOUT_DEADLINE || 30000, // but allow 30 seconds for the file to finish loading.
                })
                .type('json');

            logger.info({
                // idTransaccion: this.zipkinTracer.tracer.id.traceId,
                action: `Response from ${url.parse(requestPromise.url).pathname}`,
                event: requestPromise.method + ' ' + requestPromise.url,
                responseTime: Date.now() - startime,
                status: response.res.statusMessage,
                code: response.statusCode,
                message: { source: `${requestPromise.method} ${requestPromise.url}`, response: response.body },
            });

            return response.body;

        } catch (e) {
    
            const errorMessage = `Response error from '${url.parse(requestPromise.url).pathname}': ${(e.response && e.response.body && e.response.body.message)?e.response.body.message:e}`;

            logger.error({
                // idTransaccion: this.zipkinTracer.tracer.id.traceId,
                action: `Response from ${url.parse(requestPromise.url).pathname}`,
                event: requestPromise.method + ' ' + requestPromise.url,
                responseTime: Date.now() - startime,
                status: e.status,
                code: e.code || 'ET002',
                message: { source: `${requestPromise.method} ${requestPromise.url}`, response: errorMessage },
            });
    
            throw new ServiceError(errorMessage);
        }
    }

}
import logger from './utils/logger';

import 'reflect-metadata';
import { createExpressServer, useExpressServer, Action } from 'routing-controllers';

// use TypeDI with routing-controllers and TypeORM
import { Container } from 'typedi';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { useContainer as ormUseContainer } from 'typeorm';

// use TypeDI with routing-controllers and TypeORM
routingUseContainer(Container);
ormUseContainer(Container);

// load config file
import Config from './utils/config';
const config = Container.get(Config);

import jwt from 'jsonwebtoken';

const HEADER_AUTHORIZATION = 'authorization';
//
const routingControllersOptions = {
    routePrefix: '/admin',
    controllers: [__dirname + '/controllers/**/*'], // specify controllers to use
    middlewares: [__dirname + '/middlewares/**/*'],
    interceptors: [__dirname + '/interceptors/**/*'],
    defaultErrorHandler: false,
    validation: true,   // disable auto-validation: //github.com/typestack/routing-controllers#auto-validating-action-params
    authorizationChecker: async (action: Action) => {
        try {
            const token = action.request.headers[HEADER_AUTHORIZATION];
            const payload = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            return true;
        } catch (e) {
            return false;
        }
    },
    currentUserChecker: async (action: Action) => {
        try {
            const token = action.request.headers[HEADER_AUTHORIZATION];
            const payload = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            return payload;
        } catch (e) {
            return null;
        }
    },
};

/*import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
*/

import express from 'express';
const app = express();

import cors from 'cors';
app.use(cors());    // Enabling cors

import helmet from 'helmet';
app.use(helmet());  // securing express apps

import bodyParser from 'body-parser';   // Fix Error: request entity too large (upload large documents)
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));    // https://stackoverflow.com/a/36514330/2823916

// creates/uses express app, registers all controller routes
// const app = createExpressServer(routingControllersOptions);  // headers bugs with cors, helmet and others middlewares
useExpressServer(app, routingControllersOptions);

import { getMetadataArgsStorage } from 'routing-controllers';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { routingControllersToSpec } from 'routing-controllers-openapi';

// parse class-validator classes into JSON schema
const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
    classTransformerMetadataStorage: defaultMetadataStorage, // github.com/epiphone/routing-controllers-openapi/issues/13
});

// generate openapi schema: github.com/epiphone/routing-controllers-openapi
const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, routingControllersOptions, {
    components: {
        schemas
    },
    info: {
        title: 'API Restful',
        description: 'Generated with `routing-controllers-openapi`',
        version: '1.0.0'
    }
});

import swaggerUi from 'swagger-ui-express';

// create api documentation with swagger: github.com/scottie1984/swagger-ui-express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

import { createConnection } from 'typeorm';

// create typeorm pool connection: //github.com/typeorm/typeorm/issues/592#issuecomment-311623313
createConnection(config.db).then(connection  => {

    app.listen(config.app.port, () => {
        logger.info({
            action: 'startup',
            message: `Listening on the ports: ${config.app.port}`
        });
    });

});

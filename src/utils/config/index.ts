import { Service } from 'typedi';
import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

@Service()
export default class Config {

    // https://stackoverflow.com/a/16179661/2823916
    app: { 
        port: number; 
    };

    db: ConnectionOptions;

    logging: {
        level: string,
    };

    constructor() {

        dotenv.config();

        this.app = {
            port: parseInt(process.env.PORT, 10) || 3000
        };

        this.db = {
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_SCHEMA || 'dummy',
            timezone: '-05:00',
            entities: [
                __dirname + './../../entities/*'
            ],
            synchronize: false, // Allow synchronize tables schemas on entity change
            logging: false,
            debug: false,
        };

        this.logging = {
            level: process.env.LOGGER_LEVEL || 'info',
        };

    }

}
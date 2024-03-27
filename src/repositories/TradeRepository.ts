import { Repository, EntityRepository } from 'typeorm';
import Trade from '../entities/Trade';

@EntityRepository(Trade)
export default class TradeRepository extends Repository<Trade> {

}
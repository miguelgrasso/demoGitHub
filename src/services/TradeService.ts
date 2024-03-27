import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import TradeRepository from '../repositories/TradeRepository';
import Trade from '../entities/Trade';
import { ServiceError } from '../utils/errors';

@Service()
export default class TradeService {

    @InjectRepository()
    private tradeRepository: TradeRepository;

    async findAll(): Promise<Trade[]> {
        try{
            return await this.tradeRepository.find({ estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async findById(id: number): Promise<Trade> {
        try{
            return await this.tradeRepository.findOneOrFail({ id, estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async save(trade: Trade): Promise<Trade> {
        try{
            return await this.tradeRepository.save(trade);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async update(id: number, trade: Trade): Promise<Trade> {
        try{
            await this.tradeRepository.findOneOrFail({ id, estado: 'A' });
            await this.tradeRepository.update(id, trade);
            return await this.tradeRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async delete(id: number): Promise<Trade> {
        try{
            const trade = await this.tradeRepository.findOneOrFail({ id, estado: 'A' });
            // await this.userRepository.delete(id);
            await this.tradeRepository.update(id, { estado: 'I' });
            return await this.tradeRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

}

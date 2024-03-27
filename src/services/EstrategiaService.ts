import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import EstrategiaRepository from '../repositories/EstrategiaRepository';
import Estrategia from '../entities/Estrategia';
import { ServiceError } from '../utils/errors';

@Service()
export default class EstrategiaService {

    @InjectRepository()
    private estrategiaRepository: EstrategiaRepository;

    async findAll(): Promise<Estrategia[]> {
        try{
            return await this.estrategiaRepository.find({ estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async findById(id: number): Promise<Estrategia> {
        try{
            return await this.estrategiaRepository.findOneOrFail({ id, estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async save(estrategia: Estrategia): Promise<Estrategia> {
        try{
            return await this.estrategiaRepository.save(estrategia);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async update(id: number, estrategia: Estrategia): Promise<Estrategia> {
        try{
            await this.estrategiaRepository.findOneOrFail({ id, estado: 'A' });
            await this.estrategiaRepository.update(id, estrategia);
            return await this.estrategiaRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async delete(id: number): Promise<Estrategia> {
        try{
            const estrategia = await this.estrategiaRepository.findOneOrFail({ id, estado: 'A' });
            // await this.userRepository.delete(id);
            await this.estrategiaRepository.update(id, { estado: 'I' });
            return await this.estrategiaRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

}

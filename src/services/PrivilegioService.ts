import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import PrivilegioRepository from '../repositories/PrivilegioRepository';
import Privilegio from '../entities/Privilegio';
import { ServiceError } from '../utils/errors';

@Service()
export default class PrivilegioService {

    @InjectRepository()
    private privilegioRepository: PrivilegioRepository;

    async findAll(): Promise<Privilegio[]> {
        try{
            return await this.privilegioRepository.find({ estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async findById(id: number): Promise<Privilegio> {
        try{
            return await this.privilegioRepository.findOneOrFail({ id, estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async save(privilegio: Privilegio): Promise<Privilegio> {
        try{
            return await this.privilegioRepository.save(privilegio);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async update(id: number, privilegio: Privilegio): Promise<Privilegio> {
        try{
            await this.privilegioRepository.findOneOrFail({ id, estado: 'A' });
            await this.privilegioRepository.update(id, privilegio);
            return await this.privilegioRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async delete(id: number): Promise<Privilegio> {
        try{
            const privilegio = await this.privilegioRepository.findOneOrFail({ id, estado: 'A' });
            // await this.userRepository.delete(id);
            await this.privilegioRepository.update(id, { estado: 'I' });
            return await this.privilegioRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

}

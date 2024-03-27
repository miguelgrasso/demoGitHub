import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import RolRepository from '../repositories/RolRepository';
import Rol from '../entities/Rol';
import { ServiceError } from '../utils/errors';

@Service()
export default class RolService {

    @InjectRepository()
    private rolRepository: RolRepository;

    async findAll(): Promise<Rol[]> {
        try{
            return await this.rolRepository.find({ estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async findById(id: number): Promise<Rol> {
        try{
            return await this.rolRepository.findOneOrFail({ id, estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async save(rol: Rol): Promise<Rol> {
        try{
            return await this.rolRepository.save(rol);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async update(id: number, rol: Rol): Promise<Rol> {
        try{
            await this.rolRepository.findOneOrFail({ id, estado: 'A' });
            await this.rolRepository.update(id, rol);
            return await this.rolRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async delete(id: number): Promise<Rol> {
        try{
            const rol = await this.rolRepository.findOneOrFail({ id, estado: 'A' });
            // await this.userRepository.delete(id);
            await this.rolRepository.update(id, { estado: 'I' });
            return await this.rolRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

}

import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import UsuarioRepository from '../repositories/UsuarioRepository';
import Usuario from '../entities/Usuario';
import { ServiceError } from '../utils/errors';

@Service()
export default class UsuarioService {

    @InjectRepository()
    private usuarioRepository: UsuarioRepository;

    async findAll(): Promise<Usuario[]> {
        try{
            return await this.usuarioRepository.find({ estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async findById(id: number): Promise<Usuario> {
        try{
            return await this.usuarioRepository.findOneOrFail({ id, estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async findByUsername(username: string): Promise<Usuario> {
        try{
            return await this.usuarioRepository.findOneOrFail({ username, estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async save(usuario: Usuario): Promise<Usuario> {
        try{
            return await this.usuarioRepository.save(usuario);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async update(id: number, usuario: Usuario): Promise<Usuario> {
        try{
            await this.usuarioRepository.findOneOrFail({ id, estado: 'A' });
            await this.usuarioRepository.update(id, usuario);
            return await this.usuarioRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async delete(id: number): Promise<Usuario> {
        try{
            const usuario = await this.usuarioRepository.findOneOrFail({ id, estado: 'A' });
            // await this.userRepository.delete(id);
            await this.usuarioRepository.update(id, { estado: 'I' });
            return await this.usuarioRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

}

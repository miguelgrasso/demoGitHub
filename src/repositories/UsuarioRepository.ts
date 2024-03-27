import { Repository, EntityRepository } from 'typeorm';
import Usuario from '../entities/Usuario';

@EntityRepository(Usuario)
export default class UsuarioRepository extends Repository<Usuario> {
    
}
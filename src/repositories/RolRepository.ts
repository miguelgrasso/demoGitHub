import { Repository, EntityRepository } from 'typeorm';
import Rol from '../entities/Rol';

@EntityRepository(Rol)
export default class RolRepository extends Repository<Rol> {

}
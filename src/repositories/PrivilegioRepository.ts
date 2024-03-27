import { Repository, EntityRepository } from 'typeorm';
import Privilegio from '../entities/Privilegio';

@EntityRepository(Privilegio)
export default class PrivilegioRepository extends Repository<Privilegio> {

}
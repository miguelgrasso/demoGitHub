import { Repository, EntityRepository } from 'typeorm';
import Estrategia from '../entities/Estrategia';

@EntityRepository(Estrategia)
export default class EstrategiaRepository extends Repository<Estrategia> {

}
import { Repository, EntityRepository } from 'typeorm';
import Plan from '../entities/Plan';

@EntityRepository(Plan)
export default class PlanRepository extends Repository<Plan> {

}
import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import PlanRepository from '../repositories/PlanRepository';
import Plan from '../entities/Plan';
import { ServiceError } from '../utils/errors';

@Service()
export default class PlanService {

    @InjectRepository()
    private planRepository: PlanRepository;

    async findAll(): Promise<Plan[]> {
        try{
            return await this.planRepository.find({ estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async findById(id: number): Promise<Plan> {
        try{
            return await this.planRepository.findOneOrFail({ id, estado: 'A' });
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async save(plan: Plan): Promise<Plan> {
        try{
            return await this.planRepository.save(plan);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async update(id: number, plan: Plan): Promise<Plan> {
        try{
            await this.planRepository.findOneOrFail({ id, estado: 'A' });
            await this.planRepository.update(id, plan);
            return await this.planRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async delete(id: number): Promise<Plan> {
        try{
            const plan = await this.planRepository.findOneOrFail({ id, estado: 'A' });
            // await this.userRepository.delete(id);
            await this.planRepository.update(id, { estado: 'I' });
            return await this.planRepository.findOneOrFail(id);
        } catch (e) {
            throw new ServiceError(e);
        }
    }

}

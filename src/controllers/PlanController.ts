import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject } from 'typedi';
import PlanService from '../services/PlanService';
import Plan from '../entities/Plan';
import { ControllerError } from '../utils/errors';

@JsonController('/plan')
export class PlanController {

   @Inject()
   private planService: PlanService;

   @Get('/')
   async findAll() {
      try {
         return await this.planService.findAll();
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Get('/:id([0-9]+)')
   async findById(@Param('id') id: number) {
      try {
         return await this.planService.findById(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Post('/')
   async create(@Body() plan: Plan) {
      try {
         return await this.planService.save(plan);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Put('/:id')
   async update(@Param('id') id: number, @Body() plan: Plan) {
      try {
         return await this.planService.update(id, plan);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Delete('/:id')
   async delete(@Param('id') id: number) {
      try {
         return await this.planService.delete(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

}
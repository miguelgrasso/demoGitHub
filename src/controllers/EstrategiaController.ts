import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject } from 'typedi';
import EstrategiaService from '../services/EstrategiaService';
import Estrategia from '../entities/Estrategia';
import { ControllerError } from '../utils/errors';

@JsonController('/estrategia')
export class EstrategiaController {

   @Inject()
   private estrategiaService: EstrategiaService;

   @Get('/')
   async findAll() {
      try {
         return await this.estrategiaService.findAll();
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Get('/:id([0-9]+)')
   async findById(@Param('id') id: number) {
      try {
         return await this.estrategiaService.findById(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Post('/')
   async create(@Body() estrategia: Estrategia) {
      try {
         return await this.estrategiaService.save(estrategia);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Put('/:id')
   async update(@Param('id') id: number, @Body() estrategia: Estrategia) {
      try {
         return await this.estrategiaService.update(id, estrategia);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Delete('/:id')
   async delete(@Param('id') id: number) {
      try {
         return await this.estrategiaService.delete(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

}
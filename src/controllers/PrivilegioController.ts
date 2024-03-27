import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject } from 'typedi';
import PrivilegioService from '../services/PrivilegioService';
import Privilegio from '../entities/Privilegio';
import { ControllerError } from '../utils/errors';

@JsonController('/privilegio')
export class PrivilegioController {

   @Inject()
   private privilegioService: PrivilegioService;

   @Get('/')
   async findAll() {
      try {
         return await this.privilegioService.findAll();
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Get('/:id([0-9]+)')
   async findById(@Param('id') id: number) {
      try {
         return await this.privilegioService.findById(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Post('/')
   async create(@Body() privilegio: Privilegio) {
      try {
         return await this.privilegioService.save(privilegio);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Put('/:id')
   async update(@Param('id') id: number, @Body() privilegio: Privilegio) {
      try {
         return await this.privilegioService.update(id, privilegio);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Delete('/:id')
   async delete(@Param('id') id: number) {
      try {
         return await this.privilegioService.delete(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

}
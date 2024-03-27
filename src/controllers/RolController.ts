import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject } from 'typedi';
import RolService from '../services/RolService';
import Rol from '../entities/Rol';
import { ControllerError } from '../utils/errors';

@JsonController('/rol')
export class RolController {

   @Inject()
   private rolService: RolService;

   @Get('/')
   async findAll() {
      try {
         return await this.rolService.findAll();
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Get('/:id([0-9]+)')
   async findById(@Param('id') id: number) {
      try {
         return await this.rolService.findById(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Post('/')
   async create(@Body() rol: Rol) {
      try {
         return await this.rolService.save(rol);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Put('/:id')
   async update(@Param('id') id: number, @Body() rol: Rol) {
      try {
         return await this.rolService.update(id, rol);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Delete('/:id')
   async delete(@Param('id') id: number) {
      try {
         return await this.rolService.delete(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

}
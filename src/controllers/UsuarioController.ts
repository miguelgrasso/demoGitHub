import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject } from 'typedi';
import UsuarioService from '../services/UsuarioService';
import Usuario from '../entities/Usuario';
import { ControllerError } from '../utils/errors';

@JsonController('/usuario')
export class UsuarioController {

   @Inject()
   private usuarioService: UsuarioService;

   @Get('/')
   async findAll() {
      try {
         return await this.usuarioService.findAll();
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Get('/:id([0-9]+)')
   async findById(@Param('id') id: number) {
      try {
         return await this.usuarioService.findById(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Get('/:username')
   async findByUsername(@Param('username') username: string) {
      try {
         return await this.usuarioService.findByUsername(username);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Post('/')
   async create(@Body() usuario: Usuario) {
      try {
         return await this.usuarioService.save(usuario);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Put('/:id')
   async update(@Param('id') id: number, @Body() usuario: Usuario) {
      try {
         return await this.usuarioService.update(id, usuario);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Delete('/:id')
   async delete(@Param('id') id: number) {
      try {
         return await this.usuarioService.delete(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

}
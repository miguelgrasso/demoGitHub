import { Controller, JsonController, Authorized, CurrentUser, Param, Body, Get, Post, Put, Delete, QueryParam } from 'routing-controllers';
import { Inject } from 'typedi';
import AuthService from '../services/AuthService';
import UsuarioService from '../services/UsuarioService';
import Usuario from '../entities/Usuario';
import { ControllerError } from '../utils/errors';

@JsonController('/auth')
export class AuthController {

   @Inject()
   private authService: AuthService;

   @Inject()
   private usuarioService: UsuarioService;

   @Post('/login')
   async login(@Body() usuario: Usuario) {
      try {
         return await this.authService.login(usuario.username, usuario.password);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   //@Authorized()
   @Get('/me')
   async me(@CurrentUser({ required: true }) usuario: Usuario) {
      try {
         return await this.usuarioService.findById(usuario.id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   //@Authorized()
   @Get('/menus/:nameRol')
   async menus(@Param('nameRol') nameRol: string) {
      try {
         return await this.authService.menus(nameRol);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

}
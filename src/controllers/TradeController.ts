import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject } from 'typedi';
import TradeService from '../services/TradeService';
import Trade from '../entities/Trade';
import { ControllerError } from '../utils/errors';

@JsonController('/trade')
export class TradeController {

   @Inject()
   private tradeService: TradeService;

   @Get('/')
   async findAll() {
      try {
         return await this.tradeService.findAll();
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Get('/:id([0-9]+)')
   async findById(@Param('id') id: number) {
      try {
         return await this.tradeService.findById(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Post('/')
   async create(@Body() trade: Trade) {
      try {
         return await this.tradeService.save(trade);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Put('/:id')
   async update(@Param('id') id: number, @Body() trade: Trade) {
      try {
         return await this.tradeService.update(id, trade);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

   @Delete('/:id')
   async delete(@Param('id') id: number) {
      try {
         return await this.tradeService.delete(id);
      } catch(e) {
         throw new ControllerError(e);
      }
   }

}
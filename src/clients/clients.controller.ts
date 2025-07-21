import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.clientsService.findAll();
  }

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.clientsService.findOne(id);
}

@Put(':id')
update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClientDto) {
  return this.clientsService.update(id, dto);
}

@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number) {
  return this.clientsService.remove(id);
}
}

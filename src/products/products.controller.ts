import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { UserRole } from 'src/utility/common/user-roles.enum';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() currentUser:UserEntity):Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, currentUser);
  }

  @Get('all')
  async findAll():Promise<ProductEntity[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser()currentUser:UserEntity): Promise<ProductEntity>{
    return await this.productsService.update(+id, updateProductDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}

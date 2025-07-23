import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { UserRole } from 'src/utility/common/user-roles.enum';
import { CategoryEntity } from './entities/category.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Post()
  @ApiOperation({ summary: 'Cria uma nova categoria (somente admin)' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    schema: {
      example: {
        statusCode: 201,
        message: 'Categoria criada com sucesso',
        data: {
          id: 1,
          title: 'Eletrônicos',
          description: 'Categoria para produtos eletrônicos diversos',
          createdAt: '2025-07-23T16:00:00Z',
          updatedAt: '2025-07-23T16:00:00Z',
          addedBy: {
            id: 1,
            name: 'Ricardo Vitor',
          },
        },
        timestamp: '2025-07-23T16:00:00Z',
        path: '/categories',
      },
    },
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: UserEntity,
    @Req() request: Request,
  ) {
    const category = await this.categoriesService.create(createCategoryDto, currentUser);

    return {
      statusCode: 201,
      message: 'Categoria criada com sucesso',
      data: category,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('all')
  @ApiOperation({ summary: 'Retorna todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lista de categorias retornada com sucesso',
        data: [
          {
            id: 1,
            title: 'Eletrônicos',
            description: 'Categoria para produtos eletrônicos diversos',
            createdAt: '2025-07-23T16:00:00Z',
            updatedAt: '2025-07-23T16:00:00Z',
            addedBy: {
              id: 1,
              name: 'Ricardo Vitor',
            },
          },
        ],
        timestamp: '2025-07-23T16:00:00Z',
        path: '/categories/all',
      },
    },
  })
  async findAll(@Req() request: Request) {
    const categories = await this.categoriesService.findAll();
    return {
      statusCode: 200,
      message: 'Lista de categorias retornada com sucesso',
      data: categories,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('single/:id')
  @ApiOperation({ summary: 'Retorna uma categoria pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Categoria encontrada com sucesso',
        data: {
          id: 1,
          title: 'Eletrônicos',
          description: 'Categoria para produtos eletrônicos diversos',
          createdAt: '2025-07-23T16:00:00Z',
          updatedAt: '2025-07-23T16:00:00Z',
          addedBy: {
            id: 1,
            name: 'Ricardo Vitor',
          },
        },
        timestamp: '2025-07-23T16:00:00Z',
        path: '/categories/single/1',
      },
    },
  })
  async findOne(@Param('id') id: string, @Req() request: Request) {
    const category = await this.categoriesService.findOne(+id);
    return {
      statusCode: 200,
      message: 'Categoria encontrada com sucesso',
      data: category,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma categoria pelo ID (somente admin)' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Categoria atualizada com sucesso',
        data: {
          id: 1,
          title: 'Eletrônicos Atualizado',
          description: 'Descrição atualizada da categoria',
          createdAt: '2025-07-23T16:00:00Z',
          updatedAt: '2025-07-23T17:00:00Z',
          addedBy: {
            id: 1,
            name: 'Ricardo Vitor',
          },
        },
        timestamp: '2025-07-23T17:00:00Z',
        path: '/categories/1',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() request: Request,
  ) {
    const updatedCategory = await this.categoriesService.update(+id, updateCategoryDto);
    return {
      statusCode: 200,
      message: 'Categoria atualizada com sucesso',
      data: updatedCategory,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma categoria pelo ID (somente admin)' })
  @ApiResponse({
    status: 204,
    description: 'Categoria removida com sucesso (sem conteúdo no body)',
  })
  async remove(@Param('id') id: string, @Req() request: Request) {
    await this.categoriesService.remove(+id);
    return {
      statusCode: 204,
      message: 'Categoria removida com sucesso',
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }
}

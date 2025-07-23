import { Controller, Post, Body, Get, Query, Param, Patch, Delete, UseGuards, UnauthorizedException, HttpCode, HttpStatus, BadRequestException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { AuthenticationGuard } from '../../src/utility/guards/authentication.guard';
import { AuthorizeGuard } from '../../src/utility/guards/authorization.guard';
import { UserRole } from '../utility/common/user-roles.enum';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso!',
    schema: {
      example: {
        statusCode: 201,
        message: 'Usuário criado com sucesso! Verifique seu e-mail para confirmar sua conta.',
        data: {
          id: 1,
          name: 'João Silva',
          email: 'joao@email.com',
        },
      },
    },
  })
  async signup(@Body() userSignUpDto: UserSignUpDto): Promise<{ message: string; user: Partial<UserEntity> }> {
    const user = await this.usersService.signup(userSignUpDto);
    return {
      message: 'Usuário criado com sucesso! Verifique seu e-mail para confirmar sua conta.',
      user,
    };
  }


  @Post('signin')
  @ApiOperation({ summary: 'Login com autenticação do usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário autenticado com sucesso.',
    schema: {
      example: {
        message: 'Login realizado com sucesso!',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR...',
        user: {
          id: 1,
          name: 'João da Silva',
          email: 'joao@email.com',
          role: ['user'],
          createdAt: '2024-07-20T10:45:00Z',
          updatedAt: '2024-07-20T10:45:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async signin(
    @Body() userSignInDto: UserSignInDto,
  ): Promise<{ message: string; accessToken: string; user: Partial<UserEntity> }> {
    const user = await this.usersService.signin(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);

    return {
      message: 'Login realizado com sucesso!',
      accessToken,
      user,
    };
  }

  @Get('confirm-email')
  @ApiOperation({ summary: 'Confirma o e-mail do usuário via token' })
  @ApiResponse({
    status: 200,
    description: 'E-mail confirmado com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'E-mail confirmado com sucesso',
        data: null,
        timestamp: '2025-07-23T16:00:00Z',
        path: '/auth/confirm-email',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido ou ausente',
    schema: {
      example: {
        statusCode: 400,
        message: 'Token é obrigatório',
        error: 'Bad Request',
        timestamp: '2025-07-23T16:00:00Z',
        path: '/auth/confirm-email',
      },
    },
  })
  async confirmEmail(@Query('token') token: string, @Req() request: Request) {
    if (!token) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Token é obrigatório',
        error: 'Bad Request',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    const message = await this.usersService.confirmEmail(token);

    return {
      statusCode: 200,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Get('all')
  @ApiOperation({ summary: 'Retorna todos os usuários (somente admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lista de usuários retornada com sucesso',
        data: [
          {
            id: 1,
            name: 'Ricardo Vitor',
            email: 'ricardo@example.com',
            role: ['ADMIN'],
            // outros campos
          },
        ],
        timestamp: '2025-07-23T16:00:00Z',
        path: '/users/all',
      },
    },
  })
  async findAll(@Req() request: Request) {
    const users = await this.usersService.findAll();
    return {
      statusCode: 200,
      message: 'Lista de usuários retornada com sucesso',
      data: users,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('single/:id')
  @ApiOperation({ summary: 'Retorna um usuário pelo ID (autorização incluída)' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Usuário encontrado com sucesso',
        data: {
          id: 1,
          name: 'Ricardo Vitor',
          email: 'ricardo@example.com',
          role: ['ADMIN'],
          // outros campos
        },
        timestamp: '2025-07-23T16:00:00Z',
        path: '/users/single/1',
      },
    },
  })

  @ApiResponse({ status: 401, description: 'Acesso negado' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
    @Req() request: Request,
  ) {
    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    if (isAdmin || currentUser.id === +id) {
      const user = await this.usersService.findOne(+id);
      return {
        statusCode: 200,
        message: 'Usuário encontrado com sucesso',
        data: user,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }
    throw new UnauthorizedException('Acesso negado.');
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um usuário pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Usuário atualizado com sucesso',
        data: {
          id: 1,
          name: 'Ricardo Vitor',
          email: 'ricardo@example.com',
          role: ['ADMIN'],
          // outros campos atualizados
        },
        timestamp: '2025-07-23T16:00:00Z',
        path: '/users/1',
      },
    },
  })

  @ApiResponse({ status: 401, description: 'Acesso negado' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserEntity,
    @Req() request: Request,
  ) {
    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    if (isAdmin || currentUser.id === +id) {
      const updatedUser = await this.usersService.update(+id, updateUserDto);
      return {
        statusCode: 200,
        message: 'Usuário atualizado com sucesso',
        data: updatedUser,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }
    throw new UnauthorizedException('Você só pode editar sua própria conta.');
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Usuário removido com sucesso',
        data: null,
        timestamp: '2025-07-23T16:00:00Z',
        path: '/users/1',
      },
    },
  })

  @ApiResponse({ status: 401, description: 'Acesso negado' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
    @Req() request: Request,
  ) {
    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    if (isAdmin || currentUser.id === +id) {
      await this.usersService.remove(+id);
      return {
        statusCode: 200,
        message: 'Usuário removido com sucesso',
        data: null,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }
    throw new UnauthorizedException('Você só pode excluir sua própria conta.');
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('me')
  @ApiOperation({ summary: 'Retorna os dados do usuário atual autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Usuário autenticado retornado com sucesso',
    schema: {
      example: {
        statusCode: 200,
        message: 'Usuário autenticado retornado com sucesso',
        data: {
          id: 1,
          name: 'Ricardo Vitor',
          email: 'ricardo@example.com',
          role: ['USER'],
        },
        timestamp: '2025-07-23T16:00:00Z',
        path: '/users/me',
      },
    },
  })
  getProfile(@CurrentUser() currentUser: UserEntity, @Req() request: Request) {
    return {
      statusCode: 200,
      message: 'Usuário autenticado retornado com sucesso',
      data: currentUser,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }
}

import { Controller, Post, Body, Get, Query, Param, Patch, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { AuthenticationGuard } from '../../src/utility/guards/authentication.guard';
import { AuthorizeGuard } from '../../src/utility/guards/authorization.guard';
import { UserRole } from 'src/utility/common/user-roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  async signup(@Body() userSignUpDto: UserSignUpDto): Promise<{ message: string; user: Partial<UserEntity> }> {
    const user = await this.usersService.signup(userSignUpDto);
    return {
      message: 'Usuário criado com sucesso! Verifique seu e-mail para confirmar sua conta.',
      user,
    };
  }

  @Post('signin')
  async signin(
    @Body() userSignInDto: UserSignInDto,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    const user = await this.usersService.signin(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);
    return { accessToken, user };
  }

  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string): Promise<{ message: string }> {
    const message = await this.usersService.confirmEmail(token);
    return { message };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get('single/:id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity> {
    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    if (isAdmin || currentUser.id === +id) {
      return await this.usersService.findOne(+id);
    }
    throw new UnauthorizedException('Acesso negado.');
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    if (isAdmin || currentUser.id === +id) {
      return await this.usersService.update(+id, updateUserDto);
    }
    throw new UnauthorizedException('Você só pode editar sua própria conta.');
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ) {
    const isAdmin = currentUser.role.includes(UserRole.ADMIN);
    if (isAdmin || currentUser.id === +id) {
      return await this.usersService.remove(+id);
    }
    throw new UnauthorizedException('Você só pode excluir sua própria conta.');
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }
}

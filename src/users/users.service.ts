import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign, SignOptions } from 'jsonwebtoken';
import { generateEmailConfirmationToken } from 'src/utility/utils/token.util';
import * as nodemailer from 'nodemailer';
import { MailService } from 'src/utility/services/mail.services';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

    private mailService: MailService,  // <-- aqui você injeta o MailService
  ) { }

  async signup(userSignUpDto: UserSignUpDto): Promise<Partial<UserEntity>> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if (userExists) throw new BadRequestException('Este email não está disponível.');

    userSignUpDto.password = await hash(userSignUpDto.password, 10);

    let user = this.usersRepository.create(userSignUpDto);

    const token = generateEmailConfirmationToken();
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);

    user.emailConfirmationToken = token;
    user.emailConfirmationTokenExpires = expires;
    user.isEmailConfirmed = false;

    user = await this.usersRepository.save(user);

    delete (user as any).password;

    // Agora chama o mailService para enviar o e-mail
    await this.mailService.sendConfirmationEmail(user.email, token);

    return user;
  }
async confirmEmail(token: string): Promise<string> {
  const user = await this.usersRepository.findOne({ where: { emailConfirmationToken: token } });

  if (!user) {
    throw new BadRequestException('Token inválido.');
  }

  if (!user.emailConfirmationToken || !user.emailConfirmationTokenExpires || user.emailConfirmationTokenExpires < new Date()) {
    throw new BadRequestException('Token inválido ou expirado.');
  }

  user.isEmailConfirmed = true;
  user.emailConfirmationToken = null;
  user.emailConfirmationTokenExpires = null;

  await this.usersRepository.save(user);

  return 'E-mail confirmado com sucesso!';
}




async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
  const userExists = await this.usersRepository
    .createQueryBuilder('users')
    .addSelect('users.password')
    .where('users.email = :email', { email: userSignInDto.email })
    .getOne();

  if (!userExists) throw new BadRequestException('Ou e-mail ou senha são inválidos.');

  const matchPassword = await compare(userSignInDto.password, userExists.password);
  if (!matchPassword) throw new BadRequestException('Ou e-mail ou senha são inválidos.');

  if (!userExists.isEmailConfirmed) {
    throw new BadRequestException('Confirme seu e-mail para poder acessar a conta.');
  }

  delete (userExists as any).password;
  return userExists;
}



  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]>{
    return await this.usersRepository.find();
  }

  async findOne(id: number):Promise<UserEntity>{
   const user = await this.usersRepository.findOneBy({id});
   if(!user) throw new NotFoundException('Usuário não encontrado.')
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }


async accessToken(user: UserEntity): Promise<string> {
  const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
  const expiresInEnv = process.env.ACCESS_TOKEN_EXPIRE_TIME;

  if (!secret) throw new Error('ACCESS_TOKEN_SECRET_KEY not defined');
  if (!expiresInEnv) throw new Error('ACCESS_TOKEN_EXPIRE_TIME not defined');

  const options: SignOptions = {
    expiresIn: expiresInEnv as any
  };

  return sign({ id: user.id, email: user.email }, secret, options);
}

}
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserEntity } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    signup: jest.fn(),
    signin: jest.fn(),
    accessToken: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call usersService.signup and return message with user', async () => {
      const dto: UserSignUpDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '12345',
      };

      const userMock: Partial<UserEntity> = {
        id: 1,
        name: dto.name,
        email: dto.email,
      };

      mockUsersService.signup.mockResolvedValue(userMock);

      const result = await controller.signup(dto);

      expect(service.signup).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Usuário criado com sucesso! Verifique seu e-mail para confirmar sua conta.',
        user: userMock,
      });
    });
  });

  describe('signin', () => {
    it('should call usersService.signin and usersService.accessToken and return token and user', async () => {
      const dto: UserSignInDto = {
        email: 'test@example.com',
        password: '12345',
      };

      const userMock: Partial<UserEntity> = {
        id: 1,
        name: 'Test User',
        email: dto.email,
      };

      const tokenMock = 'fake-jwt-token';

      mockUsersService.signin.mockResolvedValue(userMock);
      mockUsersService.accessToken.mockResolvedValue(tokenMock);

      const result = await controller.signin(dto);

      expect(service.signin).toHaveBeenCalledWith(dto);
      expect(service.accessToken).toHaveBeenCalledWith(userMock);
      expect(result).toEqual({
        message: 'Login realizado com sucesso!',
        accessToken: tokenMock,
        user: userMock,
      });
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll and return list of users', async () => {
      const usersMock: Partial<UserEntity>[] = [
        { id: 1, name: 'User 1', email: 'u1@example.com' },
        { id: 2, name: 'User 2', email: 'u2@example.com' },
      ];

      mockUsersService.findAll.mockResolvedValue(usersMock);

      const fakeRequest = { url: '/users/all' } as any;

      const result = await controller.findAll(fakeRequest);

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 200,
        message: 'Lista de usuários retornada com sucesso',
        data: usersMock,
        timestamp: expect.any(String),
        path: '/users/all',
      });
    });
  });
});

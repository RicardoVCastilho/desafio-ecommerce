import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MailService } from '../utility/services/mail.services';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
    let service: UsersService;
    let usersRepository;
    let mailService;

    const mockUserRepository = {
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mockMailService = {
        sendConfirmationEmail: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(UserEntity), useValue: mockUserRepository },
                { provide: MailService, useValue: mockMailService },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        usersRepository = module.get(getRepositoryToken(UserEntity));
        mailService = module.get(MailService);

        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('should throw error if email already exists', async () => {
            usersRepository.findOneBy.mockResolvedValue({} as UserEntity); // <-- CORRIGIDO
            await expect(
                service.signup({
                    email: 'test@example.com',
                    password: '123456',
                    name: 'Test User',
                }),
            ).rejects.toThrow('Este email não está disponível.');
        });

        it('should create a new user and send confirmation email', async () => {
            usersRepository.findOneBy.mockResolvedValue(null); // <-- CORRIGIDO
            usersRepository.create.mockImplementation(dto => dto);
            usersRepository.save.mockImplementation(async user => ({
                ...user,
                id: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                emailConfirmationTokenExpires: user.emailConfirmationTokenExpires || null,
                emailConfirmationToken: user.emailConfirmationToken || null,
                isEmailConfirmed: user.isEmailConfirmed ?? false,
                role: user.role || [],
                categories: user.categories || [],
                products: user.products || [],
            }));

            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');
            mailService.sendConfirmationEmail.mockResolvedValue();

            const userDto = {
                email: 'new@example.com',
                password: 'password',
                name: 'New User',
            };

            const user = await service.signup(userDto);

            expect(usersRepository.create).toHaveBeenCalledWith(userDto);
            expect(usersRepository.save).toHaveBeenCalled();
            expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith(user.email, expect.any(String));
            expect(user.password).toBeUndefined();
            expect(user.emailConfirmationToken).toBeDefined();
            expect(user.isEmailConfirmed).toBe(false);
        });
    });

    describe('confirmEmail', () => {
        it('should throw if token not found', async () => {
            usersRepository.findOneBy.mockResolvedValue(null);
            await expect(service.confirmEmail('token')).rejects.toThrow('Token inválido ou expirado.');
        });

        it('should throw if token expired', async () => {
            const expiredUser = {
                emailConfirmationToken: 'token',
                emailConfirmationTokenExpires: new Date(Date.now() - 10000), // já expirado
            };
            usersRepository.findOneBy.mockResolvedValue(expiredUser);
            await expect(service.confirmEmail('token')).rejects.toThrow('Token inválido ou expirado.');
        });

        it('should confirm email if token valid', async () => {
            const token = 'valid-token';

            const fakeUser = {
                id: 1,
                email: 'test@example.com',
                emailConfirmationToken: token,
                emailConfirmationTokenExpires: new Date(Date.now() + 100000), // válido
                isEmailConfirmed: false,
            };

            mockUserRepository.findOne.mockResolvedValue(fakeUser);

            const result = await service.confirmEmail(token);

            expect(result).toBe('E-mail confirmado com sucesso!');
            expect(fakeUser.isEmailConfirmed).toBe(true);
            expect(fakeUser.emailConfirmationToken).toBeNull();
            expect(fakeUser.emailConfirmationTokenExpires).toBeNull();
            expect(mockUserRepository.save).toHaveBeenCalledWith(fakeUser);
        });

        describe('signin', () => {
            const userMock = {
                password: 'hashedpassword',
                isEmailConfirmed: true,
                email: 'user@example.com',
                name: 'User',
            };

            let queryBuilderMock;

            beforeEach(() => {
                queryBuilderMock = {
                    addSelect: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn(),
                };
                usersRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);
            });

            it('should throw if user not found', async () => {
                queryBuilderMock.getOne.mockResolvedValue(null);
                await expect(
                    service.signin({ email: 'no@user.com', password: 'pass' }),
                ).rejects.toThrow('Ou e-mail ou senha são inválidos.');
            });

            it('should throw if password does not match', async () => {
                queryBuilderMock.getOne.mockResolvedValue(userMock);
                jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

                await expect(
                    service.signin({ email: 'user@example.com', password: 'wrongpass' }),
                ).rejects.toThrow('Ou e-mail ou senha são inválidos.');
            });

            it('should throw if email not confirmed', async () => {
                queryBuilderMock.getOne.mockResolvedValue({
                    ...userMock,
                    isEmailConfirmed: false,
                });
                jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

                await expect(
                    service.signin({ email: 'user@example.com', password: 'correctpass' }),
                ).rejects.toThrow('Confirme seu e-mail para poder acessar a conta.');
            });

            it('should return user without password if valid login', async () => {
                queryBuilderMock.getOne.mockResolvedValue(userMock);
                jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

                const result = await service.signin({
                    email: 'user@example.com',
                    password: 'correctpass',
                });

                expect(result).toMatchObject({
                    email: 'user@example.com',
                    name: 'User',
                });
                expect((result as any).password).toBeUndefined();
            });
        });
    })
});

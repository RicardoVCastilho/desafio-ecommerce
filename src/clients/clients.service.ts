import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './entities/clients.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(data: CreateClientDto): Promise<ClientResponseDto> {
    const user = await this.userRepository.findOneBy({ id: data.userId });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const client = this.clientRepository.create({
      fullName: data.fullName,
      contact: data.contact,
      address: data.address,
      isActive: data.isActive ?? true,
      user,
    });

    const savedClient = await this.clientRepository.save(client);

    return {
      id: savedClient.id,
      fullName: savedClient.fullName,
      contact: savedClient.contact,
      address: savedClient.address,
      isActive: savedClient.isActive,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      createdAt: savedClient.createdAt,
      updatedAt: savedClient.updatedAt,
    };

  }

  async findAll() {
    return await this.clientRepository.find();
  }

  async findOne(id: number) {
    return await this.clientRepository.findOneBy({ id });
  }

  async findByUserId(userId: number): Promise<ClientEntity | null> {
  return this.clientRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });
}

  async update(id: number, updateClientDto: UpdateClientDto): Promise<ClientResponseDto> {
    const client = await this.clientRepository.findOne({ where: { id }, relations: ['user'] });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    Object.assign(client, updateClientDto);
    const updatedClient = await this.clientRepository.save(client);

    return {
      id: updatedClient.id,
      fullName: updatedClient.fullName,
      contact: updatedClient.contact,
      address: updatedClient.address,
      isActive: updatedClient.isActive,
      createdAt: updatedClient.createdAt,
      updatedAt: updatedClient.updatedAt,
      user: {
        id: updatedClient.user.id,
        name: updatedClient.user.name,
        email: updatedClient.user.email,
      },
    };
  }


  async remove(id: number) {
    const client = await this.findOne(id);
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    await this.clientRepository.remove(client);
    return { message: 'Cliente removido com sucesso' };
  }
}

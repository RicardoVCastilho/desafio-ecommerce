import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './entities/clients.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

async create(data: { fullName: string; contact: string; address: string; isActive?: boolean; userId: number }) {
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
    message: 'Cliente criado com sucesso!',
    createdBy: {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  };
}


  async findAll() {
    return await this.clientRepository.find();
  }

  async findOne(id: number) {
    return await this.clientRepository.findOneBy({ id });
  }

  async update(id: number, data: Partial<ClientEntity>) {
    await this.clientRepository.update(id, data);
    return this.findOne(id);
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

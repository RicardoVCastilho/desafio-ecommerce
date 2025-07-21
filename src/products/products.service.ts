import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService
  ) { }

  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(+createProductDto.categoryId);

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      addedBy: currentUser,
      category: category,
    });

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async findOne(id: number) {

    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
        category: true
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true
        },
        category: {
          id: true,
          title: true
        }
      }
    });
    if (!product) throw new NotFoundException('Produto não encontrado.')
    return product;
  }

async update(id: number, updateProductDto: Partial<UpdateProductDto>, currentUser: UserEntity): Promise<ProductEntity> {
  const product = await this.findOne(id);

  Object.assign(product, updateProductDto);
  product.addedBy = currentUser;

  if (updateProductDto.categoryId !== undefined) {
    const category = await this.categoryService.findOne(+updateProductDto.categoryId);
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }
    product.category = category;
  }

  return await this.productRepository.save(product);
}


  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

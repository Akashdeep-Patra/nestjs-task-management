import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const password = await bcrypt.hash(createUserDto.password, salt);
    const user = this.create({ ...createUserDto, password });

    try {
      return await this.save(user);
    } catch (error) {
      if (parseInt(error.code) === 23505) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException(
          'OOps looks like something went wrong : ' + error.message,
        );
      }
    }
  }
}

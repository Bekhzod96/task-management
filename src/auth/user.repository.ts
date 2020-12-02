import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto';
import { User } from './user.entity';

import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.create();
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCreadentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCreadentialsDto;

    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    }
    return null;
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

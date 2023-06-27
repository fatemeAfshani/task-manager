import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  private saltRounds = 10;
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser({ username, password }: UserCredentialsDto): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      const user = this.create({
        username,
        password: hashedPassword,
      });

      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        //duplicate password
        throw new ConflictException('username already exist');
      }
      throw new InternalServerErrorException();
    }
  }
}

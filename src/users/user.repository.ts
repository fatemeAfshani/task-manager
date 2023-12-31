import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  private saltRounds = 10;
  private logger = new Logger('UserRepository');
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser({ username, password }: UserCredentialsDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      const user = this.create({
        username,
        password: hashedPassword,
      });

      await user.save();
      delete user.password;
      return user;
    } catch (error) {
      this.logger.error(`error in adding new user`, error.stack);
      if (error.code === '23505') {
        //duplicate password
        throw new ConflictException('username already exist');
      }
      throw new InternalServerErrorException();
    }
  }

  async checkCredentials({
    username,
    password,
  }: UserCredentialsDto): Promise<string> {
    const user = await this.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) return null;

    return username;
  }
}

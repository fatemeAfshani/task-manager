import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { Payload } from './jwt-payload.type';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(userCredential: UserCredentialsDto): Promise<void> {
    return this.userRepository.createUser(userCredential);
  }

  async signin(
    userCredential: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.checkCredentials(userCredential);
    if (!username) {
      throw new UnauthorizedException('invalid login');
    }

    const payload: Payload = { username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}

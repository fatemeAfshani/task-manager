import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  async signup(
    @Body(ValidationPipe) userCredential: UserCredentialsDto,
  ): Promise<void> {
    return this.userService.signup(userCredential);
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  async signup(@Body() userCredential: UserCredentialsDto): Promise<void> {
    return this.userService.signup(userCredential);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(
    @Body() userCredential: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signin(userCredential);
  }
}

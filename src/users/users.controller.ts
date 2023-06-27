import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
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

  @Post('/signin')
  async signin(
    @Body(ValidationPipe) userCredential: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signin(userCredential);
  }
}

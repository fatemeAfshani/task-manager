import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  @ApiResponse({
    status: 201,
    description: 'successful sign up',
  })
  @ApiResponse({ status: 409, description: 'username already exist' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async signup(@Body() userCredential: UserCredentialsDto): Promise<User> {
    return this.userService.signup(userCredential);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  @ApiResponse({
    status: 200,
    description: 'successful sign in',
  })
  @ApiResponse({ status: 401, description: 'invalid login' })
  async signin(
    @Body() userCredential: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signin(userCredential);
  }
}

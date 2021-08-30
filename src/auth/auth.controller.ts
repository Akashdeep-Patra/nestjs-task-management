import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';
import { AccessTokenResponse, SigninUserDto } from './signin-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<AccessTokenResponse> {
    return this.authService.signUp(createUserDto);
  }

  @Get('/signin')
  signIn(@Body() signInUserDto: SigninUserDto): Promise<AccessTokenResponse> {
    return this.authService.signIn(signInUserDto);
  }
}

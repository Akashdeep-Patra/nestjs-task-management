import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';
import { AccessTokenResponse, SigninUserDto } from './signin-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<AccessTokenResponse> {
    const user = await this.userRepository.createUser(createUserDto);
    return await this.getAccessToken(user);
  }
  async signIn(signInUserDto: SigninUserDto): Promise<AccessTokenResponse> {
    const { username, password } = signInUserDto;
    const user = await this.userRepository.findOne({ username });
    if (user && (await bcrypt.compareSync(password, user.password))) {
      return await this.getAccessToken(user);
    } else {
      throw new UnauthorizedException('Please check your login credentials ');
    }
  }
  async getAccessToken(user: User): Promise<AccessTokenResponse> {
    const payload = { ...user, password: undefined };
    const accessToken: string = await this.jwtService.sign(payload);
    return { accessToken };
  }
}

import { IsString } from 'class-validator';

export class SigninUserDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}

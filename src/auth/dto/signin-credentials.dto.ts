import { IsNotEmpty } from 'class-validator';

export class SignInCredentialsDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

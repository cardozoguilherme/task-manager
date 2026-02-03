import { IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  // Password will contain at least 1 upper case letter
  // Password will contain at least 1 lower case letter
  // Password will contain at least 1 number or special character
  // There is no length validation (min, max) in this regex
  password: string;
}

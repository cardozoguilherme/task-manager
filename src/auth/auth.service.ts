import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { UserService } from '../user/user.service';
import { compare } from '../common/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto) {
    const { username, password } = signUpCredentialsDto;

    return this.userService.createUser(username, password);
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto) {
    const { username, password } = signInCredentialsDto;

    const user = await this.userService.findUserByUsername(username);

    const isPasswordValid = await compare(password, user.password);

    if (user && isPasswordValid) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}

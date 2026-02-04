import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { genSalt, hash } from '../common/bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUser(username: string, password: string) {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    try {
      return await this.prisma.user.create({
        data: { username, password: hashedPassword },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.warn(`Attempt to create duplicate username: ${username}`);
          throw new ConflictException('Username already exists');
        }
        this.logger.error(`Prisma error: ${error.code} - ${error.message}`);
      } else {
        this.logger.error('Unknown error:', error);
      }
      throw error;
    }
  }

  async findUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new NotFoundException('Invalid credentials.');
    }

    return user;
  }
}

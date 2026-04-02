import { Injectable } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  findById(userId: string) {
    return this.prismaService.user.findFirst({ where: { id: userId } });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async create({
    email,
    passwordHash,
  }: {
    email: string;
    passwordHash: string;
  }) {
    const role = (await this.isFirstUser()) ? UserRole.ADMIN : UserRole.USER;

    return this.prismaService.user.create({
      data: { email, passwordHash, role },
    });
  }

  markEmailVerified(userId: string) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  updatePassword({
    userId,
    passwordHash,
  }: {
    userId: string;
    passwordHash: string;
  }) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  private async isFirstUser() {
    const count = await this.prismaService.user.count();

    return count === 0;
  }
}

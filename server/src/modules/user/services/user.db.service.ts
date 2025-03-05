import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserDbService {
    constructor(private readonly prisma: PrismaService) {}

    async findUserById(id: string) {
        return await this.prisma.user.findUnique({
            where: { id },
            select: {
                name: true,
                email: true,
                createdAt: true,
            },
        });
    }

    /**
     *
     * @description To only be used for authentication - returns the user with the password
     */
    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async createUser(createUserDto: CreateUserDto) {
        return this.prisma.user.create({
            data: { ...createUserDto, createdAt: Math.floor(new Date().getTime() / 1000) },
        });
    }
}

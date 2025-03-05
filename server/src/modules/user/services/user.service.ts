import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto";
import { hashPassword } from "src/common/utils/auth.util";
import { UserDbService } from "./user.db.service";

@Injectable()
export class UserService {
    constructor(private userDbService: UserDbService) {}

    async register(data: CreateUserDto) {
        if (data.honeypot) throw new BadRequestException("Unexpected Error Occured");

        const exists = await this.userDbService.findUserByEmail(data.email);
        if (exists) throw new BadRequestException("User with this email already exists");

        // hash password
        data.password = await hashPassword(data.password);

        const user = await this.userDbService.createUser(data);

        const { password, id, ...rest } = user;

        return rest;
    }

    async findUser(id: string) {
        return await this.userDbService.findUserById(id);
    }

    async findUserByEmail(email: string) {
        return await this.userDbService.findUserByEmail(email);
    }
}

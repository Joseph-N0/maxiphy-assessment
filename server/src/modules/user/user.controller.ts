import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./services";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { User } from "src/common/decorators/user.decorator";
import { CreateUserDto } from "./dto";

@ApiTags("user")
@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get("me")
    async me(@User() user: Express.User) {
        return await this.userService.findUser(user.id);
    }

    @Post("register")
    async create(@Body() data: CreateUserDto) {
        return await this.userService.register(data);
    }
}

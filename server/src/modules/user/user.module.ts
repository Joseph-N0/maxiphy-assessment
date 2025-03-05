import { Module } from "@nestjs/common";
import { UserService, UserDbService } from "./services";
import { UserController } from "./user.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserDbService],
    exports: [UserService, UserDbService],
})
export class UserModule {}

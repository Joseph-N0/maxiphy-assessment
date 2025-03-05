import { IsEmail, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { OmitType, PartialType } from "@nestjs/mapped-types";

export class CreateUserDto {
    @ApiProperty({ required: true, example: "John" })
    @IsString()
    name: string;

    @ApiProperty({ required: true, example: "johnDoe@gmail.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ required: true, example: "password123" })
    @IsString()
    password: string;

    //honeypot
    @ApiProperty({ required: false, example: " " })
    @IsOptional()
    @IsString()
    honeypot?: string;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ["password", "email"] as const)) {}

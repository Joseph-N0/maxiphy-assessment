import { IsBoolean, IsNumber, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { startOfDay } from "date-fns";

export class CreateTaskDto {
    @ApiProperty({ required: true, example: "Task 1" })
    @IsString()
    description: string;

    @ApiProperty({ required: true, enum: [1, 2, 3] })
    @IsNumber()
    priority: number;

    @ApiProperty({ required: true, example: "unix date" })
    @IsNumber()
    @Min(startOfDay(new Date()).getTime() / 1000, { message: "Date cannot be in the past" }) // ✅ Ensures only today or future dates
    date: number;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({ required: true, example: "true" })
    @IsBoolean()
    completed?: boolean;
}

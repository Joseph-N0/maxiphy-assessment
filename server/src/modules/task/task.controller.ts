import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard";
import { ApiTags } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { CreateTaskDto, UpdateTaskDto } from "./dto";
import { User } from "src/common/decorators";

@ApiTags("Task")
@UseGuards(JwtAuthGuard)
@Controller("task")
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get("all")
    async findAllTasks(
        @User() user: Express.User,
        @Query("page") page?: string,
        @Query("limit") limit?: string,
        @Query("completed") completed?: string,
        @Query("date") date?: string,
        @Query("priority") priority?: string,
    ) {
        try {
            const pageNumber = page && !isNaN(Number(page)) ? parseInt(page, 10) : 1;
            const limitNumber = limit && !isNaN(Number(limit)) ? parseInt(limit, 10) : 5;
            const priorityNumber = priority && !isNaN(Number(priority)) ? parseInt(priority, 10) : undefined;

            return await this.taskService.findAllTasks(user.id, pageNumber, limitNumber, priorityNumber, completed, date);
        } catch (error) {
            throw new BadRequestException("Invalid query parameters");
        }
    }

    @Post("new")
    async create(@User() user: Express.User, @Body() data: CreateTaskDto) {
        return await this.taskService.createTask(data, user.id);
    }

    @Patch(":id")
    async update(@Param("id") id: string, @Body() data: UpdateTaskDto) {
        return await this.taskService.updateTask(id, data);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return await this.taskService.deleteTask(id);
    }
}

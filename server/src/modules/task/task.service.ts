import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto, UpdateTaskDto } from "./dto";

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllTasks(userId: string, page: number = 1, limit: number = 5, priority?: number, completed?: string, date?: string) {
        try {
            // Ensure pagination values are valid
            const validPage = Math.max(page, 1);
            const validLimit = Math.max(limit, 1);
            const skip = (validPage - 1) * validLimit;

            // Constructing the where clause with safe parsing
            const whereClause: Record<string, any> = { userId };

            if (completed !== undefined) {
                whereClause["completed"] = completed.toLowerCase() === "true";
            }

            if (date !== undefined && !isNaN(Number(date))) {
                whereClause["date"] = Math.floor(Number(date));
            }

            if (priority !== undefined && !isNaN(priority)) {
                whereClause["priority"] = priority;
            }

            // Fetching tasks from database
            return await this.prisma.task.findMany({
                where: whereClause,
                orderBy: [{ priority: "asc" }, { date: "asc" }],
                skip,
                take: validLimit,
            });
        } catch (error) {
            console.error("Error fetching tasks:", error);
            throw new Error("Failed to fetch tasks. Please try again later.");
        }
    }

    async createTask(createTaskDto: CreateTaskDto, userId: string) {
        return await this.prisma.task.create({
            data: {
                ...createTaskDto,
                createdAt: Math.floor(new Date().getTime() / 1000),
                userId,
            },
        });
    }

    async updateTask(id: string, data: UpdateTaskDto) {
        return await this.prisma.task.update({
            where: {
                id: id,
            },
            data,
        });
    }

    async deleteTask(id: string) {
        return await this.prisma.task.delete({
            where: {
                id: id,
            },
        });
    }
}

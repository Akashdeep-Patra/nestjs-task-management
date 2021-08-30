import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './create-task.dto';
import { GetTasksFilterDto } from './get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './task.repository';
import { UpdateTaskDto } from './update-task.dto';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}
  // private tasks: Task[] = [];
  async getAllTasks(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }
  async getTaskById(id: string, user: User): Promise<Task> {
    //try to get task if not throw a 404 error
    const found = await this.tasksRepository.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(
        `Oops looks like task with id ${id} does not exist`,
      );
    }
    return found;
  }
  async deleteTaskById(id: string, user: User): Promise<DeleteResult> {
    await this.getTaskById(id, user);
    return await this.tasksRepository.delete(id);
  }

  async updateTaskById(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const found = await this.getTaskById(id, user);

    return await this.tasksRepository.save({ ...found, ...updateTaskDto });
  }
  async getTasksWithFilters(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }
}

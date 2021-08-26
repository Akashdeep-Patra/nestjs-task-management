import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from './task-status.enum';
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
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
  async getTaskById(id: string): Promise<Task> {
    //try to get task if not throw a 404 error
    const found = await this.tasksRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(
        `Oops looks like task with id ${id} does not exist`,
      );
    }
    return found;
  }
  async deleteTaskById(id: string) {
    await this.getTaskById(id);
    return await this.tasksRepository.delete(id);
  }

  async updateTaskById(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const found = this.getTaskById(id);
    return this.tasksRepository.save({ ...found, ...updateTaskDto });
  }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   return this.tasks.filter(
  //     ({ status, title, description }) =>
  //       status === filterDto.status ||
  //       title.search(filterDto.searchText) !== -1 ||
  //       description.search(filterDto.searchText) !== -1,
  //   );
  // }
}

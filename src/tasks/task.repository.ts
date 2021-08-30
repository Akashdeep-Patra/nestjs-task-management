import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './create-task.dto';
import { GetTasksFilterDto } from './get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user: user,
    });
    await this.save(task);
    return task;
  }
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    const { status, searchText } = filterDto;
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :columnStatus', { columnStatus: status });
    }
    if (searchText) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:searchText) OR LOWER(task.description) LIKE LOWER(:searchText))',
        { searchText: `%${searchText}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
}

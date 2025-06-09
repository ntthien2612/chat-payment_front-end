import { Routes } from '@angular/router';
import { ListTaskComponent } from './list-task/list-task.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const tasksRoutes: Routes = [
  { path: 'tasks', component: ListTaskComponent, canActivate: [AuthGuard] },   // 📝 Danh sách công việc
  { path: 'create-task', component: CreateTaskComponent, canActivate: [AuthGuard] } // ➕ Tạo công việc mới
];
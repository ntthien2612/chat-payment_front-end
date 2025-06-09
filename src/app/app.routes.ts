import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth-routing.module';
import { tasksRoutes } from './features/task/tasks-routing.module';
import { ChatComponent } from './features/chat/chat.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },    // 🌟 Mặc định điều hướng đến danh sách tasks
  ...authRoutes, // ✅ Gộp route của Auth vào đây,
  ...tasksRoutes, // ✅ Import routes của Tasks
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard]}, // 💬 Đường dẫn đến chat component
  { path: '**', redirectTo: 'tasks' }                // 🚫 Đường dẫn không hợp lệ điều hướng về tasks

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], // 🔥 BẮT BUỘC để routerLink hoạt động
})
export class AppRoutingModule { }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // ✅ Đảm bảo service được cung cấp toàn cục
})
export class TaskStoreService {
  private _tasks = new BehaviorSubject<Task[]>([]);
  readonly tasks$ = this._tasks.asObservable();

  constructor(private taskService: TaskService, private router: Router) { }

  // 🚀 Load danh sách tasks từ server
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this._tasks.next(tasks),
      error: (error) => {
        console.error('Lỗi khi tải tasks:', error);
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']); // Chuyển hướng đến trang login
        }
      }
    });
  }

  // 🎯 TẠO TASK MỚI và CẬP NHẬT DANH SÁCH
  createTask(task: Partial<Task>): void {
    this.taskService.createTask(task).subscribe({
      next: (createdTask) => {
        const updatedTasks = [...this._tasks.getValue(), createdTask]; // 🆕 Thêm task mới vào danh sách
        this._tasks.next(updatedTasks); // 🔄 Cập nhật state để tasks$ phát giá trị mới
        alert('✅ Công việc đã được tạo!');
        this.router.navigate(['/tasks']); // 🔄 Điều hướng về danh sách task
      },
      error: (err) => {
        console.error('❌ Lỗi khi tạo task:', err);
        if (err.status === 401 || err.status === 403) {
          alert('⚠ Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
          this.router.navigate(['/login']); // 🔄 Điều hướng về trang login
        } else {
          alert('❌ Không thể tạo công việc! Vui lòng thử lại.');
        }
      },
    });
  }
}

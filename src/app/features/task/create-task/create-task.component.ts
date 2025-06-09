import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';
import { TaskStoreService } from '../task-store.service';

@Component({
  selector: 'app-create-task',
  standalone: true, // ✅ Xác nhận là standalone component
  imports: [CommonModule, FormsModule], // ✅ Import các module cần thiết
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css' // ✅ Đúng cú pháp
})
export class CreateTaskComponent {
  @Output() createTask = new EventEmitter<Task>();

  // 🔄 Dùng object để quản lý form
  newTask: Partial<Task> = {
    title: '',
    description: ''
  };

  constructor(private taskStoreService: TaskStoreService) {}

  /**
   * 🚀 Gọi service để tạo task mới khi form được submit
   */
  onSubmit() {
    if (this.newTask.title?.trim() && this.newTask.description?.trim()) {
      this.taskStoreService.createTask(this.newTask); // 🔥 Gọi store để thêm task
      this.resetForm(); // 🔄 Reset form sau khi thêm
    }
  }

  /**
   * 🔄 Reset form sau khi tạo task
   */
  resetForm() {
    this.newTask = { title: '', description: '' };
  }
}
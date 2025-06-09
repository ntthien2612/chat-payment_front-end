import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskStoreService } from '../task-store.service';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-list-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.css'
})
export class ListTaskComponent {
  
  tasks$: Observable<Task[]>; // ✅ Khai báo observable cho danh sách tasks

  constructor(private taskStore: TaskStoreService) {
    this.tasks$ = this.taskStore.tasks$; // ✅ Gán observable từ store sau khi khởi tạo
  }

  ngOnInit(): void {
    this.taskStore.loadTasks(); // ✅ Tải tasks từ server khi component khởi chạy
  }
}

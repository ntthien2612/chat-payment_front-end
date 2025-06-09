import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly BASE_URL = `${environment.BASE_URL}/todos`;

  constructor(private http: HttpClient) { }

  // 🌐 Lấy tất cả tasks từ FastAPI server
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.BASE_URL);
  }

  // ✍️ Tạo task mới với đầy đủ thông tin
  createTask(task: Partial<Task>): Observable<Task> {
    const newTask = { ...task, completed: false };
    return this.http.post<Task>(this.BASE_URL, newTask);
  }
  // 📝 Cập nhật trạng thái hoàn thành của task
  // updateTask(task: Task): Observable<Task> {
  //   return this.http.put<Task>(`${this.BASE_URL}/${task.id}`, task);
  // }

  // 🗑 Xoá task theo ID
  // deleteTask(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  // }
}
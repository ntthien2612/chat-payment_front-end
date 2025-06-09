import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Xác nhận là standalone component
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // ✅ Import các module cần thiết
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.saveToken(response.access_token);
          this.router.navigate(['/tasks']); // Chuyển hướng sau khi đăng nhập thành công
        },
        error: () => {
          this.errorMessage = "Email hoặc mật khẩu không đúng!";
        }
      });
    }
  }

  loginWithGoogle() {
    // Chuyển hướng đến API OAuth2 Google (tùy theo backend bạn định nghĩa)
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}
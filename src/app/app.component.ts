import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // ✅ Import RouterModule để dùng router-outlet
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [AuthService] // ✅ Không cần provider ở đây, AuthService đã được cung cấp trong HeaderComponent
})
export class AppComponent {
    constructor(private authService: AuthService) { }
    logout() {
      this.authService.logout();
    }
}

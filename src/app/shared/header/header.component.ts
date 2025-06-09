import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
  providers: [AuthService]
})
export class HeaderComponent {
  constructor(private authService: AuthService) { }
  logout() {
    this.authService.logout();
  }

}

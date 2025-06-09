import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { TaskService } from "./core/services/task.service";

import { AppRoutingModule } from "./app.routes";
import { TaskStoreService } from "./features/task/task-store.service";
import { SharedModule } from "./shared/shared.module";
import { AuthService } from "./core/services/auth.service";
import { AuthGuard } from "./core/guards/auth.guard";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";

@NgModule({
    imports: [
        BrowserModule,        // Chạy ứng dụng trên trình duyệt
        SharedModule,         // Chứa các component, pipes, directives dùng chung
        ReactiveFormsModule,  // Hỗ trợ reactive forms
        FormsModule,          // Hỗ trợ template-driven forms
        RouterModule,         // Kết nối router với ứng dụng
        AppRoutingModule,     // Định tuyến
    ],
    providers: [
        TaskService,          // Dịch vụ thao tác với API
        TaskStoreService,     // Dịch vụ quản lý state với RxJS
        AuthService,          // Dịch vụ xác thực
        AuthGuard,             // Guard bảo vệ route,
            {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class AppModule { }
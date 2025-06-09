import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [], // ✅ Khai báo component dùng chung
  imports: [
    CommonModule, 
    FormsModule  // ✅ Để hỗ trợ form trong component
  ],
  exports: [
    FormsModule, 
    CommonModule  // ✅ Để tránh phải import lại ở các module khác
  ]
})
export class SharedModule { }
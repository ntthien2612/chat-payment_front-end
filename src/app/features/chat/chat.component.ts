import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService, AuthService] // Cung cấp service ở phạm vi component
})
export class ChatComponent implements OnInit {
  users: User[] = [];                                 // Danh sách tất cả user có thể chat
  selectedUser: User | null = null;                   // User đang được chọn để chat
  messages: { [userId: number]: any[] } = {};         // Lưu tin nhắn theo userId
  selectedMessages: any[] = [];                       // Tin nhắn đang hiển thị trên UI
  messageContent: string = '';                        // Nội dung tin nhắn đang nhập
  currentUsername: string = '';                       // Tên của user hiện tại
  currentUser: User = { id: 0, username: '', email: '' }; // Thông tin user hiện tại

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 🔐 Lấy thông tin user hiện tại
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.currentUsername = user.username;

        // 🌐 Kết nối WebSocket sau khi có user hiện tại
        this.chatService.connect(this.currentUsername, this.handleIncomingMessage.bind(this));
      },
      error: (err) => console.error("❌ Không thể lấy user hiện tại:", err)
    });

    // 📥 Lấy danh sách user có thể chat
    this.chatService.getAllChatUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error("❌ Không thể lấy danh sách users:", err)
    });
  }

  // 👤 Chọn một người để bắt đầu hoặc tiếp tục chat
  selectUser(user: User): void {
    this.selectedUser = user;

    // Nếu đã có tin nhắn thì hiển thị ngay, nếu chưa thì lấy từ server
    if (this.messages[user.id]) {
      this.selectedMessages = this.getChatMessages();
    } else {
      this.messages[user.id] = [];
      this.getUserChats(user.email);
    }
  }

  // 📤 Gửi tin nhắn tới user đang chọn
  sendMessage(): void {
    if (!this.messageContent.trim() || !this.selectedUser) return;

    const message = {
      sender: this.currentUser.email,
      receiver: this.selectedUser.email,
      content: this.messageContent.trim(),
      timestamp: new Date().toISOString()
    };

    this.addMessageToUser(this.selectedUser.id, message);
    this.selectedMessages = this.getChatMessages();

    this.chatService.sendMessage('/app/private-message', message);
    this.messageContent = '';
  }

  // 📩 Xử lý tin nhắn nhận từ WebSocket
  handleIncomingMessage(message: any): void {
    const sender = this.users.find(u => u.email === message.sender);
    const receiver = this.users.find(u => u.email === message.receiver);
    if (!sender || !receiver) return;

    const isIncoming = message.sender !== this.currentUser.email;
    const chatUser = isIncoming ? sender : receiver;

    this.addMessageToUser(chatUser.id, message);

    // Nếu đang chat với user gửi/nhận thì hiển thị luôn
    if (this.selectedUser && this.selectedUser.id === chatUser.id) {
      this.selectedMessages = this.getChatMessages();
    }
  }

  // 📚 Lấy tất cả tin nhắn giữa currentUser và selectedUser, có sắp xếp
  getChatMessages(): any[] {
    if (!this.selectedUser) return [];

    const messages = this.messages[this.selectedUser.id] || [];

    const relevantMessages = messages.filter(msg =>
      this.selectedUser &&
      (
        (msg.sender === this.currentUser.email && msg.receiver === this.selectedUser.email) ||
        (msg.receiver === this.currentUser.email && msg.sender === this.selectedUser.email)
      )
    );

    return relevantMessages.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  // 🔠 Lấy tên người dùng từ email
  getUsername(email: string): string {
    if (email === this.currentUser.email) return this.currentUser.username;
    return this.users.find(u => u.email === email)?.username || email;
  }

  // 📥 Gọi API để lấy lịch sử tin nhắn với một user
  getUserChats(email: string): void {
    this.chatService.getUserChats(email).subscribe({
      next: (messages) => {
        const user = this.users.find(u => u.email === email);
        if (!user) return;

        this.messages[user.id] = messages;
        this.selectedMessages = this.getChatMessages();
      },
      error: (err) => console.error("❌ Không thể lấy danh sách chat:", err)
    });
  }

  // ➕ Thêm tin nhắn vào danh sách tin nhắn của một user
  private addMessageToUser(userId: number, message: any): void {
    if (!this.messages[userId]) {
      this.messages[userId] = [];
    }
    this.messages[userId].push(message);
  }
}

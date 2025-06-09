import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Client, IMessage, Stomp } from "@stomp/stompjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly BASE_URL = `${environment.BASE_URL}`;
  private readonly CHAT_URL = `${environment.CHAT_URL}`;
  private stompClient!: Client;
  private connected = false;

  constructor(private http: HttpClient) { }

  // Lấy danh sách tất cả người dùng trong cuộc trò chuyện
  getAllChatUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/users/userchat`);
  }

  // Lấy danh sách cuộc trò chuyện của người dùng
  getUserChats(username: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.BASE_URL}/messages/history?receiver=${username}`)
  }

  connect(username: string, onMessageReceived: (msg: any) => void) {
    const token = localStorage.getItem('access_token'); // 👈 dùng giống interceptor
    console.log("🔗 Kết nối WebSocket với user:", username, "và token:", token);
    this.connected = true;
    this.stompClient = new Client({
      brokerURL: `${this.CHAT_URL}`,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        login: username
      },
      onConnect: () => {
        console.log("✅ Kết nối thành công WebSocket với user:", username);
        this.stompClient.subscribe('/user/queue/messages', (message: IMessage) => {
          console.log("📥 Nhận tin nhắn:", message.body);
          if (message.body) {
            onMessageReceived(JSON.parse(message.body));
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ Lỗi khi kết nối WebSocket:", frame.body);
      },
      onWebSocketClose: () => {
        console.warn("🔌 WebSocket disconnected");
      }
    });
    this.stompClient.activate(); // Gửi kết nối
  }

  sendMessage(destination: string, message: any) {
    if (this.stompClient && this.stompClient.connected) {
      console.log("📤 Gửi tin nhắn đến:", destination, "với nội dung:", message);
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(message),
      });
    } else {
      console.error('🚫 STOMP client not connected.');
    }
  }

  disconnect() {
    if (this.connected && this.stompClient) {
      this.stompClient.deactivate().then(() => {
        console.log('❌ Disconnected');
        this.connected = false;
      });
    }
  }

}   
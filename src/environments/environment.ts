// public API URL and WebSocket URL for development environment
// export const environment = {
//     production: false,
//     BASE_URL: 'http://172.16.3.177:8080/api',
//     CHAT_URL: 'ws://172.16.3.177:8080/ws-chat',
//   };

// Private API URL and WebSocket URL for production environment
export const environment = {
  production: true,
  BASE_URL: 'http://localhost:8080/api',
  CHAT_URL: 'ws://localhost:8080/ws-chat',
};
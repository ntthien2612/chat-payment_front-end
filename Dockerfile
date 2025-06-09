# Sử dụng Node.js để chạy Angular
FROM node:18 AS dev

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Expose cổng 4200 để truy cập ứng dụng
EXPOSE 4200

# Chạy Angular dev server với hot reload
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--poll=2000"]
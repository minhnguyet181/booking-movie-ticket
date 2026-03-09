# Hướng Dẫn Về Yarn.lock

## Yarn.lock là gì?

`yarn.lock` là file được tạo tự động bởi Yarn khi bạn chạy lệnh `yarn install`. File này:
- Lưu trữ phiên bản chính xác của tất cả dependencies
- Đảm bảo mọi người cài đặt cùng một phiên bản packages
- Được tạo tự động, không cần tạo thủ công

## Cách tạo yarn.lock

Khi bạn chạy lệnh cài đặt, yarn.lock sẽ được tạo tự động:

```bash
# Trong thư mục server
cd server
yarn install
# yarn.lock sẽ được tạo tự động

# Trong thư mục app
cd app
yarn install
# yarn.lock sẽ được tạo tự động
```

## Lưu ý

- **Không cần** tạo yarn.lock thủ công
- File này sẽ được tạo khi bạn chạy `yarn install` lần đầu
- Nên commit yarn.lock vào git để đảm bảo mọi người dùng cùng phiên bản packages
- Nếu yarn.lock đã tồn tại, yarn sẽ sử dụng nó để cài đặt đúng phiên bản

## Cài đặt Yarn (nếu chưa có)

### Trên Linux:
```bash
# Cài đặt qua npm (nếu đã có Node.js)
npm install -g yarn

# Hoặc cài đặt qua apt (Ubuntu/Debian)
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

### Kiểm tra cài đặt:
```bash
yarn --version
```

# FreeTrader

基金追踪应用程序，提供ETF信息查询、用户管理和数据可视化功能。

## 技术栈

### 前端
- **Next.js 16** - React框架
- **React 19** - UI库
- **TypeScript** - 类型安全
- **Tailwind CSS 4** - 样式框架
- **Zustand** - 状态管理
- **Radix UI** - UI组件库
- **Lightweight Charts** - 图表组件
- **Axios** - HTTP客户端

### 后端
- **Spring Boot 3.2.1** - Java框架
- **Java 17** - 编程语言
- **Spring Security 6** - 安全框架（JWT认证）
- **MyBatis-Plus 3.5.5** - ORM框架
- **MySQL 8.0** - 数据库
- **Redis** - 缓存和Token黑名单
- **JWT (jjwt 0.12.3)** - Token认证
- **SpringDoc OpenAPI 2.3.0** - API文档
- **Lombok** - 简化代码

## 项目结构

```
FreeTrader/
├── frontend/          # Next.js前端应用
│   ├── src/           # 源代码
│   ├── public/        # 静态资源
│   └── package.json   # 前端依赖配置
├── backend/           # Spring Boot后端
│   └── src/main/java/com/freetrader/
│       ├── config/    # 配置类（Cors、Redis、Security等）
│       ├── controller/# 控制器（Auth、Sector、Favorite）
│       ├── dto/       # 数据传输对象
│       ├── entity/    # 实体类
│       ├── exception/ # 异常处理（BusinessException、GlobalExceptionHandler）
│       ├── mapper/    # 数据访问层
│       ├── security/  # 安全配置（JWT、Filter）
│       └── service/   # 业务逻辑层
└── sql/               # 数据库初始化脚本
```

## 主要功能

- 用户注册和登录（JWT Access/Refresh Token）
- ETF信息查询和板块浏览
- 用户收藏管理（收藏/取消收藏）
- Redis缓存和Token黑名单机制
- 分类/板块平均涨跌幅计算
- 净值数据展示和图表可视化
- Swagger API文档自动生成

## API文档

启动后端服务后，可通过以下地址访问API文档：
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## 快速开始

### 环境要求

- Node.js 18+
- Java 17+
- MySQL 8.0+
- Maven 3.8+
- Redis 6.0+（可选，缓存功能需要）

### 数据库初始化

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE freetrader;

# 导入SQL脚本
mysql -u root -p freetrader < sql/user_info.sql
mysql -u root -p freetrader < sql/etf_info.sql
mysql -u root -p freetrader < sql/etf_netasset.sql
mysql -u root -p freetrader < sql/category.sql
mysql -u root -p freetrader < sql/calendar.sql
mysql -u root -p freetrader < sql/user_collection.sql
```

### 后端启动

```bash
cd backend

# 修改 application.yml 配置数据库连接和Redis
# mvn clean package
# mvn spring-boot:run

# 或使用IDE运行 FreeTraderApplication
```

### 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
npm start
```

访问 http://localhost:3000 查看前端应用

## 开发说明

### 后端

- 入口文件：`backend/src/main/java/com/freetrader/FreeTraderApplication.java`
- 配置文件：`backend/src/main/resources/application.yml`
- API端口：8080
- 支持通过环境变量覆盖配置（DB_URL, JWT_SECRET, REDIS_HOST等）

### 前端

- 开发端口：3000
- 源码目录：`frontend/src`
- API代理：已配置到后端8080端口

## 安全特性

- JWT Token认证（Access Token 1小时，Refresh Token 7天）
- Token黑名单机制（登出后Token失效）
- BCrypt密码加密
- 统一异常处理
- CORS跨域配置

## 许可证

MIT

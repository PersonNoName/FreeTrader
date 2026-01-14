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
- **Spring Security** - 安全框架（JWT认证）
- **MyBatis-Plus 3.5.5** - ORM框架
- **MySQL** - 数据库
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
│       ├── config/    # 配置类
│       ├── controller/# 控制器
│       ├── dto/       # 数据传输对象
│       ├── entity/    # 实体类
│       ├── mapper/    # 数据访问层
│       ├── security/  # 安全配置
│       └── service/   # 业务逻辑层
└── sql/               # 数据库初始化脚本
```

## 主要功能

- 用户注册和登录（JWT认证）
- ETF信息查询
- 用户收藏管理
- 分类/板块浏览
- 净值数据展示
- 数据可视化图表

## 快速开始

### 环境要求

- Node.js 18+
- Java 17+
- MySQL 8.0+
- Maven 3.8+

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

# 修改 application.yml 配置数据库连接
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

### 前端

- 开发端口：3000
- 源码目录：`frontend/src`
- API代理：已配置到后端8080端口

## 许可证

MIT

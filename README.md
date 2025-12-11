# Worker + D1 Database

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/d1-template)

![Worker + D1 Template Preview](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/cb7cb0a9-6102-4822-633c-b76b7bb25900/public)

<!-- dash-content-start -->

D1 是 Cloudflare 的原生无服务器 SQL 数据库（[文档](https://developers.cloudflare.com/d1/)）。本项目演示了如何使用带有 D1 绑定的 Worker 来执行 SQL 语句。一个简单的前端会显示此查询的结果：

```SQL
SELECT * FROM comments LIMIT 3;
```

D1 数据库使用 `comments` 表和以下数据初始化：

```SQL
INSERT INTO comments (author, content)
VALUES
    ('Kristian', 'Congrats!'),
    ('Serena', 'Great job!'),
    ('Max', 'Keep up the good work!')
;
```

> [!IMPORTANT]
> 使用 C3 创建此项目时，当它询问是否要部署时，请选择"否"。在部署之前，您需要遵循本项目的[设置步骤](https://github.com/cloudflare/templates/tree/main/d1-template#setup-steps)。

<!-- dash-content-end -->

## 项目结构

```
d1-template/
├── migrations/                    # 数据库迁移文件目录
│   └── 0001_create_comments_table.sql  # 创建 comments 表的迁移脚本
├── src/                          # 源代码目录
│   ├── index.ts                  # Worker 入口文件，处理请求并查询 D1 数据库
│   └── renderHtml.ts             # HTML 渲染函数，用于生成前端页面
├── package.json                  # 项目依赖和脚本配置
├── tsconfig.json                 # TypeScript 编译配置
├── wrangler.json                 # Cloudflare Workers 配置文件，包含 D1 数据库绑定
├── worker-configuration.d.ts     # Worker 类型定义文件
└── README.md                     # 项目说明文档
```

### 主要文件说明

- **`src/index.ts`**: Worker 的主入口文件，定义了请求处理逻辑，通过 D1 绑定执行 SQL 查询并返回结果
- **`src/renderHtml.ts`**: 负责将查询结果渲染为 HTML 页面的工具函数
- **`migrations/0001_create_comments_table.sql`**: 数据库迁移脚本，创建 `comments` 表并插入示例数据
- **`wrangler.json`**: Cloudflare Workers 的配置文件，定义了 D1 数据库绑定（`DB`）和相关设置

## 快速开始

在此仓库之外，您可以使用 [C3](https://developers.cloudflare.com/pages/get-started/c3/)（`create-cloudflare` CLI）通过此模板启动新项目：

```
npm create cloudflare@latest -- --template=cloudflare/templates/d1-template
```

此模板的实时公共部署可在 [https://d1-template.templates.workers.dev](https://d1-template.templates.workers.dev) 查看

## 设置步骤

1. 使用您选择的包管理器安装项目依赖：
   ```bash
   npm install
   ```
2. 创建一个名为 "d1-template-database" 的 [D1 数据库](https://developers.cloudflare.com/d1/get-started/)：
   ```bash
   npx wrangler d1 create d1-template-database
   ```
   ...并在 `wrangler.json` 中使用新的数据库 ID 更新 `database_id` 字段。
3. 运行以下数据库迁移以初始化数据库（注意本项目中的 `migrations` 目录）：
   ```bash
   npx wrangler d1 migrations apply --remote d1-template-database
   ```
4. 部署项目！
   ```bash
   npx wrangler deploy
   ```

## 本地开发

### 启动开发服务器

使用以下命令启动本地开发环境：

```bash
npm run dev
```

此命令会：
1. 自动初始化本地 D1 数据库（应用迁移脚本）
2. 启动本地开发服务器（默认地址：`http://localhost:8787`）

### 开发模式说明

- **本地模式**（默认）：使用本地 SQLite 数据库，数据存储在 `.wrangler/state/` 目录
- **远程模式**：使用 `npx wrangler dev --remote` 连接到远程 Cloudflare D1 数据库

### 常用开发命令

```bash
# 启动本地开发服务器（使用本地 D1）
npm run dev

# 启动开发服务器（使用远程 D1）
npx wrangler dev --remote

# 手动初始化本地数据库
npm run seedLocalD1

# 查看实时日志
npx wrangler tail
```

> **注意**：如果 `wrangler` 未全局安装，请使用 `npx wrangler` 来运行命令，或通过 `npm run` 执行 package.json 中定义的脚本。

### 热重载

修改代码后，Wrangler 会自动重新加载，无需手动重启服务器。


===========測式api===========
curl -H "lang: en" http://127.0.0.1:8787/api/index/news?page=1

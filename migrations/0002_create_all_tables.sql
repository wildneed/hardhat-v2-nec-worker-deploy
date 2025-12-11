-- Migration number: 0002 	 2025-12-10T00:00:00.000Z
-- 清理旧表并创建所有业务表结构

-- ==================== 删除所有现有表 ====================
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS ot_auto;
DROP TABLE IF EXISTS ot_user_tj;
DROP TABLE IF EXISTS ot_kyc_ip;
DROP TABLE IF EXISTS ot_user_kyc;
DROP TABLE IF EXISTS ot_info;
DROP TABLE IF EXISTS ot_news;
DROP TABLE IF EXISTS ot_news_lang;
DROP TABLE IF EXISTS ot_news_type;
DROP TABLE IF EXISTS ot_system;

-- ==================== 创建业务表 ====================

-- 1. 系统配置表
CREATE TABLE IF NOT EXISTS ot_system (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kyc_zt INTEGER NOT NULL DEFAULT 0,
    kyc_face_zt INTEGER NOT NULL DEFAULT 1,
    kyc_user_tcs INTEGER NOT NULL DEFAULT 3,
    kyc_ip_cs INTEGER NOT NULL DEFAULT 20,
    kyc_ip_zt INTEGER NOT NULL DEFAULT 0,
    kyc_nl_zt INTEGER NOT NULL DEFAULT 1,
    kyc_nl_ks INTEGER NOT NULL DEFAULT 16,
    kyc_nl_js INTEGER NOT NULL DEFAULT 70,
    kyc_kxd REAL NOT NULL DEFAULT 98.00,
    kyc_xsd REAL NOT NULL DEFAULT 95.00,
    kyc_sb_img INTEGER NOT NULL DEFAULT 1
);

-- 2. 新闻类型表
CREATE TABLE IF NOT EXISTS ot_news_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT
);

-- 3. 新闻语言表
CREATE TABLE IF NOT EXISTS ot_news_lang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT
);

-- 4. 新闻表
CREATE TABLE IF NOT EXISTS ot_news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    date TEXT,
    tj_zt INTEGER NOT NULL DEFAULT 0,
    type INTEGER NOT NULL DEFAULT 0,
    lang TEXT
);

-- 5. 信息表
CREATE TABLE IF NOT EXISTS ot_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type INTEGER NOT NULL DEFAULT 0,
    title TEXT,
    content TEXT,
    date TEXT,
    zt INTEGER NOT NULL DEFAULT 0
);

-- 6. 用户KYC表
CREATE TABLE IF NOT EXISTS ot_user_kyc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL UNIQUE,
    ip_name TEXT,
    kyc_cs INTEGER DEFAULT 0,
    kyc_ip TEXT,
    kyc_id TEXT,
    hash TEXT
);

-- 7. KYC IP记录表
CREATE TABLE IF NOT EXISTS ot_kyc_ip (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT UNIQUE,
    kyc_cs INTEGER NOT NULL DEFAULT 0
);

-- 8. 用户统计表
CREATE TABLE IF NOT EXISTS ot_user_tj (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    jb16 INTEGER NOT NULL DEFAULT 0,
    jb17 INTEGER NOT NULL DEFAULT 0,
    jb18 INTEGER NOT NULL DEFAULT 0,
    jb19 INTEGER NOT NULL DEFAULT 0,
    jb20 INTEGER NOT NULL DEFAULT 0
);

-- 9. 自动任务表
CREATE TABLE IF NOT EXISTS ot_auto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    name TEXT,
    note TEXT,
    zt INTEGER DEFAULT 0
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_news_title ON ot_news(title);
CREATE INDEX IF NOT EXISTS idx_news_tj_zt ON ot_news(tj_zt);
CREATE INDEX IF NOT EXISTS idx_news_type ON ot_news(type);
CREATE INDEX IF NOT EXISTS idx_info_type ON ot_info(type);
CREATE INDEX IF NOT EXISTS idx_user_kyc_name ON ot_user_kyc(user_name);
CREATE INDEX IF NOT EXISTS idx_user_kyc_ip_name ON ot_user_kyc(ip_name);
CREATE INDEX IF NOT EXISTS idx_user_tj_date ON ot_user_tj(date);


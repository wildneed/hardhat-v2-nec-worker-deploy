/**
 * Cloudflare Worker 主入口
 * 实现API路由和请求分发
 */

import { getLang } from './i18n';
import { handleCors } from './response';
import {
  handleIndex,
  handleKefu,
  handleNewsTuijian,
  handleNews,
  handleFavePage
} from './handlers';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return handleCors();
    }

    // 获取语言
    const lang = getLang(request);

    // 解析URL路径
    const url = new URL(request.url);
    const path = url.pathname;

    // 路由分发
    try {
      // /api/index/index - 首页信息
      if (path === '/api/index/index') {
        return await handleIndex(request, env, lang);
      }

      // /api/index/kefu - 客服信息
      if (path === '/api/index/kefu') {
        return await handleKefu(request, env, lang);
      }

      // /api/index/news_tuijian - 推荐新闻
      if (path === '/api/index/news_tuijian') {
        return await handleNewsTuijian(request, env, lang);
      }

      // /api/index/news - 新闻列表
      if (path === '/api/index/news') {
        return await handleNews(request, env, lang);
      }

      // /api/index/fave_page - 认证页面
      if (path === '/api/index/fave_page') {
        return await handleFavePage(request, env, lang);
      }

      // 404 - 路由不存在
      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;

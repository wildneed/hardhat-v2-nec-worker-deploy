/**
 * API处理器模块
 */

import { success, error } from './response';
import { tr } from './i18n';
import { validatePositiveInt, validate } from './validators';
import { formatDate, parseQueryParams } from './utils';

/**
 * 1. 首页信息和弹窗公告
 * GET /api/index/index
 */
export async function handleIndex(request: Request, env: Env, lang: string): Promise<Response> {
  if (request.method !== 'GET') {
    return error(tr(lang, 'common.數據格式錯誤'));
  }

  try {
    // 查询首页文本 (type=3, title='index_text')
    const newsStmt = env.DB.prepare(
      'SELECT * FROM ot_news WHERE type = ? AND title = ? AND lang = ? LIMIT 1'
    ).bind(3, 'index_text', lang);
    const newsResult = await newsStmt.first();

    // 查询推荐公告 (type=1, tj_zt=1)
    const dataggStmt = env.DB.prepare(
      'SELECT * FROM ot_news WHERE type = ? AND tj_zt = ? AND lang = ? ORDER BY id DESC LIMIT 1'
    ).bind(1, 1, lang);
    const dataggResult = await dataggStmt.first();

    // 格式化日期
    if (dataggResult && dataggResult.date) {
      dataggResult.date = formatDate(dataggResult.date as string);
    }

    return success('ok', {
      news_xx: newsResult || {},
      datagg: dataggResult || {}
    });
  } catch (e) {
    console.error('Index API error:', e);
    return error(tr(lang, 'common.服務器異常'));
  }
}

/**
 * 2. 客服信息
 * GET /api/index/kefu - 获取客服文本和电报信息
 * POST /api/index/kefu - 获取帮助文档列表
 */
export async function handleKefu(request: Request, env: Env, lang: string): Promise<Response> {
  try {
    if (request.method === 'GET') {
      // 查询客服文本
      const kefuTextStmt = env.DB.prepare(
        'SELECT * FROM ot_news WHERE type = ? AND title = ? AND lang = ? LIMIT 1'
      ).bind(3, 'kefu_text', lang);
      const kefuText = await kefuTextStmt.first();

      // 查询当前语言的电报信息
      const telStmt = env.DB.prepare(
        'SELECT * FROM ot_news WHERE type = ? AND title = ? AND lang = ? LIMIT 1'
      ).bind(3, 'tel', lang);
      const telResult = await telStmt.first();

      const telImgStmt = env.DB.prepare(
        'SELECT * FROM ot_news WHERE type = ? AND title = ? AND lang = ? LIMIT 1'
      ).bind(3, 'tel-img', lang);
      const telImgResult = await telImgStmt.first();

      // 查询英文电报信息(备用)
      const telEnStmt = env.DB.prepare(
        'SELECT * FROM ot_news WHERE type = ? AND title = ? AND lang = ? LIMIT 1'
      ).bind(3, 'tel', 'en');
      const telEnResult = await telEnStmt.first();

      const telImgEnStmt = env.DB.prepare(
        'SELECT * FROM ot_news WHERE type = ? AND title = ? AND lang = ? LIMIT 1'
      ).bind(3, 'tel-img', 'en');
      const telImgEnResult = await telImgEnStmt.first();

      return success('ok', {
        news_xx: kefuText || {},
        cs: {
          tel_url: telResult?.content || '',
          tel_img: telImgResult?.content || '',
          tel_url_en: telEnResult?.content || '',
          tel_img_en: telImgEnResult?.content || ''
        }
      });
    }

    if (request.method === 'POST') {
      // 查询帮助文档列表 (type=2)
      const stmt = env.DB.prepare(
        'SELECT * FROM ot_news WHERE type = ? AND lang = ? ORDER BY id DESC'
      ).bind(2, lang);
      const { results } = await stmt.all();

      // 格式化日期
      const list = results.map(item => ({
        ...item,
        date: formatDate(item.date as string)
      }));

      return success('ok', { list });
    }

    return error(tr(lang, 'common.數據格式錯誤'));
  } catch (e) {
    console.error('Kefu API error:', e);
    return error(tr(lang, 'common.服務器異常'));
  }
}

/**
 * 3. 推荐新闻
 * GET /api/index/news_tuijian
 */
export async function handleNewsTuijian(request: Request, env: Env, lang: string): Promise<Response> {
  if (request.method !== 'GET') {
    return error(tr(lang, 'common.數據格式錯誤'));
  }

  try {
    const stmt = env.DB.prepare(
      'SELECT * FROM ot_news WHERE type = ? AND tj_zt = ? AND lang = ? ORDER BY id DESC LIMIT 1'
    ).bind(1, 1, lang);
    const result = await stmt.first();

    if (!result) {
      return success('null');
    }

    return success('ok', { datagg: result });
  } catch (e) {
    console.error('NewsTuijian API error:', e);
    return error(tr(lang, 'common.服務器異常'));
  }
}

/**
 * 4. 新闻列表(分页)
 * GET /api/index/news?page=1
 */
export async function handleNews(request: Request, env: Env, lang: string): Promise<Response> {
  if (request.method !== 'GET') {
    return error(tr(lang, 'common.數據格式錯誤'), { list: [], count: 0 });
  }

  try {
    const url = new URL(request.url);
    const params = parseQueryParams(url);

    // 验证page参数
    const validationError = validate([
      validatePositiveInt(params.page, 'page', lang)
    ]);
    if (validationError) {
      return error(validationError, { list: [], count: 0 });
    }

    const page = parseInt(params.page);
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    // 查询总数
    const countStmt = env.DB.prepare(
      'SELECT COUNT(*) as count FROM ot_news WHERE type = ? AND lang = ?'
    ).bind(1, lang);
    const countResult = await countStmt.first<{ count: number }>();
    const count = countResult?.count || 0;

    // 查询列表
    const listStmt = env.DB.prepare(
      'SELECT * FROM ot_news WHERE type = ? AND lang = ? ORDER BY id DESC LIMIT ? OFFSET ?'
    ).bind(1, lang, pageSize, offset);
    const { results } = await listStmt.all();

    // 格式化日期
    const list = results.map(item => ({
      ...item,
      date: formatDate(item.date as string)
    }));

    return success('ok', { list, count });
  } catch (e) {
    console.error('News API error:', e);
    return error(tr(lang, 'common.服務器異常'), { list: [], count: 0 });
  }
}

/**
 * 5. 认证页面信息
 * GET /api/index/fave_page
 */
export async function handleFavePage(request: Request, env: Env, lang: string): Promise<Response> {
  if (request.method !== 'GET') {
    return error(tr(lang, 'common.數據格式錯誤'));
  }

  try {
    const stmt = env.DB.prepare(
      'SELECT * FROM ot_news WHERE type = ? AND title = ? AND lang = ? LIMIT 1'
    ).bind(3, 'renzheng_text', lang);
    const result = await stmt.first();

    return success('ok', {
      news_xx: result || {}
    });
  } catch (e) {
    console.error('FavePage API error:', e);
    return error(tr(lang, 'common.服務器異常'));
  }
}

/**
 * 工具函数模块
 */

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}

/**
 * 解析JSON请求体
 */
export async function parseJsonBody<T>(request: Request): Promise<T | null> {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return null;
    }
    return await request.json<T>();
  } catch {
    return null;
  }
}

/**
 * 解析URL查询参数
 */
export function parseQueryParams(url: URL): Record<string, string> {
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * 获取客户端IP
 */
export function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') || 
         request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         request.headers.get('x-real-ip') ||
         '0.0.0.0';
}


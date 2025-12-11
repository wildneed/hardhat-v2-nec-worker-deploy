/**
 * 统一响应格式模块
 * 与Go版本response.go保持完全一致
 */

export interface ApiResponse<T = any> {
  errorcode: number;    // 0=成功, 5000=错误
  message: string;
  data?: T;
}

export function success<T>(message: string = 'ok', data?: T, errorcode: number = 0): Response {
  const response: ApiResponse<T> = {
    errorcode,
    message,
    data
  };
  
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, lang'
    }
  });
}

export function error(message: string, data?: any, errorcode: number = 5000): Response {
  const response: ApiResponse = {
    errorcode,
    message,
    data
  };
  
  return new Response(JSON.stringify(response), {
    status: 200, // 保持HTTP 200，用业务errorcode区分错误
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, lang'
    }
  });
}

export function handleCors(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, lang',
      'Access-Control-Max-Age': '86400'
    }
  });
}


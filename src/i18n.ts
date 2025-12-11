/**
 * 多语言支持模块
 */

export const translations: Record<string, Record<string, string>> = {
  zh: {
    'common.數據格式錯誤': '数据格式错误',
    'common.服務器異常': '服务器异常',
    'common.功能未開放': '功能未开放',
    'common.重復操作': '操作过于频繁,请稍后再试',
    'index.用戶不存在': '用户不存在',
    'index.用戶已認證': '用户已认证',
    'index.認證次數已達到上限': '认证次数已达到上限',
    'index.該IP認證次數已達到上限': '该IP认证次数已达到上限',
    'index.操作成功': '操作成功',
    'index.驗證失敗': '验证失败',
    'index.年齡驗證失敗': '年龄验证失败',
    'index.信息驗證失敗': '信息验证失败',
    'index.face1': '可信度不足,请重新认证',
    'index.face2': '人脸已存在,请勿重复认证',
    // 验证错误信息
    'validator.必须是正整数': '必须是正整数',
    'validator.请填写': '请填写'
  },
  en: {
    'common.數據格式錯誤': 'Data format error',
    'common.服務器異常': 'Server error',
    'common.功能未開放': 'Function not available',
    'common.重復操作': 'Operation too frequent, please try again later',
    'index.用戶不存在': 'User does not exist',
    'index.用戶已認證': 'User already verified',
    'index.認證次數已達到上限': 'Authentication limit reached',
    'index.該IP認證次數已達到上限': 'IP authentication limit reached',
    'index.操作成功': 'Operation successful',
    'index.驗證失敗': 'Verification failed',
    'index.年齡驗證失敗': 'Age verification failed',
    'index.信息驗證失敗': 'Information verification failed',
    'index.face1': 'Insufficient confidence, please re-authenticate',
    'index.face2': 'Face already exists, please do not repeat authentication',
    // Validation error messages
    'validator.必须是正整数': ' must be a positive integer',
    'validator.请填写': 'Please enter '
  }
};

// 默认使用中文翻译作为其他语言的备用
export function initTranslations() {
  const langs = ['ja', 'ko', 'th', 'vi', 'ru', 'fr'];
  langs.forEach(lang => {
    if (!translations[lang]) {
      translations[lang] = { ...translations.zh };
    }
  });
}

initTranslations();

export function tr(lang: string, key: string): string {
  const langTranslations = translations[lang] || translations['en'];
  return langTranslations[key] || key;
}

export function getLang(request: Request): string {
  const lang = request.headers.get('lang') || 'en';
  const supportedLangs = ['zh', 'en', 'ja', 'ko', 'th', 'vi', 'ru', 'fr'];
  return supportedLangs.includes(lang) ? lang : 'en';
}


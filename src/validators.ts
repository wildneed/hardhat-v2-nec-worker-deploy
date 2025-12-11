/**
 * 输入验证模块
 * 支持多语言错误提示
 */

import { tr } from './i18n';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * 验证正整数
 */
export function validatePositiveInt(value: any, fieldName: string, lang: string): ValidationError | null {
  const num = Number(value);
  if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
    return { field: fieldName, message: `${fieldName}${tr(lang, 'validator.必须是正整数')}` };
  }
  return null;
}

/**
 * 验证必填字段
 */
export function validateRequired(value: any, fieldName: string, lang: string): ValidationError | null {
  if (value === undefined || value === null || value === '') {
    return { field: fieldName, message: `${tr(lang, 'validator.请填写')}${fieldName}` };
  }
  return null;
}

/**
 * 批量验证
 */
export function validate(validations: (ValidationError | null)[]): string | null {
  for (const error of validations) {
    if (error) {
      return error.message;
    }
  }
  return null;
}


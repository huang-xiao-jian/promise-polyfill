/**
 * @description - @coco-platform/init-cli generated
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const Mappings = {
  zglt: '中国联通',
  zgyd: '中国移动',
};

/**
 * @description - translate mobile operator symbol into chinese name
 *
 * @param {string} symbol
 */
export function translateOperatorSymbol(symbol: string): string {
  return Reflect.get(Mappings, symbol);
}

/**
 * @description - just test tsc compile result
 *
 * @param {string} keyword
 *
 * @return {string}
 */
export const arrow = (keyword: string): string => {
  return `Let's search ${keyword}!!!`;
};

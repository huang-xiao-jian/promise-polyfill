/**
 * @description - coco library test suits
 */

import { arrow, translateOperatorSymbol } from '../src';

describe('web package', () => {
  it('should translate simple symbol', () => {
    expect(translateOperatorSymbol('zgyd')).toEqual('中国移动');
  });

  it('should test compile result', () => {
    expect(arrow('love')).toEqual(`Let's search love!!!`);
  });
});

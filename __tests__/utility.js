const { convertAdditionToDouble, returnNumber } = require('../src/utils');

describe('convertAdditionToDouble utility', () => {
  test('converts two additions to double data type', () => {
    const firstNumber = "1,222.9800038373";
    const secondNumber = 5000;
    expect(convertAdditionToDouble(firstNumber,secondNumber)).toEqual(6222.98);
  });
  test('must be a number', () => {
    const firstNumber = "1,222.9800038373";
    const secondNumber = 5000;
    expect(convertAdditionToDouble(firstNumber,secondNumber)).not.toBeNaN();
    
  });
});

describe('returnNumber utility', () => {
    test('returns a number when a number string or a number is passed to it', () => {
      const firstNumber = "1,222.9800038373";
      const secondNumber = 5000;
      expect(returnNumber(firstNumber)).toEqual(1222.9800038373);
      expect(returnNumber(secondNumber)).toEqual(5000);
    });
});


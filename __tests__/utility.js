const { getAllDriversData, convertAdditionToDouble, returnNumber } = require('../src/utils');
const { getTrips } = require('../src/node_modules/api');

const analysis = require('../src/analysis');
const driverReport = require('../src/report');
const report = require('../fixtures/report.json');

describe('convertAdditionToDouble utility', () => {
  test('converts two additions to double data type', () => {
    const firstNumber = "1,222.9800038373";
    const secondNumber = 5000;
    expect(convertAdditionToDouble(firstNumber,5000)).toEqual(6222.98);
  });
  test('must be a number', () => {
    const firstNumber = "1,222.9800038373";
    const secondNumber = 5000;
    expect(convertAdditionToDouble(firstNumber,5000)).not.toBeNaN();
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


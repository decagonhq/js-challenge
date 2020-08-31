const helper = require('../src/helper');

describe('helper spec', () => {
  test('calculate the Total', () => {
    const value = [
      { billedAmount: '100,0' },
    ];
    return expect(helper.calculateTotalFunction(value)).toEqual(1000);
  });

  test('get Total Drivers', async () => {
    return expect(helper.getTotalDrivers()).toEqual({});
  });

});

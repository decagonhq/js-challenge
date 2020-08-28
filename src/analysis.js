const { getTrips, getDriver } = require('api');

/**
 * This function should return the trip data analysis
 *
 * Question 1
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here

  const result = {
    noOfCashTrips: 0,
    noOfNonCashTrips: 0,
    billedTotal: 0,
    cashBilledTotal: 0,
    nonCashBilledTotal: 0,
    noOfDriversWithMoreThanOneVehicle: 0,
    mostTripsByDriver: {
      name: '',
      email: '',
      phone: '',
      noOfTrips: 0,
      totalAmountEarned: 0,
    },
    highestEarningDriver: {
      name: '',
      email: '',
      phone: '',
      noOfTrips: 0,
      totalAmountEarned: 0,
    },
  };
  const drivers = {};
  const vehicles = [];
  try {
    const trips = await getTrips();

    await trips.reduce(async (acc, curr) => {
      const _acc = await acc;
      const { driverID, isCash, billedAmount } = curr;
      const _nBilledAmount =
        typeof billedAmount == 'string'
          ? Number.parseFloat(billedAmount.replace(/,/g, ''))
          : billedAmount;
      _acc.billedTotal += _nBilledAmount;
      if (isCash) {
        _acc.noOfCashTrips++;
        _acc.cashBilledTotal += _nBilledAmount;
      } else {
        _acc.noOfNonCashTrips++;
        _acc.nonCashBilledTotal += _nBilledAmount;
      }
      try {
        const driver = await getDriver(driverID);
        if (driverID in drivers) {
          drivers[driverID].noOfTrips++;
          if (driver) {
            if (vehicles.includes(driver.vehicleID)) {
              _acc.noOfDriversWithMoreThanOneVehicle++;
            } else {
              vehicles.push(driver.vehicleID);
            }
          }
          drivers[driverID].totalAmountEarned += _nBilledAmount;

          if (_acc.mostTripsByDriver.noOfTrips < drivers[driverID].noOfTrips) {
            _acc.mostTripsByDriver = drivers[driverID];
          }
        } else {
          if (driver) {
            drivers[driverID] = {
              email: driver.email,
              name: driver.name,
              phone: driver.phone,
              noOfTrips: 1,
              totalAmountEarned: _nBilledAmount,
            };
          }
        }
      } catch (error) {
        console.log(error);
      }

      if (drivers[driverID]) {
        if (
          _acc.highestEarningDriver.totalAmountEarned <
          drivers[driverID].totalAmountEarned
        ) {
          _acc.highestEarningDriver = drivers[driverID];
        }
      }
      return _acc;
    }, Promise.resolve(result));
    result.billedTotal = Number(result.billedTotal.toFixed(2));
    result.nonCashBilledTotal = Number(result.nonCashBilledTotal.toFixed(2));
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = analysis;

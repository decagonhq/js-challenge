const { getTrips } = require('api');
const { getAllDrivers } = require('./utils');

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
  try {
    const trips = await getTrips();

    const allDrivers = await getAllDrivers(trips);

    trips.reduce((acc, curr) => {
      const { driverID, isCash, billedAmount } = curr;

      // parse the billedAmount
      const _nBilledAmount =
        typeof billedAmount == 'string'
          ? Number.parseFloat(billedAmount.replace(/,/g, ''))
          : billedAmount;
      acc.billedTotal += _nBilledAmount;
      if (isCash) {
        acc.noOfCashTrips++;
        acc.cashBilledTotal += _nBilledAmount;
      } else {
        acc.noOfNonCashTrips++;
        acc.nonCashBilledTotal += _nBilledAmount;
      }
      try {
        const driver = allDrivers.find((d) => d.id === driverID);
        if (driverID in drivers) {
          drivers[driverID].noOfTrips++;
          drivers[driverID].totalAmountEarned += _nBilledAmount;

          if (acc.mostTripsByDriver.noOfTrips <= drivers[driverID].noOfTrips) {
            acc.mostTripsByDriver = drivers[driverID];
          }
        } else if (driver) {
          if (driver.vehicleID.length > 1) {
            acc.noOfDriversWithMoreThanOneVehicle++;
          }
          drivers[driverID] = {
            name: driver.name,
            email: driver.email,
            phone: driver.phone,
            noOfTrips: 1,
            totalAmountEarned: _nBilledAmount,
          };
        }
        if (driver) {
          if (
            acc.highestEarningDriver.totalAmountEarned <
            drivers[driverID].totalAmountEarned
          ) {
            acc.highestEarningDriver = drivers[driverID];
          }
        }
      } catch (error) {}

      return acc;
    }, result);
    result.billedTotal = Number(result.billedTotal.toFixed(2));
    result.nonCashBilledTotal = Number(result.nonCashBilledTotal.toFixed(2));

    return result;
  } catch (error) {}
}

module.exports = analysis;

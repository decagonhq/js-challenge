const { getTrips, getDriver, getVehicle } = require('api');

/**
 * fetches all driver for the trips
 */
async function getAllDrivers(trips) {
  const _drivers = [];
  const _driverGetters = [];
  trips.forEach((trip) => {
    if (!_drivers.includes(trip.driverID)) {
      _driverGetters.push(getDriver(trip.driverID));
      _drivers.push(trip.driverID);
    }
  });

  try {
    let drivers = await Promise.all(
      _driverGetters.map((p) => p.catch((e) => e)),
    );
    drivers = drivers
      .filter((d) => !(d instanceof Error))
      .map((driver, i) => {
        driver['id'] = _drivers[i];
        return driver;
      });

    return drivers;
  } catch (error) {
    console.log(error.data);
    return [];
  }
}

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

    console.log(allDrivers);

    trips.reduce((_acc, curr) => {
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
        const driver = allDrivers.find((d) => d.id === driverID);
        if (driverID in drivers) {
          drivers[driverID].noOfTrips++;
          drivers[driverID].totalAmountEarned += _nBilledAmount;

          if (_acc.mostTripsByDriver.noOfTrips <= drivers[driverID].noOfTrips) {
            _acc.mostTripsByDriver = drivers[driverID];
          }
        } else if (driver) {
          if (driver.vehicleID.length > 1) {
            _acc.noOfDriversWithMoreThanOneVehicle++;
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
            _acc.highestEarningDriver.totalAmountEarned <
            drivers[driverID].totalAmountEarned
          ) {
            _acc.highestEarningDriver = drivers[driverID];
          }
        }
      } catch (error) {}

      return _acc;
    }, result);
    result.billedTotal = Number(result.billedTotal.toFixed(2));
    result.nonCashBilledTotal = Number(result.nonCashBilledTotal.toFixed(2));

    console.log(result);
    return result;
  } catch (error) {}
}

module.exports = analysis;

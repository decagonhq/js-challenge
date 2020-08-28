const { getTrips, getDriver, getVehicle } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 2
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  const trips = await getTrips();
  const _drivers = {};
  const drivers = [];

  trips.forEach(async (trip, index) => {
    try {
      const driver = await getDriver(trip.driverID);
      if (driver) {
        if (trip.driverID in _drivers) {
          _drivers[trip.driverID].noOfTrips++;
        } else {
          _drivers[trip.driverID] = driver;
          drivers.push(driver);
        }
      }
    } catch (error) {}
  });
}

module.exports = driverReport;

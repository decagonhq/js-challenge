const { getTrips, getDriver } = require('api');
const helper = require('./helper');

/**
 * This function should return the trip data analysis
 *
 * Question 1
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  const getAllTrips = await getTrips();

  const noOfCashTrips = helper.cashData(true, getAllTrips);
  const noOfNonCashTrips = helper.cashData(false, getAllTrips);
  const billedTotal = helper.calculateTotalFunction(getAllTrips);
  const cashBilledTotal = helper.calculateTotalFunction(noOfCashTrips);
  const nonCashBilledTotal = helper.calculateTotalFunction(noOfNonCashTrips);

  const [driverId, { name, email, phone }] = await helper.highestTripDriver(
    getAllTrips,
    getDriver,
  );
  const driverTotals = getAllTrips.filter((trip) => trip.driverID === driverId);
  const highestEarningDriver = await helper.earningDriver(
    getAllTrips,
    getDriver,
  );

  const newObject = {
    noOfCashTrips: noOfCashTrips.length,
    noOfNonCashTrips: noOfNonCashTrips.length,
    billedTotal,
    cashBilledTotal,
    nonCashBilledTotal,
    noOfDriversWithMoreThanOneVehicle: await helper.getTotalDrivers(
      getAllTrips,
      getDriver,
    ),
    mostTripsByDriver: {
      name,
      email,
      phone,
      noOfTrips: driverTotals.length,
      totalAmountEarned: helper.calculateTotalFunction(driverTotals),
    },
    highestEarningDriver: {
      name: highestEarningDriver.name,
      email: highestEarningDriver.email,
      phone: highestEarningDriver.phone,
      noOfTrips: highestEarningDriver.noOfTrips,
      totalAmountEarned: highestEarningDriver.billedAmount,
    },
  };
  return newObject;
}

module.exports = analysis;

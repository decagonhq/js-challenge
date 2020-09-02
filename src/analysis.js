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
  const [sorTripsByDriver, getAllDrivers] = await helper.getReport();
  const trips = await getTrips();
  const cashData = (value) => trips.filter((trips) => trips.isCash === value);

  const tripsByDriver = trips
    .slice()
    .sort((a, b) => (a.driverID > b.driverID ? 1 : -1))
    .pop();
  const mostTripsByDriver = await getDriver(tripsByDriver.driverID);

  const highestEarning = Object.values(sorTripsByDriver)
    .map((earning) => ({
      id: earning.map((bill) => bill.driverID)[0],
      billedAmount: helper.calculateTotalFunction(earning.map((bill) => bill)),
    }))
    .sort((a, b) => b.billedAmount - a.billedAmount)[0];
  const highestEarningDriver = await getDriver(highestEarning.id);

  const newObject = {
    noOfCashTrips: cashData(true).length,
    noOfNonCashTrips: cashData(false).length,
    billedTotal: helper.calculateTotalFunction(trips),
    cashBilledTotal: helper.calculateTotalFunction(cashData(true)),
    nonCashBilledTotal: helper.calculateTotalFunction(cashData(false)),
    noOfDriversWithMoreThanOneVehicle: getAllDrivers.filter(
      (getAllDriver) => getAllDriver.vehicleID.length > 1,
    ).length,
    mostTripsByDriver: {
      name: mostTripsByDriver.name,
      email: mostTripsByDriver.email,
      phone: mostTripsByDriver.phone,
      noOfTrips: sorTripsByDriver[tripsByDriver.driverID].length,
      totalAmountEarned: helper.calculateTotalFunction(
        sorTripsByDriver[tripsByDriver.driverID],
      ),
    },
    highestEarningDriver: {
      name: highestEarningDriver.name,
      email: highestEarningDriver.email,
      phone: highestEarningDriver.phone,
      noOfTrips: sorTripsByDriver[highestEarning.id].length,
      totalAmountEarned: highestEarning.billedAmount,
    },
  };


  return newObject;
}

module.exports = analysis;

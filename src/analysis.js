const { convertAdditionToDouble } = require('./utils');
const driverReport = require('./report');

/**
 * This function should return the trip data analysis
 *
 * Question 1
 * @returns {any} Trip data analysis
 */
async function analysis() {
  const analysisData = {
    noOfCashTrips: 0,
    noOfNonCashTrips: 0,
    billedTotal: 0,
    cashBilledTotal: 0,
    nonCashBilledTotal: 0,
    noOfDriversWithMoreThanOneVehicle: 0,
    mostTripsByDriver: {},
    highestEarningDriver: {}
  };

  let driversWithMoreThanOneVehicle = 0;
  const drivers = await driverReport();
  let mostTripId = "";
  let currentMosttrip = 0;
  let highestEarnedId = "";
  let currentHighestEarned = 0;

  for (let driver of drivers) {
    let totalAmountEarned =  driver.totalAmountEarned;
    let totalCashAmountEarned =  driver.totalCashAmount;
    let totalNonCashAmountEarned =  driver.totalNonCashAmount;

    analysisData.billedTotal = convertAdditionToDouble(analysisData.billedTotal, totalAmountEarned);
    analysisData.cashBilledTotal = convertAdditionToDouble(analysisData.cashBilledTotal, totalCashAmountEarned);
    analysisData.nonCashBilledTotal = convertAdditionToDouble(analysisData.nonCashBilledTotal, totalNonCashAmountEarned);

    analysisData.noOfCashTrips = analysisData.noOfCashTrips + driver.noOfCashTrips;
    analysisData.noOfNonCashTrips = analysisData.noOfNonCashTrips + driver.noOfNonCashTrips;

    if(driver.vehicleID.length > 1) {
      driversWithMoreThanOneVehicle++;
    }

    if(driver.noOfTrips > currentMosttrip) {
      currentMosttrip = driver.noOfTrips;
      mostTripId = driver.id;
    }

    if(driver.totalAmountEarned > currentHighestEarned) {
      currentHighestEarned = driver.totalAmountEarned;
      highestEarnedId = driver.id;
    }

  }

  analysisData.noOfDriversWithMoreThanOneVehicle = driversWithMoreThanOneVehicle;
  
  let finalMostTripDriver = drivers.find(driver => driver.id === mostTripId);
  analysisData.mostTripsByDriver = {
    name: finalMostTripDriver.fullName,
    email: finalMostTripDriver.email,
    phone: finalMostTripDriver.phone,
    noOfTrips: finalMostTripDriver.noOfTrips,
    totalAmountEarned: finalMostTripDriver.totalAmountEarned
  }

  let finalHighestEarnedDriver = drivers.find(driver => driver.id === highestEarnedId);
  analysisData.highestEarningDriver = {
    name: finalHighestEarnedDriver.fullName,
    email: finalHighestEarnedDriver.email,
    phone: finalHighestEarnedDriver.phone,
    noOfTrips: finalHighestEarnedDriver.noOfTrips,
    totalAmountEarned: finalHighestEarnedDriver.totalAmountEarned
  }

  return analysisData;
}

module.exports = analysis;

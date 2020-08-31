const { getTrips, getDriver } = require('api');

/**
 * This function should return the trip data analysis
 *
 * Question 1
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  const allTrips = await getTrips()
  let noOfCashTrips = 0
  let noOfNonCashTrips = 0
  let billedTotal = 0
  let cashBilledTotal = 0
  let nonCashBilledTotal = 0
  let driverIDs = []
  let driverTripCount = {}
  let noOfDriversWithMoreThanOneVehicle = 0
  for (let trip of allTrips) {
    let amount;
    if (trip.isCash) {
      noOfCashTrips++
      if (typeof (trip.billedAmount) === 'string') {
        amount = parseFloat(trip.billedAmount.replace(',', ''))
      } else { amount = trip.billedAmount }
      cashBilledTotal += amount
    } else {
      noOfNonCashTrips++
      if (typeof (trip.billedAmount) === 'string') {
        amount = parseFloat(trip.billedAmount.replace(',', ''))
      } else { amount = trip.billedAmount }
      nonCashBilledTotal += amount
    }
    let billedAmount;
    if (typeof (trip.billedAmount) === 'string') {
      billedAmount = parseFloat(trip.billedAmount.replace(',', ''))
    } else { billedAmount = trip.billedAmount }
    billedTotal += billedAmount
    let driverCountID = trip.driverID
    if (driverTripCount[driverCountID]) {
      driverTripCount[driverCountID][0]++
      let amount;
      if (typeof (trip.billedAmount) === 'string') {
        amount = parseFloat(trip.billedAmount.replace(',', ''))
      } else { amount = trip.billedAmount }
      driverTripCount[driverCountID][1] += amount
    } else {
      let amount;
      if (typeof (trip.billedAmount) === 'string') {
        amount = parseFloat(trip.billedAmount.replace(',', ''))
      } else { amount = trip.billedAmount }
      driverTripCount[driverCountID] = [1, amount]
    }
    if (!driverIDs.includes(trip.driverID)) {
      driverIDs.push(trip.driverID)
      let driver;
      try {
        driver = await getDriver(trip.driverID)
      } catch (e) {
        continue
      }
      if (driver.vehicleID.length > 1) {
        noOfDriversWithMoreThanOneVehicle++
      }
    }
  }

  let maxTrip = 0
  let maxAmount = 0
  let maxTriptotalAmountEarned = 0
  let maxAmounttotalTrip = 0
  let maxTripdriverID;
  let maxAmountdriverID;
  for (let driver in driverTripCount) {
    if (driverTripCount[driver][0] > maxTrip) {
      maxTrip = driverTripCount[driver][0]
      maxTriptotalAmountEarned = driverTripCount[driver][1]
      maxTripdriverID = driver
    }
    if (driverTripCount[driver][1] > maxAmount) {
      maxAmount = driverTripCount[driver][1]
      maxAmounttotalTrip = driverTripCount[driver][0]
      maxAmountdriverID = driver
    }
  }
  const maxTripdriverInfo = await getDriver(maxTripdriverID)
  const maxAmountdriverInfo = await getDriver(maxAmountdriverID)

  const dataForAllTrips = {
    noOfCashTrips,
    noOfNonCashTrips,
    billedTotal: parseFloat(billedTotal.toFixed(2)),
    cashBilledTotal: parseFloat(cashBilledTotal.toFixed(2)),
    nonCashBilledTotal: parseFloat(nonCashBilledTotal.toFixed(2)),
    noOfDriversWithMoreThanOneVehicle,
    mostTripsByDriver: {
      "name": maxTripdriverInfo.name,
      "email": maxTripdriverInfo.email,
      "phone": maxTripdriverInfo.phone,
      "noOfTrips": maxTrip,
      "totalAmountEarned": maxTriptotalAmountEarned
    },
    "highestEarningDriver": {
      "name": maxAmountdriverInfo.name,
      "email": maxAmountdriverInfo.email,
      "phone": maxAmountdriverInfo.phone,
      "noOfTrips": maxAmounttotalTrip,
      "totalAmountEarned": maxAmount
    }
  }
  return dataForAllTrips
}

analysis()

module.exports = analysis;

jest.setTimeout(30000)
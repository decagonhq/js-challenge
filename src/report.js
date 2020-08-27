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
  const allTrips = await getTrips()
  let driverIDs = []
  let driverTripCount = {}
  let drivers = []

  for (let trip of allTrips) {
    if (!driverIDs.includes(trip.driverID)) {
      driverIDs.push(trip.driverID)
      let driver;
      try {
        driver = await getDriver(trip.driverID)
      } catch (e) {
        continue
      }

      let driverCountID = trip.driverID
      if (driverTripCount[driverCountID]) {
        driverTripCount[driverCountID][0]++
        let totalAmountEarned;
        if (typeof (trip.billedAmount) === 'string') {
          totalAmountEarned = parseFloat(trip.billedAmount.replace(',', ''))
        } else { totalAmountEarned = trip.billedAmount }
        driverTripCount[driverCountID][1] += totalAmountEarned
      } else {
        let totalAmountEarned;
        if (typeof (trip.billedAmount) === 'string') {
          totalAmountEarned = parseFloat(trip.billedAmount.replace(',', ''))
        } else { totalAmountEarned = trip.billedAmount }
        driverTripCount[driverCountID] = [1, totalAmountEarned]
      }

      let vehicleArray = []

      for (let vehicle of driver.vehicleID) {
        let vehicleInfo = await getVehicle(vehicle)
        let plate = vehicleInfo.plate
        let manufacturer = vehicleInfo.manufacturer
        vehicleArray.push({
          plate,
          manufacturer
        })
      }
      driverObject = {
        fullName: driver.name,
        id: trip.driverID,
        phone: driver.phone,
        vehicles: vehicleArray,
        noOfVehicles: driver.vehicleID.length
      }
      drivers.push(driverObject)
    }
  }

  for (let driver of drivers) {
    let noOfTrips = 0;
    let totalAmountEarned = 0;
    let noOfCashTrips = 0;
    let totalCashAmount = 0;
    let noOfNonCashTrips = 0;
    let totalNonCashAmount = 0;
    let trips = []
    for (let trip of allTrips) {
      if (driver.id === trip.driverID) {
        noOfTrips++
        let billedAmount;
        if (typeof (trip.billedAmount) === 'string') {
          billedAmount = parseFloat(trip.billedAmount.replace(',', ''))
        } else { billedAmount = trip.billedAmount }
        totalAmountEarned += billedAmount
        let user = trip.user.name
        let created = trip.created
        let pickup = trip.pickup.address
        let destination = trip.destination.address
        let billed = trip.billedAmount
        let isCash = trip.isCash
        trips.push({
          user,
          created,
          pickup,
          destination,
          billed,
          isCash
        })
        if (trip.isCash) {
          noOfCashTrips++
          let billedAmount;
          if (typeof (trip.billedAmount) === 'string') {
            billedAmount = parseFloat(trip.billedAmount.replace(',', ''))
          } else { billedAmount = trip.billedAmount }
          totalCashAmount += billedAmount
        } else {
          noOfNonCashTrips++
          let billedAmount;
          if (typeof (trip.billedAmount) === 'string') {
            billedAmount = parseFloat(trip.billedAmount.replace(',', ''))
          } else { billedAmount = trip.billedAmount }
          totalNonCashAmount += billedAmount
        }
      }
    }
    driver['noOfTrips'] = noOfTrips
    driver['totalAmountEarned'] = parseFloat(totalAmountEarned.toFixed(2))
    driver['noOfCashTrips'] = noOfCashTrips
    driver['totalCashAmount'] = parseFloat(totalCashAmount.toFixed(2))
    driver['noOfNonCashTrips'] = noOfNonCashTrips
    driver['totalNonCashAmount'] = parseFloat(totalNonCashAmount.toFixed(2))
    driver['trips'] = trips
  }
  
  return drivers
}

module.exports = driverReport;

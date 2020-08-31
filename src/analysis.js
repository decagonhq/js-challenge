const { getTrips } = require('api');
const { getDrivers } = require('./helpers');

/**
 * This function should return the trip data analysis
 *
 * Question 1
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here

  const analysisData = {
    noOfCashTrips: 0,
    noOfNonCashTrips: 0,
    billedTotal: 0,
    cashBilledTotal: 0,
    nonCashBilledTotal: 0,
    noOfDriversWithMoreThanOneVehicle: 0,
    mostTripsByDriver: {
      name: "",
      email: "",
      phone: "",
      noOfTrips: 0,
      totalAmountEarned: 0
    },
    highestEarningDriver: {
      name: "",
      email: "",
      phone: "",
      noOfTrips: 0,
      totalAmountEarned: 0
    }
  }

  const mostTripsByDriver = {
    name: "",
    email: "",
    phone: "",
    noOfTrips: 0,
    totalAmountEarned: 0
  },
  highestEarningDriver = {
    name: "",
    email: "",
    phone: "",
    noOfTrips: 0,
    totalAmountEarned: 0
  }

  const driverData = {}

  try {
    const allTrips = await getTrips();
    const allDrivers = await getDrivers(allTrips)

    allTrips.map(trip => {
      const { billedAmount, isCash, driverID } = trip;

      const billedAmountNum = typeof billedAmount == 'string' ? parseFloat(billedAmount.replace(',', '')) : billedAmount
      analysisData.billedTotal += billedAmountNum

      
      if (isCash) {
        analysisData.cashBilledTotal += billedAmountNum
        analysisData.noOfCashTrips ++;
        
      } else {
        analysisData.nonCashBilledTotal += billedAmountNum
        analysisData.noOfNonCashTrips ++;
      }

      try {
        
        const driver = allDrivers.find(dv => dv.id === driverID)

        if (driverID in driverData) {

          driverData[driverID]['noOfTrips'] ++;
          driverData[driverID]['totalAmountEarned'] += billedAmountNum
          
          if (analysisData.mostTripsByDriver.noOfTrips <= driverData[driverID].noOfTrips){
            analysisData.mostTripsByDriver = driverData[driverID]
          }

          if (analysisData.highestEarningDriver.totalAmountEarned <= driverData[driverID].totalAmountEarned){
            analysisData.highestEarningDriver = driverData[driverID]
          }

        } else if (driver) {

          if (driver.vehicleID.length > 1) {
            analysisData.noOfDriversWithMoreThanOneVehicle++;
          }
          driverData[driverID] = {
            name: driver.name,
            email: driver.email,
            phone: driver.phone,
            noOfTrips: 1,
            totalAmountEarned: billedAmountNum,
          }
        } 

      } catch(e){}
    })

  } catch(error) { console.log(error)}

  analysisData.billedTotal = Number(analysisData.billedTotal.toFixed(2))
  analysisData.nonCashBilledTotal = Number(analysisData.nonCashBilledTotal.toFixed(2))
  return analysisData;
}

module.exports = analysis;

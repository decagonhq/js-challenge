const { getTrips } = require('api');
const { getDrivers } = require('./helpers')

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
  try{
        const allDrivers  = await getDrivers(allTrips)

        allTrips.map(trip => {
            const { billedAmount, isCash, driverID } = trip;
            const billedAmountNum = typeof billedAmount == 'string' ? parseFloat(billedAmount.replace(',', '')) : billedAmount

            const driver = allDrivers.find(dv => dv.id === driverID)

            console.log(trip)
            vehicles =  Promise.all(allDrivers.vehicleID.map(vehicle => getVehicle(vehicle)))
            const tripPerDriver =   {
                id: driverID,
                fullName: trip.fullName,
                "phone": driver.phone,
                "noOfTrips": 0,
                "noOfVehicles": 2,
                "vehicles": vehicles,
                "noOfCashTrips": 5,
                "noOfNonCashTrips": 6,
                "totalAmountEarned": 1000,
                "totalCashAmount": 100,
                "totalNonCashAmount": 500,
                "trips": []
            }
        })
  
  } catch(e){}

}

module.exports = driverReport;

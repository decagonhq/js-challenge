const { getTrips } = require('api');
const helper = require('./helper');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 2
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  const [sorTripsByDriver, getAllDrivers] = await helper.getReport();

  const report = getAllDrivers.map((driver) => {
    const tripCashType = (value) =>
      sorTripsByDriver[driver.id].filter((trips) => trips.isCash === value);
    return {
      fullName: driver.name,
      id: driver.id,
      phone: driver.phone,
      noOfTrips: sorTripsByDriver[driver.id].length,
      noOfVehicles: driver.vehicleID ? driver.vehicleID.length : 0,
      vehicles: driver.vehicles,
      noOfCashTrips: tripCashType(true).length,
      noOfNonCashTrips: tripCashType(false).length,
      totalAmountEarned: helper.calculateTotalFunction(
        sorTripsByDriver[driver.id],
      ),
      totalCashAmount: helper.calculateTotalFunction(tripCashType(true)),
      totalNonCashAmount: helper.calculateTotalFunction(tripCashType(false)),
      trips: sorTripsByDriver[driver.id].map((trip) => ({
        user: trip.user.name,
        created: trip.created,
        pickup: trip.pickup.address,
        destination: trip.destination.address,
        billed: trip.billedAmount,
        isCash: trip.isCash,
        driverID: trip.driverID,
      })),
    };
  });


  return report;
}

module.exports = driverReport;

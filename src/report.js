const { getTrips, getDriver, getVehicle } = require('api');
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
  const getAllTrips = await getTrips();
  const driverData = async (id) => await getDriver(id);
  const vehicle = async (data) => {
    const value = await Promise.all(data.map(async (data) => getVehicle(data)));
    return value;
  };
  try {
    const test = Object.values(helper.mergeDrivers(getAllTrips)).map(
      (driver) => {
        const getTotalData = driver.map(async (details) => {
          const data = await driverData(details.driverID);
          const newData = {
            fullName: data.name,
            id: details.driverID,
            phone: data.phone,
            noOfTrips: driver.length,
            noOfVehicles: data.vehicleID.length,
            vehicles: await vehicle(data.vehicleID),
            noOfCashTrips: helper.cashData(true, driver).length,
            noOfNonCashTrips: helper.cashData(false, driver).length,
            totalCashAmount: helper.calculateTotalFunction(
              cashData(true, driver),
            ),
            totalNonCashAmount: helper.calculateTotalFunction(
              cashData(false, driver),
            ),
            trips: driver.map((value) => {
              return {
                name: value.user.name,
                created: value.created,
                pickup: value.pickup.address,
                destination: value.destination.address,
                billed: value.billedAmount,
                isCash: value.isCash,
                driverID: value.driverID,
              };
            }),
          };

          return newData;
        });
        return getTotalData;
      },
    );
    return test;
  } catch (error) {
    return error;
  }
}

module.exports = driverReport;

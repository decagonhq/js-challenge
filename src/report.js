const { getTrips, getVehicle } = require('api');
const { convertAdditionToDouble, getDriversData } = require('./utils');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 2
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  const trips = await getTrips();
  const driversData =  await getDriversData(trips);
  const drivers = [];

  for (let trip of trips){
      const driver = drivers.find((driver) => trip.driverID === driver.id);
      const newTripBuild = {
          user: trip.user.name,
          isCash: trip.isCash,
          pickup: trip.pickup.address,
          destination: trip.destination.address,
          created: trip.created,
          billed: trip.billedAmount
        }
      let amount = trip.billedAmount;
      if(driver) {
        driver.noOfTrips++;
        driver.totalAmountEarned = convertAdditionToDouble(driver.totalAmountEarned, amount);
  
        if(trip.isCash) {
          driver.noOfCashTrips++;
          driver.totalCashAmount = convertAdditionToDouble(driver.totalCashAmount, amount);
        } else {
          driver.noOfNonCashTrips++;
          driver.totalNonCashAmount = convertAdditionToDouble(driver.totalNonCashAmount, amount);
        }
        driver.trips.push(newTripBuild);
      } else {
        const currentDriver = driversData.find(driver => driver.id == trip.driverID);
      
        const driverDataBuild = {
          fullName: currentDriver ? currentDriver.name : trip.user.name,
          phone: currentDriver ? currentDriver.phone : trip.user.phone,
          id: currentDriver ? currentDriver.id : trip.driverID,
          vehicles: [],
          vehicleID: currentDriver ? currentDriver.vehicleID : [],
          email: currentDriver ? currentDriver.email : trip.user.email,
          noOfTrips: 1,
          noOfCashTrips: 0,
          noOfNonCashTrips: 0,
          totalAmountEarned: trip.billedAmount,
          totalCashAmount: 0,
          totalNonCashAmount: 0,
          trips: []
        }
  
        if(trip.isCash) {
          driverDataBuild.noOfCashTrips++;
          driverDataBuild.totalCashAmount = amount;
          
        } else {
          driverDataBuild.totalNonCashAmount = amount;
          driverDataBuild.noOfNonCashTrips++;
        }

        if(currentDriver) {
          for(vehicle of currentDriver.vehicleID) {
              const currentVehicle = getVehicle(vehicle);
              const vehicleBuild = {
                plate: currentVehicle.plate,
                manufacturer: currentVehicle.manufacturer
              }
      
              driverDataBuild.vehicles.push(vehicleBuild);
            }
        }

        driverDataBuild.trips.push(newTripBuild);
        drivers.push(driverDataBuild);
      }
  }
  return drivers;

}

module.exports = driverReport;

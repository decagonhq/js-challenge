const { getTrips, getDriver, getVehicle } = require('api');
const helper = {
  calculateTotalFunction: (value) => {
    const total = value
      .map((item) =>
        typeof item.billedAmount === 'string'
          ? Number(item.billedAmount.replace(',', ''))
          : item.billedAmount,
      )
      .reduce((prev, next) => prev + next, 0);
    return Math.round(total * 100) / 100;
  },

  getReport: async () => {
    const trips = await getTrips();

    const sorTripsByDriver = trips.reduce((acc, item) => {
      if (!acc[item.driverID]) {
        acc[item.driverID] = [];
      }
      acc[item.driverID].push(item);
      return acc;
    }, {});

    const allDrivers = await Promise.all(
      Object.keys(sorTripsByDriver).map(async (driver) => {
        try {
          return {
            ...(await getDriver(driver)),
            id: driver,
          };
        } catch (error) {
          return { error: 'Driver not found' };
        }
      }),
    );

    const getAllDrivers = allDrivers.filter(
      (value) => value.error !== 'Driver not found',
    );

    const getAllVehicles = await Promise.all(
      getAllDrivers.map(async (vehicle) => {
        try {
          return {
            ...(await getVehicle(vehicle.vehicleID)),
            id: vehicle.vehicleID[0],
          };
        } catch (error) {
          return { error: 'vehicle not found' };
        }
      }),
    );
    return [sorTripsByDriver, getAllDrivers, getAllVehicles];
  },
};

module.exports = helper;

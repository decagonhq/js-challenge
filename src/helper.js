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

    const getAllDrivers = await Promise.all(
      Object.keys(sorTripsByDriver).map(async (driver) => {
        try {
          const data = await getDriver(driver);
          return {
            ...data,
            vehicles: await Promise.all(
              data.vehicleID.map((id) => getVehicle(id)),
            ),
            id: driver,
          };
        } catch (error) {
          return {
            id: driver,
            vehicles: [],
            vehicleID: 0,
          };
        }
      }),
    );
    return [sorTripsByDriver, getAllDrivers];
  },
};

module.exports = helper;

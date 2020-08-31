const helper = {
  calculateTotalFunction: (value) => {
    const total = value
      .map((item) =>
        typeof item.billedAmount === 'string'
          ? Number(item.billedAmount.replace(',', ''))
          : item.billedAmount,
      )
      .reduce((prev, next) => prev + next);
    return Math.round(total * 100) / 100;
  },

  getTotalDrivers: async (getAllTrips, getDriver) => {
    const findDuplicate = new Set();
    const filteredArr = getAllTrips.filter((trip) => {
      const duplicate = findDuplicate.has(trip.driverID);
      findDuplicate.add(trip.driverID);
      return !duplicate;
    });

    let count = 2;

    for (let driver of filteredArr) {
      try {
        const drivers = await getDriver(driver.driverID);
        const carList = drivers.vehicleID.length > 1;
        console.log(carList, 'carList, carList');
        if (carList === true) {
          count++;
          return count;
        }
      } catch (error) {
        return 'Driver not found lol';
      }
    }
  },
  highestTripDriver: async (trips, getDriver) => {
    const driverIdList = trips.map((trip) => trip.driverID);
    const highestDriver = driverIdList
      .sort(
        (a, b) =>
          driverIdList.filter((v) => v === a).length -
          driverIdList.filter((v) => v === b).length,
      )
      .pop();
    const driverDetails = await getDriver(highestDriver);
    return [highestDriver, driverDetails];
  },
  earningDriver: async (getAllTrips, getDriver) => {
    const highestEarningDriver = Object.values(helper.mergeDrivers(getAllTrips))
      .map((high) => {
        return {
          id: high.map((bill) => bill.driverID)[0],
          billedAmount: helper.calculateTotalFunction(high.map((bill) => bill)),
          noOfTrips: high.map((bill) => bill.billedAmount).length,
        };
      })
      .sort((a, b) => b.billedAmount - a.billedAmount)[0];

    const driverDetails = await getDriver(highestEarningDriver.id);
    return { ...driverDetails, ...highestEarningDriver };
  },
  mergeDrivers: (getAllTrips) =>
    getAllTrips.reduce((acc, item) => {
      if (!acc[item.driverID]) {
        acc[item.driverID] = [];
      }
      acc[item.driverID].push(item);
      return acc;
    }, {}),
  cashData: (value, driver) => driver.filter((trips) => trips.isCash === value),
};

module.exports = helper;

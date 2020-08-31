const { getDriver } = require('api');

async function getDrivers(trips) {
  const tripID = [...new Set(trips.map(x => x.driverID)) ]

  try {
    const allDrivers = (await Promise.all(
        tripID
            .map(trip => getDriver(trip))
            .map(reason => reason.catch(() => null)),
    ))
    .filter(driver => driver !== null)
    .map((driver, index) => {
        driver['id'] = tripID[index]
        return driver
    })
    return allDrivers;

  } catch (error) {
    return [];
  }
}

module.exports = { getDrivers }

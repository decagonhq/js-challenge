const { getDriver, getVehicle } = require('api');

/**
 * fetches all (unique) drivers for the trips
 */
async function getAllDrivers(trips) {
  const _drivers = [];
  trips.forEach((trip) => {
    // only save unique driver IDs
    if (!_drivers.includes(trip.driverID)) {
      _drivers.push(trip.driverID);
    }
  });

  try {
    // load all drivers concurrently to reduce load time
    const drivers = (
      await Promise.all(
        _drivers
          .map((ID) => getDriver(ID))
          .map((promise) => promise.catch((e) => e)),
      )
    )
      .map((driver, i) => {
        if (!(driver instanceof Error)) {
          driver['id'] = _drivers[i];
        }
        return driver;
      })
      .filter((d) => !(d instanceof Error));

    return drivers;
  } catch (error) {
    return [];
  }
}

/**
 * fetches all vehicles for the drivers
 */
async function getAllVehicles(drivers) {
  const _vehicles = [];
  drivers.forEach((driver) => {
    _vehicles.push(...driver.vehicleID);
  });

  try {
    // load all vehicles concurrently to reduce load time
    const vehicles = (
      await Promise.all(
        _vehicles
          .map((ID) => getVehicle(ID))
          .map((promise) => promise.catch((e) => e)),
      )
    )
      .map((vehicle, i) => {
        if (!(v instanceof Error)) {
          vehicle['id'] = _vehicles[i];
        }
        return vehicle;
      })
      .filter((v) => !(v instanceof Error));

    return vehicles;
  } catch (error) {
    return [];
  }
}

module.exports = { getAllDrivers, getAllVehicles };

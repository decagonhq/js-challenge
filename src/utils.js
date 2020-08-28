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
          .map((promise) => promise.catch(() => null)),
      )
    )
      .map((driver, i) => {
        if (driver !== null) {
          driver['id'] = _drivers[i];
        }
        return driver;
      })
      .filter((driver) => driver !== null);

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
          .map((promise) => promise.catch(() => null)),
      )
    )
      .map((vehicle, i) => {
        if (vehicle !== null) {
          vehicle['id'] = _vehicles[i];
          vehicle['driverID'] = drivers[i].id;
        }
        return vehicle;
      })
      .filter((vehicle) => vehicle !== null);

    return vehicles;
  } catch (error) {
    return [];
  }
}

function toDouble(value) {
  return typeof value == 'string'
    ? Number.parseFloat(value.replace(/,/g, ''))
    : value;
}

module.exports = { getAllDrivers, getAllVehicles, toDouble };

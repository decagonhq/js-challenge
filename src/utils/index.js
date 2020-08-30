const { getDriver } = require('api');

const returnNumber = (number) => {
    return typeof(number) == 'string'
        ? Number.parseFloat(number.replace(/,/g, ''))
        : number;
}

const convertAdditionToDouble = (currentAmount, amountToBeAdded) => {
    let newCurrentAmount = returnNumber(currentAmount);
    let newAmountToBeAdded = returnNumber(amountToBeAdded);
    let result = newCurrentAmount + newAmountToBeAdded;
    return Number(result.toFixed(2));
}

const getDriversData = async (trips) => {
    const driverIds = [];

    trips.forEach((trip) => {
        if (!driverIds.includes(trip.driverID)) {
            driverIds.push(trip.driverID);
        }
    });
    
    const allDrivers =  await Promise.all(
        driverIds.map(async (id) => {
            const driver = await getDriver(id);
            driver.id = id;
            return driver;
        }).map((promise) => promise.catch(() => null)));

        return allDrivers.filter((driver) => driver !== null);
}

module.exports = {
    returnNumber,
    convertAdditionToDouble,
    getDriversData
}

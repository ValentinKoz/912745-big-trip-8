const data = () => ({
  routeType: new Map([
    [`Taxi`, `🚕`],
    [`Bus`, `🚌`],
    [`Train`, `🚂`],
    [`Ship`, `🛳️`],
    [`Transport`, `🚊`],
    [`Drive`, `🚗`],
    [`Flight`, `✈️`],
    [`Check-in`, `🏨`],
    [`Sightseeing`, `🏛️`],
    [`Restaurant`, `🍴`],
  ]),
  cities: [
    `Amsterdam`,
    `Geneva`,
    `Chamonix`,
    `Vienna`,
    `Luanda`,
    `Dacca`,
    `Minsk`,
  ][Math.floor(Math.random() * 7)],
  photo: `http://picsum.photos/300/150?r=${Math.random()}`,
  offers: new Set([
    `Add luggage`,
    `Switch to comfort class`,
    `Add meal`,
    `Choose seats`,
  ]),
  text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Cras aliquet varius magna, non porta ligula feugiat eget.
  Fusce tristique felis at fermentum pharetra.
  Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
  Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
  Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
  dateTrip: Date.now() + 1 + Math.floor(Math.random() * 7 * 24 * 60) * 60 * 1000,
  price: Math.floor(Math.random() * 15 * 10)
});

export default data;

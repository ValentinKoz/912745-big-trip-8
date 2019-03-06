const Filters = [`Everything`, `Future`, `Past`];
const TEST_DATA = 7;

const rand = (max = 6, min = 1) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const primaryApportionment = (TEST_DATA, getEvent, data, tripEvent) => {
  for (let i = 0; i < TEST_DATA; i++) {
    tripEvent.insertAdjacentHTML(`beforeend`, getEvent(data()));
  }
}

const generIcons = (data) => {
  const typeIcons = Array.from(data.routeType);
  return typeIcons[rand(9, 0)];
};

const getRandomOffers = (data) => {
  const QUTY_OFFERS = rand(3, 0);
  const setFromArray = Array.from(data.offers);
  const offers = new Set([]);

  while (offers.size < QUTY_OFFERS) {
    const randomOffer = setFromArray[rand(4, 0)];
    offers.add(randomOffer);
  }
  return [...offers].map((it) => `<li>
    <button class="trip-point__offer">${it} +&euro; ${rand(250, 15)}</button> </li>`).join(` `);
};

const startTrip = (data) => {
  const formatDate = new Date(data.dateTrip);
  const dateTime = formatDate.toString().split(` `);
  return dateTime[4].split(`:`, 2).join(`:`);
};

const finishAndDuration = (data) => {
  const durationPerMinutes = rand(10000000, 10000);
  const duration = (durationPerMinutes / 60000).toFixed();
  const durationHours = Math.floor(duration / 60) + `h ` + duration % 60 + `m`;

  const timeOfArrival = new Date(data.dateTrip + durationPerMinutes).toString().split(` `);
  const timeFinish = timeOfArrival[4].split(`:`, 2).join(`:`);
  return [durationHours, timeFinish];
};

export default {Filters, TEST_DATA, rand, generIcons, getRandomOffers, startTrip, finishAndDuration, primaryApportionment};

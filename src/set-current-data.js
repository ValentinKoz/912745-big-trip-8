import {generType, getRandomOffers, getText, setPriceToOffers, randomDate} from './function-for-set-current-data.js';
import {rand} from './random.js';

const currentData = (data) => ({
  routeType: generType(data.routeType),
  city: data.cities[rand(7, 0)],
  photo: [data.photo + `${Math.random()}`, data.photo + `${Math.random()}`, data.photo + `${Math.random()}`],
  offers: setPriceToOffers(getRandomOffers(data.offers)),
  text: getText(data.text),
  price: data.price,
  dateTrip: randomDate(data.dateTrip),
  durationPerMinutes: (data.durationPerMinutes / 60000).toFixed(),
});

export default currentData;

import {generType, getRandomOffers, getText, setPriceToOffers} from './other-functions.js';
import {rand} from './random.js';

const currentData = (data) => ({
  routeType: generType(data.routeType),
  cities: data.cities[rand(7, 0)],
  photo: data.photo + `${Math.random()}`,
  offers: setPriceToOffers(getRandomOffers(data.offers)),
  text: getText(data.text),
  dateTrip: data.dateTrip,
  price: data.price,
  durationPerMinutes: data.durationPerMinutes,
});

export default currentData;

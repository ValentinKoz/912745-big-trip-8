import {rand} from './random.js';

export const randomDate = (date) => {
  date.add(rand(), `days`).subtract(rand(), `days`);
  date.add(rand(250), `minutes`).subtract(rand(250), `minutes`);
  return date;
};

export const generType = (routeType) => {
  const typeIcons = [...routeType];
  return typeIcons[rand(9, 0)];
};

export const getText = (text) => {
  const qutyOffers = rand(4, 2);
  text = text.split(`.`);
  let descriptionText = [];

  while (descriptionText.length !== qutyOffers) {
    descriptionText.push(text[rand(9, 0)]);
  }
  return descriptionText.join(`. `);
};

export const getRandomOffers = (offers) => {
  const qutyOfeers = rand(3, 0);
  const offersMas = [...offers];

  while (offersMas.length !== qutyOfeers) {
    const index = rand(offersMas.length, 0);
    offersMas.splice(index, 1);
  }
  return offersMas;
};

export const setPriceToOffers = (mas) => {
  return mas.map((it) => ` +&euro;${rand(250, 15)} ${it}`);
};

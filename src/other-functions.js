import PointTrip from './pointTrip.js';
import EditPointTrip from './editPoint.js';
import currentData from './set-current-data.js';
import data from './make-data.js';
import {rand} from './random.js';

export const Filters = [`Everything`, `Future`, `Past`];
export const TEST_DATA = 7;

export const primaryApportionment = () => {
  for (let i = 0; i < TEST_DATA; i++) {
    createPoint();
  }
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

export const setFormatTime = (time) => {
  const hours = (time.getHours() >= 12) ? time.getHours() - 12 : time.getHours();
  const minutes = (time.getMinutes() > 10) ? time.getMinutes() : `0` + time.getMinutes();
  return `${hours}:${minutes}`;
};

export const generalization = (it) => {
  return it.toLowerCase().split(` `).join(`-`);
};

export const createPoint = () => {
  const tripContainer = document.querySelector(`.trip-day__items`);
  const componentTrip = new PointTrip(currentData(data()));
  const editComponentTrip = new EditPointTrip(componentTrip);

  tripContainer.appendChild(componentTrip.render());

  componentTrip.onEdit = () => {
    editComponentTrip.render();
    tripContainer.replaceChild(editComponentTrip.element, componentTrip.element);
    componentTrip.unrender();
  };

  editComponentTrip.submit = () => {
    componentTrip.render();
    tripContainer.replaceChild(componentTrip.element, editComponentTrip.element);
    editComponentTrip.unrender();
  };
};

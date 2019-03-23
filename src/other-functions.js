import PointTrip from './pointTrip.js';
import EditPointTrip from './editPoint.js';
import currentData from './set-current-data.js';
import data from './data.js';

export const Filters = [`Everything`, `Future`, `Past`];
export const TEST_DATA = 7;

export const primaryApportionment = () => {
  for (let i = 0; i < TEST_DATA; i++) {
    createPoint();
  }
};
export const typeTravelWay = {
  [`Taxi`]: `🚕`,
  [`Bus`]: `🚌`,
  [`Train`]: `🚂`,
  [`Ship`]: `🛳️`,
  [`Transport`]: `🚊`,
  [`Drive`]: `🚗`,
  [`Flight`]: `✈️`,
  [`Check-in`]: `🏨`,
  [`Sightseeing`]: `🏛️`,
  [`Restaurant`]: `🍴`,
};

export const citiesList = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Vienna`,
  `Luanda`,
  `Dacca`,
  `Minsk`,
];

export const toUpperFirstLetter = (value) => {
  let word = value.split(``);
  word[0] = word[0].toUpperCase();
  word = word.join(``);
  return word;
};

export const generalization = (it) => {
  return it.toLowerCase().split(` `).join(`-`);
};

export const createPoint = () => {
  const curData = currentData(data());
  const tripContainer = document.querySelector(`.trip-day__items`);
  const componentTrip = new PointTrip(curData);
  const editComponentTrip = new EditPointTrip(curData);

  tripContainer.appendChild(componentTrip.render());

  componentTrip.onEdit = () => {
    editComponentTrip.render();
    tripContainer.replaceChild(editComponentTrip.element, componentTrip.element);
    componentTrip.unrender();
  };

  editComponentTrip.submit = (newObject) => {
    curData.durationPerMinutes = newObject.durationPerMinutes;
    curData.routeType = newObject.routeType;
    curData.city = newObject.city;
    curData.dateTrip = newObject.dateTrip;
    curData.price = newObject.price;


    componentTrip.update(curData);
    componentTrip.render();
    tripContainer.replaceChild(componentTrip.element, editComponentTrip.element);
    editComponentTrip.unrender();
  };
};

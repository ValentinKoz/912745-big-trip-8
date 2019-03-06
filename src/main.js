import getEvent from './make-event.js';
import getTripFilter from './make-filter.js';
import data from './make-data.js';
import otherFunc from './get-other-functions.js';

const Filters = otherFunc.Filters;

let rand = (max = 6, min = 1) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const tripFilter = document.querySelector(`.trip-filter`);
const tripEvent = document.querySelector(`.trip-day__items`);
let conteinerFilters = [];

for (let i = 0; i < Filters.length; i++) {
  conteinerFilters.push(getTripFilter(Filters[i]));
}

conteinerFilters = conteinerFilters.join(` `);
tripFilter.insertAdjacentHTML(`beforeend`, conteinerFilters);
otherFunc.primaryApportionment(getEvent, data, tripEvent);

tripFilter.addEventListener(`change`, function (evt) {
  if (evt.target.tagName === `INPUT`) {
    tripEvent.innerText = ``;
    const eventCount = rand();
    for (let i = 0; i < eventCount; i++) {
      tripEvent.insertAdjacentHTML(`beforeend`, getEvent(data()));
    }
  }
});

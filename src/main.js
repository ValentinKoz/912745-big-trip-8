import getEvent from './make-event.js';
import getTripFilter from './make-filter.js';

const TEST_DATA = 7;

let rand = (max = 6, min = 1) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const tripFilter = document.querySelector(`.trip-filter`);
const tripEvent = document.querySelector(`.trip-day__items`);
const Filters = [`Everything`, `Future`, `Past`];
let conteinerFilters = [];

for (let i = 0; i < Filters.length; i++) {
  conteinerFilters.push(getTripFilter(Filters[i]));
}

conteinerFilters = conteinerFilters.join(` `);
tripFilter.insertAdjacentHTML(`beforeend`, conteinerFilters);


for (let i = 0; i < TEST_DATA; i++) {
  tripEvent.insertAdjacentHTML(`beforeend`, getEvent());
}

tripFilter.addEventListener(`change`, function (evt) {
  if (evt.target.tagName === `INPUT`) {
    tripEvent.innerText = ``;
    const eventCount = rand();
    for (let i = 0; i < eventCount; i++) {
      tripEvent.insertAdjacentHTML(`beforeend`, getEvent());
    }
  }
});

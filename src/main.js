import getTripFilter from './make-filter.js';
import {primaryApportionment, createPoint, Filters} from './other-functions.js';
import {rand} from './random.js';

const tripFilter = document.querySelector(`.trip-filter`);
const tripEvent = document.querySelector(`.trip-day__items`);
let conteinerFilters = [];

for (let i = 0; i < Filters.length; i++) {
  conteinerFilters.push(getTripFilter(Filters[i]));
}

conteinerFilters = conteinerFilters.join(` `);
tripFilter.insertAdjacentHTML(`beforeend`, conteinerFilters);

primaryApportionment();

tripFilter.addEventListener(`change`, function (evt) {
  if (evt.target.tagName === `INPUT`) {
    tripEvent.innerText = ``;
    const eventCount = rand();
    for (let i = 0; i < eventCount; i++) {
      createPoint();
    }
  }
});

import {getDataForPoint, renderPoint} from './point-logic.js';
import Filter from './filter.js';
import {getFilterData, renderFilter} from './function-for-filters.js';
import {buildChart} from './chart.js';
import {renderBlankChart, blankChart, filterInfoTransport, filterInfoMoney} from './other-functions.js';

const tripFilter = document.querySelector(`.trip-filter`);
const tripControlsMenu = document.querySelector(`.trip-controls__menus`);
const tripContainer = document.querySelector(`.trip-day__items`);

const Filters = [`Everything`, `Future`, `Past`];


const initFilters = getFilterData(Filters);
const initialPoints = getDataForPoint();

renderPoint(initialPoints, tripContainer);
renderFilter(initFilters, tripFilter, Filter, initialPoints, renderPoint, tripContainer);

tripControlsMenu.addEventListener(`click`, (evt) => {
  const menu = document.querySelector(`.trip-controls__menus`);
  if (evt.target.innerHTML === `Stats`) {
    renderBlankChart(document.querySelector(`body`), blankChart);
    const main = document.querySelector(`.main`);
    const statistic = document.querySelector(`.statistic`);

    main.classList.add(`visually-hidden`);
    statistic.classList.remove(`visually-hidden`);

    menu.children[1].classList.add(`view-switch__item--active`);
    menu.children[0].classList.remove(`view-switch__item--active`);

    const kindsTransports = filterInfoTransport(initialPoints);
    const spendMoney = filterInfoMoney(initialPoints);
    buildChart(kindsTransports, spendMoney);

  } else if (evt.target.innerHTML === `Table`) {
    if (document.querySelector(`.statistic`)) {
      const statistic = document.querySelector(`.statistic`);
      document.querySelector(`body`).removeChild(statistic);
    }
    const main = document.querySelector(`.main`);
    menu.children[0].classList.add(`view-switch__item--active`);
    menu.children[1].classList.remove(`view-switch__item--active`);
    main.classList.remove(`visually-hidden`);
  }
});

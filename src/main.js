import API from './api.js';
import PointTrip from './pointTrip.js';
import EditPointTrip from './editPoint.js';
import Filter from './filter.js';
import Sort from './trip-sort.js';
import TotalCost from './trip-total-cost.js';
import {getFilterData, filterPoints} from './function-for-filters.js';
import {getSortData, sortPoints} from './function-for-sorting.js';
import {buildChartMoney, buildChartTransport, buildChartTime} from './chart.js';
import {addElemToDom, renderBlankChart, blankChart, filterInfoTransport, filterInfoMoney, filterInfoTime, loadPoints, errorLoad, block, unblock, changeDate} from './other-functions.js';

const tripFilter = document.querySelector(`.trip-filter`);
const tripControlsMenu = document.querySelector(`.trip-controls__menus`);
const tripContainer = document.querySelector(`.trip-points`);

const Filters = [`Everything`, `Future`, `Past`];
const Sorts = [`Event`, `Time`, `Price`];
const pointsAfterFilter = [];

const AUTHORIZATION = `Basic eo0w590ik29889a=0.2819259828395535`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

loadPoints();
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const renderTotalCost = () => {
  const costConteiner = document.querySelector(`.trip`);

  if (document.querySelector(`.trip__total`)) {
    costConteiner.removeChild(document.querySelector(`.trip__total`));
  }
  api.getPoints().then((points) => {
    const tripCost = new TotalCost(points);
    costConteiner.appendChild(tripCost.render());
  });
};

const renderPoint = (points, newCreatePoint = false) => {
  tripContainer.innerHTML = ``;

  for (const point of points) {
    const componentTrip = new PointTrip(point);
    const editComponentTrip = new EditPointTrip(point);

    if (newCreatePoint && points[points.length - 1] === point) {
      addElemToDom(editComponentTrip);
    } else {
      addElemToDom(componentTrip);
    }

    componentTrip.onEdit = () => {
      editComponentTrip.render();
      componentTrip.element.parentNode.replaceChild(editComponentTrip.element, componentTrip.element);
      componentTrip.unrender();
    };

    editComponentTrip.onSubmit = (newObject) => {
      point.basePrice = newObject.basePrice;
      point.dateFrom = newObject.dateFrom;
      point.dateTo = newObject.dateTo;
      point.destination = newObject.destination;
      point.type = newObject.type;
      point.isFavorite = newObject.isFavorite;
      point.offers = newObject.offers;

      block(editComponentTrip, `Saving`);
      api.updatePoints({id: point.id, data: point.toRAW()})
        .then(unblock(editComponentTrip))
        .then((newPoint) => {
          componentTrip.update(newPoint);
          componentTrip.render();
          editComponentTrip.element.parentNode.replaceChild(componentTrip.element, editComponentTrip.element);
          changeDate(componentTrip, newPoint);
          editComponentTrip.unrender();
        }).then(renderTotalCost)
        .catch(() => {
          editComponentTrip.shake(`Save`);
          unblock(editComponentTrip);
        });
    };

    editComponentTrip.onDelete = ({id}) => {
      block(editComponentTrip, `Deleting`);
      api.deletePoint({id})
        .then(unblock(editComponentTrip))
        .then(tripContainer.removeChild(editComponentTrip.element.parentNode.parentNode))
        .then(renderTotalCost)
        .catch(() => {
          editComponentTrip.shake(`Delete`);
          unblock(editComponentTrip);
        });
    };

    editComponentTrip.onExit = () => {
      api.getPoints()
        .then(unblock(editComponentTrip))
        .then(() => {
          componentTrip.render();
          editComponentTrip.element.parentNode.replaceChild(componentTrip.element, editComponentTrip.element);
          editComponentTrip.unrender();
        });
    };
  }
};

export const listDestinations = [];
api.getDestinations().then((destinations) => {
  listDestinations.push(destinations);
});

export const listOffres = [];
api.getOffers().then((offres) => {
  listOffres.push(offres);
});

api.getPoints().then((points) => {
  renderPoint(points);
}).then(renderTotalCost)
.catch(errorLoad);

const renderFilter = (massivFilters) => {

  for (const filter of massivFilters) {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = () => {
      const filterName = filterComponent.element.querySelector(`input`).id;
      document.querySelector(`#sorting-event`).checked = true;
      api.getPoints()
        .then((points) => filterPoints(filterName, points))
        .then((filteredPoints) => {
          renderPoint(filteredPoints);
          pointsAfterFilter.push(filteredPoints);
        });
    };
    tripFilter.appendChild(filterComponent.render());
  }
};

const initFilters = getFilterData(Filters);
renderFilter(initFilters);


const renderSort = (massiv) => {
  const tripSorting = document.querySelector(`.trip-sorting`);

  for (const sort of massiv) {
    const sortComponent = new Sort(sort);

    sortComponent.onSort = () => {
      const filterName = sortComponent.element.querySelector(`input`).id;

      api.getPoints().then((points) => {
        if (pointsAfterFilter[pointsAfterFilter.length - 1]) {
          return sortPoints(filterName, pointsAfterFilter[pointsAfterFilter.length - 1]);
        } else {
          return sortPoints(filterName, points);
        }
      })
        .then((filteredPoints) => {
          renderPoint(filteredPoints, tripSorting);
        });
    };
    tripSorting.insertBefore(sortComponent.render(), tripSorting.querySelector(`.trip-sorting__item--offers`));
  }
};

const initSort = getSortData(Sorts);
renderSort(initSort);

const newEvent = document.querySelector(`.trip-controls__new-event`);

newEvent.addEventListener(`click`, () => {
  api.getPoints().then((points) => api.createPoints(points[0]))
  .then(() => api.getPoints())
  .then((points) => {
    renderPoint(points, true);
  }).catch();
});

tripControlsMenu.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  const menu = document.querySelector(`.trip-controls__menus`);
  const main = document.querySelector(`.main`);

  if (evt.target.innerHTML === `Stats`) {
    renderBlankChart(document.querySelector(`body`), blankChart);
    const statistic = document.querySelector(`.statistic`);

    main.classList.add(`visually-hidden`);
    statistic.classList.remove(`visually-hidden`);

    menu.children[1].classList.add(`view-switch__item--active`);
    menu.children[0].classList.remove(`view-switch__item--active`);

    api.getPoints().then((points) => filterInfoTransport(points)).then((filteredPoints) => {
      buildChartTransport(filteredPoints);
    });
    api.getPoints().then((points) => filterInfoMoney(points)).then((filteredPoints) => {
      buildChartMoney(filteredPoints);
    });
    api.getPoints().then((points) => filterInfoTime(points)).then((filteredPoints) => {
      buildChartTime(filteredPoints);
    });

  } else if (evt.target.innerHTML === `Table`) {
    if (document.querySelector(`.statistic`)) {
      const statistic = document.querySelector(`.statistic`);
      document.querySelector(`body`).removeChild(statistic);
    }
    menu.children[0].classList.add(`view-switch__item--active`);
    menu.children[1].classList.remove(`view-switch__item--active`);
    main.classList.remove(`visually-hidden`);
  }
});

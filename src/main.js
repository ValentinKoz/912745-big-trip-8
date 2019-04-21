import API from './api.js';
import PointTrip from './pointTrip.js';
import EditPointTrip from './editPoint.js';
import Filter from './filter.js';
import Sort from './trip-sort.js';
import TotalCost from './trip-total-cost.js';
import {getFilterData, filterPoints} from './function-for-filters.js';
import {getSortData, sortPoints} from './function-for-sorting.js';
import {buildChartMoney, buildChartTransport, buildChartTime} from './chart.js';
import {addElemToDom, renderBlankChart, blankChart, filterInfoTransport, filterInfoMoney, filterInfoTime, loadPoints, errorLoad, block, unblock, changeDate, Filters, addNewElemToDom} from './other-functions.js';

const AUTHORIZATION = `Basic eo0w590ik29889a=0.2812249828315530`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const Sorts = [`Event`, `Time`, `Price`];

const tripFilter = document.querySelector(`.trip-filter`);
const tripControlsMenu = document.querySelector(`.trip-controls__menus`);
const tripContainer = document.querySelector(`.trip-points`);
const newEvent = document.querySelector(`.trip-controls__new-event`);

const pointsAfterFilter = [];
const currentPoints = [];

export const listDestinations = [];
export const listOffres = [];
const initSort = getSortData(Sorts);
const initFilters = getFilterData(Filters);

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

const renderPoint = (points, newCreatePoint = false, sort = false) => {
  const tripPoints = document.querySelector(`.trip-points`);
  tripPoints.innerHTML = ``;
  tripContainer.innerHTML = ``;

  for (const point of points) {
    const componentTrip = new PointTrip(point);
    const editComponentTrip = new EditPointTrip(point);
    if (sort) {
      addNewElemToDom(componentTrip, false);
    } else if (newCreatePoint && points[points.length - 1] === point) {
      addNewElemToDom(editComponentTrip);
    } else {
      addElemToDom(componentTrip, false);
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

          for (const currentPoint of currentPoints[currentPoints.length - 1]) {
            if (currentPoint.id === newPoint.id) {
              const updetedPoint = currentPoints[currentPoints.length - 1].indexOf(currentPoint);
              currentPoints[currentPoints.length - 1][updetedPoint] = newPoint;
              break;
            }
          }

          const currentTripDay = editComponentTrip.element.parentNode.parentNode;
          currentTripDay.querySelector(`.trip-day__number`).innerHTML = `${point.dateFrom.format(`DD`)}`;
          currentTripDay.querySelector(`.trip-day__title`).innerHTML = `${point.dateFrom.format(`MMM YY`)}`;

          editComponentTrip.element.parentNode.replaceChild(componentTrip.element, editComponentTrip.element);
          changeDate(componentTrip, newPoint);
          for (const number of document.querySelectorAll(`.trip-day__number`)) {
            if (number.innerHTML < point.dateFrom.format(`DD`)) {
              const w = number.parentNode.parentNode;
              w.before(currentTripDay);
              break;
            } else if (number.innerHTML > point.dateFrom.format(`DD`) && number.parentNode.parentNode.nextElementSibling === null) {
              const w = number.parentNode.parentNode;
              w.after(currentTripDay);
              break;
            }
          }

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
        .then(()=> {
          for (const currentPoint of currentPoints[currentPoints.length - 1]) {
            if (currentPoint.id === id) {
              const deleteCurrentPoint = currentPoints[currentPoints.length - 1].indexOf(currentPoint);
              currentPoints[currentPoints.length - 1].splice(deleteCurrentPoint, 1);
              break;
            }
          }
        })
        .then(unblock(editComponentTrip))
        .then(tripContainer.removeChild(editComponentTrip.element.parentNode.parentNode))
        .then(renderTotalCost)
        .catch(() => {
          editComponentTrip.shake(`Delete`);
          unblock(editComponentTrip);
        });
    };

    editComponentTrip.onExit = () => {
      unblock(editComponentTrip);
      componentTrip.render();
      editComponentTrip.element.parentNode.replaceChild(componentTrip.element, editComponentTrip.element);
      editComponentTrip.unrender();
    };
  }
};

const renderFilter = (massivFilters) => {

  for (const filter of massivFilters) {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = () => {
      const filterName = filterComponent.element.querySelector(`input`).id;
      document.querySelector(`#sorting-event`).checked = true;
      const filteredPoints = filterPoints(filterName, currentPoints[currentPoints.length - 1]);
      filteredPoints.sort((firstElem, secondElem) => {
        const firstDate = firstElem.dateFrom.format(`DD`);
        const secondDate = secondElem.dateFrom.format(`DD`);
        if (firstDate > secondDate) {
          return 1;
        } else if (firstDate < secondDate) {
          return -1;
        } else {
          return 0;
        }
      });
      pointsAfterFilter.push(filteredPoints);
      renderPoint(filteredPoints, false, true);
    };
    tripFilter.appendChild(filterComponent.render());
  }
};

const renderSort = (massivSort) => {
  const tripSorting = document.querySelector(`.trip-sorting`);

  for (const sort of massivSort) {
    const sortComponent = new Sort(sort);

    sortComponent.onSort = () => {
      const filterName = sortComponent.element.querySelector(`input`).id;
      if (pointsAfterFilter[pointsAfterFilter.length - 1]) {
        const filteredPoints = sortPoints(filterName, pointsAfterFilter[pointsAfterFilter.length - 1]);
        return renderPoint(filteredPoints, false, true);
      } else {
        const filteredPoints = sortPoints(filterName, currentPoints[currentPoints.length - 1]);
        return renderPoint(filteredPoints, false, true);
      }
    };
    tripSorting.insertBefore(sortComponent.render(), tripSorting.querySelector(`.trip-sorting__item--offers`));
  }
};

api.getDestinations().then((destinations) => {
  listDestinations.push(destinations);
});

api.getOffers().then((offres) => {
  listOffres.push(offres);
});

api.getPoints().then((points) => {
  currentPoints.push(points);
  return renderPoint(points);
}).then(renderTotalCost)
.catch(errorLoad);


renderFilter(initFilters);
renderSort(initSort);

newEvent.addEventListener(`click`, () => {
  api.getPoints().then((points) => api.createPoints(points[0]))
  .then(() => api.getPoints())
  .then((points) => {
    currentPoints.push(points);
    return renderPoint(points, true);
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

import Filter from './filter.js';
import {getFilterData, filterPoints} from './function-for-filters.js';
import {buildChartMoney, buildChartTransport} from './chart.js';
import {renderBlankChart, blankChart, filterInfoTransport, filterInfoMoney, loadPoints, errorLoad, block, unblock} from './other-functions.js';
import {API} from './api.js';
import PointTrip from './pointTrip.js';
import EditPointTrip from './editPoint.js';

const tripFilter = document.querySelector(`.trip-filter`);
const tripControlsMenu = document.querySelector(`.trip-controls__menus`);

const Filters = [`Everything`, `Future`, `Past`];


const AUTHORIZATION = `Basic eo0w590ik29889a=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

loadPoints();
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const renderPoint = (points) => {
  const tripContainer = document.querySelector(`.trip-day__items`);
  tripContainer.innerHTML = ``;

  for (const point of points) {
    const componentTrip = new PointTrip(point);
    const editComponentTrip = new EditPointTrip(point);

    tripContainer.appendChild(componentTrip.render());

    componentTrip.onEdit = () => {
      editComponentTrip.render();
      tripContainer.replaceChild(editComponentTrip.element, componentTrip.element);
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
          tripContainer.replaceChild(componentTrip.element, editComponentTrip.element);
          editComponentTrip.unrender();
        }).catch(() => {
          editComponentTrip.shake(`Save`);
          unblock(editComponentTrip);
        });
    };

    editComponentTrip.onDelete = ({id}) => {
      block(editComponentTrip, `Deleting`);
      api.deletePoint({id})
        .then(unblock(editComponentTrip))
        .then(() => api.getPoints())
        .then(renderPoint)
        .catch(() => {
          editComponentTrip.shake(`Delete`);
          unblock(editComponentTrip);
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
}).catch(errorLoad);

const initFilters = getFilterData(Filters);

const renderFilter = (massiv) => {
  const tripContainer = document.querySelector(`.trip-day__items`);

  for (const filter of massiv) {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = () => {
      const filterName = filterComponent.element.querySelector(`input`).id;
      api.getPoints().then((points) => filterPoints(filterName, points))
        .then((filteredPoints) => {
          renderPoint(filteredPoints, tripContainer);
        });
    };
    tripFilter.appendChild(filterComponent.render());
  }
};

api.getPoints().then((points) => renderFilter(initFilters, tripFilter, Filter, renderPoint, points));

tripControlsMenu.addEventListener(`click`, (evt) => {
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

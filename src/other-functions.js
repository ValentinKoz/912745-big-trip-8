import {createElement} from './create-element.js';
import moment from 'moment';

export const Filters = [`Everything`, `Future`, `Past`];
export const typeTravelWay = {
  [`taxi`]: `🚕`,
  [`bus`]: `🚌`,
  [`train`]: `🚂`,
  [`flight`]: `✈️`,
  [`check-in`]: `🏨`,
  [`sightseeing`]: `🏛️`,
};

export const scorePrice = () => {
  const pricePoints = document.querySelectorAll(`.trip-point__price`);
  const totalPrice = [...pricePoints].reduce((total, point)=>{
    return total + +point.innerHTML.split(`€&nbsp;`)[1];
  }, 0);
  const conteinerTotalPrice = document.querySelector(`.trip__total-cost`);
  conteinerTotalPrice.innerHTML = `&#8364; ${totalPrice}`;
};

export const loadPoints = () => {
  const tripContainer = document.querySelector(`.trip-points`);
  const boardNoPoints = `<div class = "board__no-points">Loading route...</div>`;
  tripContainer.appendChild(createElement(boardNoPoints));
};

export const errorLoad = () => {
  const tripContainer = document.querySelector(`.trip-points`);
  const boardNoPoints = `<div class = "board__no-points">
  Something went wrong while loading your route info. Check your connection or try again later</div>`;
  tripContainer.innerHTML = ``;
  tripContainer.appendChild(createElement(boardNoPoints));
};

export const block = (component, text) => {
  const elem = component.element;
  elem.querySelector(`.card__form`).disabled = true;
  elem.querySelector(`.point__button--save`).disabled = true;
  elem.querySelector(`.point__buttons`).lastElementChild.disabled = true;
  if (text === `Saving`) {
    elem.querySelector(`.point__button--save`).innerHTML = `${text}...`;
  } else {
    elem.querySelector(`.point__buttons`).lastElementChild.innerHTML = `${text}...`;
  }
};

export const unblock = (component) => {
  const elem = component.element;
  elem.querySelector(`.card__form`).disabled = false;
  elem.querySelector(`.point__button--save`).disabled = false;
  elem.querySelector(`.point__buttons`).lastElementChild.disabled = false;
};


export const generalization = (it) => {
  return it.toLowerCase().split(` `).join(`-`);
};

export const filterInfoTransport = (points) => {
  const massivTags = {};
  const labels = [];
  const data = [];

  for (const point of points) {
    const mas = point.type + `  ` + typeTravelWay[point.type];
    if (massivTags[mas]) {
      massivTags[mas] += 1;
    } else {
      massivTags[mas] = 1;
    }
  }
  for (const key in massivTags) {
    if (key) {
      labels.push(`${key}`);
      data.push(massivTags[key]);
    }
  }
  return {
    labels,
    data,
  };
};

export const filterInfoMoney = (points) => {
  const massivTags = {};
  const labels = [];
  const data = [];

  for (const point of points) {
    // удалить
    const price = point.basePrice + point.offers.reduce(function (total, currentValue) {
      if (currentValue.accepted === true) {
        return total + currentValue.price;
      } else {
        return total;
      }
    }, 0);
    const mas = point.type + `  ` + typeTravelWay[point.type];
    if (massivTags[mas]) {
      massivTags[mas] += price;
    } else {
      massivTags[mas] = price;
    }
  }
  for (const key in massivTags) {
    if (key) {
      labels.push(`${key}`);
      data.push(massivTags[key]);
    }
  }
  return {
    labels,
    data,
  };
};

export const filterInfoTime = (points) => {
  const massivTags = {};
  const labels = [];
  const data = [];

  for (const point of points) {
    const mas = point.type + `  ` + typeTravelWay[point.type];
    if (massivTags[mas]) {
      massivTags[mas] += moment.duration(point.dateTo.diff(point.dateFrom)).asHours();
    } else {
      massivTags[mas] = moment.duration(point.dateTo.diff(point.dateFrom)).asHours();
    }
  }

  for (const key in massivTags) {
    if (key) {
      labels.push(`${key}`);
      data.push(Math.round(massivTags[key]));
    }
  }
  return {
    labels,
    data,
  };
};

export const blankChart = () => {
  return `
    <section class="statistic content-wrap" id="stats">
      <div class="statistic__item statistic__item--money">
        <canvas class="statistic__money" width="900"></canvas>
      </div>

      <div class="statistic__item statistic__item--transport">
        <canvas class="statistic__transport" width="900"></canvas>
      </div>

      <div class="statistic__item statistic__item--time-spend">
        <canvas class="statistic__time-spend" width="900"></canvas>
      </div>
  </section>`;
};

export const renderBlankChart = (conteiner) => {
  if (conteiner.lastChild.tagName === `SECTION`) {
    const oldChild = conteiner.lastChild;
    conteiner.removeChild(oldChild);
  }
  conteiner.appendChild(createElement(blankChart()));
};

export const addElemToDom = (elem, number) => {
  const tripPoint = document.querySelector(`.trip-points`);
  tripPoint.appendChild(createElement(tripDay()));

  const tripDayTitle = document.querySelectorAll(`.trip-day__title`);
  const tripContainer = document.querySelectorAll(`.trip-day__items`);
  const dayNumber = document.querySelectorAll(`.trip-day__number`);

  tripContainer[tripContainer.length - 1].appendChild(elem.render());
  tripDayTitle[tripDayTitle.length - 1].innerHTML = `${elem._dateFrom.format(`MMM DD`)}`;
  dayNumber[dayNumber.length - 1].innerHTML = `${number}`;

  return ++number;
};

export const changeDate = (componentTrip, newPoint) => {
  const tripDay = componentTrip.element.parentNode.parentNode;
  const tripDayTitle = tripDay.querySelector(`.trip-day__title`);
  tripDayTitle.innerHTML = `${newPoint.dateFrom.format(`MMM DD`)}`;
  return tripDay;
};

export const tripDay = () => {
  return `
  <section class="trip-day">
    <article class="trip-day__info">
      <span class="trip-day__caption">Day</span>
      <p class="trip-day__number"></p>
      <h2 class="trip-day__title"></h2>
    </article>
    <div class="trip-day__items">
    </div>
  </section>`;
};

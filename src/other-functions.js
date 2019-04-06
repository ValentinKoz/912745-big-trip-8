import {createElement} from './create-element.js';
export const Filters = [`Everything`, `Future`, `Past`];

export const typeTravelWay = {
  [`taxi`]: `🚕`,
  [`bus`]: `🚌`,
  [`train`]: `🚂`,
  [`flight`]: `✈️`,
  [`check-in`]: `🏨`,
  [`sightseeing`]: `🏛️`,
};

export const loadPoints = () => {
  const tripContainer = document.querySelector(`.trip-day__items`);
  const boardNoPoints = `<div class = "board__no-points">Loading route...</div>`;
  tripContainer.appendChild(createElement(boardNoPoints));
};

export const errorLoad = () => {
  const tripContainer = document.querySelector(`.trip-day__items`);
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
    const mas = point.type + `  ` + typeTravelWay[point.type];
    if (massivTags[mas]) {
      massivTags[mas] += point.basePrice;
    } else {
      massivTags[mas] = point.basePrice;
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

import {createElement} from './create-element.js';
export const Filters = [`Everything`, `Future`, `Past`];

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

export const filterInfoTransport = (points) => {
  const massivTags = {};
  const labels = [];
  const data = [];

  for (let i = 0; i < points.length; i++) {
    const mas = points[i].routeType.join(` `);
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

  for (let i = 0; i < points.length; i++) {
    const mas = points[i].routeType.join(` `);
    if (massivTags[mas]) {
      massivTags[mas] += points[i].price;
    } else {
      massivTags[mas] = points[i].price;
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

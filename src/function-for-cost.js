import TotalCost from './trip-total-cost.js';

export const renderTotalCost = (api) => {
  const costConteiner = document.querySelector(`.trip`);

  if (document.querySelector(`.trip__total`)) {
    costConteiner.removeChild(document.querySelector(`.trip__total`));
  }
  api.getPoints().then((points) => {
    const tripCost = new TotalCost(points);
    costConteiner.appendChild(tripCost.render());
  });
};

import otherFunc from './get-other-functions.js';

function getEvent(data) {

  const currentIcon = otherFunc.generIcons(data);
  const timeStart = otherFunc.startTrip(data);
  const amountOfTime = otherFunc.finishAndDuration(data);
  const masOffers = otherFunc.getRandomOffers(data);

  return `
    <article class="trip-point">
      <i class="trip-icon">${currentIcon[1]}</i>
      <h3 class="trip-point__title"> Drive to ${data.cities}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${timeStart}&nbsp;&mdash;${amountOfTime[1]}</span>
        <span class="trip-point__duration">${amountOfTime[0]}</span>
      </p>
      <p class="trip-point__price"> &euro;&nbsp;${data.price}</p>
      <ul class="trip-point__offers">
        ${masOffers}
      </ul>
    </article>`;
}

export default getEvent;

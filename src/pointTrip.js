import {rand} from './random.js';
import {createElement} from './create-element.js';

class PointTrip {
  constructor(data) {
    this._routeType = data.routeType;
    this._cities = data.cities;
    this._photo = data.photo;
    this._offers = data.offers;
    this._text = data.text;
    this._dateTrip = data.dateTrip;
    this._price = data.price;
    this._durationPerMinutes = data.durationPerMinutes;

    this._element = null;
    this._onEdit = null;
  }

  get element() {
    return this._element;
  }
  set onEdit(fn) {
    this._onEdit = fn;
  }

  onClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  _generIcons() {
    const typeIcons = Array.from(this._routeType);
    return typeIcons[rand(9, 0)][1];
  }

  _startTrip() {
    const formatDate = new Date(this._dateTrip);
    const dateTime = formatDate.toString().split(` `);
    return dateTime[4].split(`:`, 2).join(`:`);
  }

  _duration() {
    const duration = (this._durationPerMinutes / 60000).toFixed();
    return Math.floor(duration / 60) + `h ` + duration % 60 + `m`;
  }

  _finishTrip() {
    const timeOfArrival = new Date(this._dateTrip + this._durationPerMinutes).toString().split(` `);
    const timeFinish = timeOfArrival[4].split(`:`, 2).join(`:`);
    return timeFinish;
  }

  _getRandomOffers() {
    const QUTY_OFFERS = rand(3, 0);
    const setFromArray = Array.from(this._offers);
    const offers = new Set([]);

    while (offers.size < QUTY_OFFERS) {
      const randomOffer = setFromArray[rand(4, 0)];
      offers.add(randomOffer);
    }
    return [...offers].map((it) => `<li>
      <button class="trip-point__offer">${it} +&euro; ${rand(250, 15)}</button> </li>`).join(` `);
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._generIcons()}</i>
        <h3 class="trip-point__title"> Drive to ${this._cities}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._startTrip()}&nbsp;&mdash;${this._finishTrip()}</span>
          <span class="trip-point__duration">${this._duration()}</span>
        </p>
        <p class="trip-point__price"> &euro;&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._getRandomOffers()}
        </ul>
      </article>`;
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {
    this._element
    .addEventListener(`click`, this.onClick.bind(this));
  }
  reset() {
    this._element
    .removeEventListener(`click`, this.onClick.bind(this));
  }

  unrender() {
    this.reset();
    this._element = null;
  }

}

export default PointTrip;

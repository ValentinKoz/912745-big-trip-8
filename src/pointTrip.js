import Component from './component.js';
import {typeTravelWay} from './other-functions.js';
import moment from 'moment';

class PointTrip extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._offers = data.offers;
    this._destination = data.destination;
    this._dateFrom = data.dateFrom;
    this._basePrice = data.basePrice;
    this._dateTo = data.dateTo;
    this._isFavorite = data.isFavorite;

    this.onClick = this.onClick.bind(this);
    this._onEdit = null;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${typeTravelWay[this._type.toUpperCase()]}</i>
        <h3 class="trip-point__title">${this._type} to ${this._destination.name}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._dateFrom.format(`HH:mm`)}&nbsp;&mdash;${this._dateTo.format(`HH:mm`)}</span>
          <span class="trip-point__duration">${this._duration()}</span>
        </p>
        <p class="trip-point__price"> &euro;&nbsp;${this._totalPrice(this._basePrice, this._offers)}</p>
        <ul class="trip-point__offers">
          ${this._offers.map((it) => `<li><button class="trip-point__offer">${it.title} +&#8364; ${it.price}</button> </li>`.trim()).join(``)}
        </ul>
      </article>`;
  }

  _duration() {
    const minutes = moment.duration(this._dateTo.diff(this._dateFrom)).asMinutes();
    return `${Math.floor(minutes / 60)}H ${Math.floor(minutes % 60)}M`;
  }

  update(data) {
    this._basePrice = data.basePrice;
    this._dateFrom = data.dateFrom;
    this._dateTo = data.dateTo;
    this._destination = data.destination;
    this._offers = data.offers;
    this._type = data.type;
    this._isFavorite = data.isFavorite;
  }

  onClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  bind() {
    this._element
    .addEventListener(`click`, this.onClick);
  }

  unbind() {
    this._element
    .removeEventListener(`click`, this.onClick);
  }

}

export default PointTrip;

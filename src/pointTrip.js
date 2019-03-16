import {setFormatTime} from './other-functions.js';
import Component from './component.js';

class PointTrip extends Component {
  constructor(data) {
    super();
    this._routeType = data.routeType;
    this._cities = data.cities;
    this._photo = data.photo;
    this._offers = data.offers;
    this._text = data.text;
    this._dateTrip = data.dateTrip;
    this._price = data.price;
    this._durationPerMinutes = data.durationPerMinutes;

    this.onClick = this.onClick.bind(this);
    this._onEdit = null;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  _startTrip() {
    const formatDate = new Date(this._dateTrip);
    return setFormatTime(formatDate);
  }

  _duration() {
    const duration = (this._durationPerMinutes / 60000).toFixed();
    return Math.floor(duration / 60) + `h ` + duration % 60 + `m`;
  }

  _finishTrip() {
    const timeOfArrival = new Date(this._dateTrip + this._durationPerMinutes);
    return setFormatTime(timeOfArrival);
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._routeType[1]}</i>
        <h3 class="trip-point__title">${this._routeType[0]} to ${this._cities}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._startTrip()}&nbsp;&mdash;${this._finishTrip()}</span>
          <span class="trip-point__duration">${this._duration()}</span>
        </p>
        <p class="trip-point__price"> &euro;&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._offers.map((it) => `<li>
            <button class="trip-point__offer">${it}</button> </li>`).join(` `)}
        </ul>
      </article>`;
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

  reset() {
    this._element
    .removeEventListener(`click`, this.onClick);
  }

}

export default PointTrip;

import Component from './component.js';
import moment from 'moment';

class PointTrip extends Component {
  constructor(data) {
    super();
    this._routeType = data.routeType;
    this._city = data.city;
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

  _duration() {
    return Math.floor(this._durationPerMinutes / 60) + `h ` + this._durationPerMinutes % 60 + `m`;
  }

  _finishTrip() {
    let finishTime = moment(this._dateTrip);
    finishTime = finishTime.add(this._durationPerMinutes, `minutes`);
    return finishTime;
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._routeType[1]}</i>
        <h3 class="trip-point__title">${this._routeType[0]} to ${this._city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._dateTrip.format(`HH:mm`)}&nbsp;&mdash;${this._finishTrip().format(`HH:mm`)}</span>
          <span class="trip-point__duration">${this._duration()}</span>
        </p>
        <p class="trip-point__price"> &euro;&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._offers.map((it) => `<li>
            <button class="trip-point__offer">${it}</button> </li>`).join(` `)}
        </ul>
      </article>`;
  }

  update(data) {
    this._routeType = data.routeType;
    this._city = data.city;
    this._dateTrip = data.dateTrip;
    this._price = data.price;
    this._durationPerMinutes = data.durationPerMinutes;
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

import {generalization, typeTravelWay, toUpperFirstLetter, citiesList} from './other-functions.js';
import {createElement} from './create-element.js';
import flatpickr from 'flatpickr';
import Component from './component.js';
import moment from 'moment';

class EditPointTrip extends Component {
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

    this._onSubmitClick = this._onSubmitClick.bind(this);
    this._onChangePrice = this._onChangePrice.bind(this);
    this._onChangeCities = this._onChangeCities.bind(this);
    this._onChangeDuration = this._onChangeDuration.bind(this);
    this._onChangeTravelWay = this._onChangeTravelWay.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);

    this._element = null;
    this._onSubmit = null;
    this._onDelete = null;
  }

  _processForm() {
    return {
      durationPerMinutes: this._durationPerMinutes,
      routeType: this._routeType,
      city: this._city,
      dateTrip: this._dateTrip,
      price: this._price,
    };
  }

  _onSubmitClick(evt) {
    evt.preventDefault();

    const newData = this._processForm();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    this.update(newData);
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();

    if (evt.target.innerHTML === `Delete` && typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  update(data) {
    this._durationPerMinutes = data.durationPerMinutes;
    this._routeType = data.routeType;
    this._city = data.city;
    this._dateTrip = data.dateTrip;
    this._price = data.price;
  }

  _finishTrip() {
    let finishTime = moment(this._dateTrip);
    finishTime = finishTime.add(this._durationPerMinutes, `minutes`);
    return finishTime;
  }

  _partialUpdate() {
    const parentDomElement = document.querySelector(`.trip-day__items`);
    const previousElement = this._element;

    this._element = createElement(this.template);
    parentDomElement.replaceChild(this._element, previousElement);
    previousElement.remove();
  }

  _onChangeTravelWay(evt) {
    if (evt.target.tagName === `INPUT`) {
      const value = toUpperFirstLetter(evt.target.value);
      this._routeType = [value, typeTravelWay[value]];
      this.unbind();
      this._partialUpdate();
      this.bind();
    }
  }

  _onChangeCities(evt) {
    this._city = evt.target.value;
  }

  _onChangePrice(evt) {
    this._price = evt.target.value;
  }

  _onChangeDuration(evt) {
    const [start, finish] = evt.target.value.split(` — `);
    const difference = moment.utc(moment(finish, `HH:mm`) - moment(start, `HH:mm`)).format(`HH:mm`);
    const [hoursStart, minutesStart] = start.split(`:`);
    const [hoursDiff, minutesDiff] = difference.split(`:`);

    this._dateTrip = this._dateTrip.hour(hoursStart).minute(minutesStart);
    this._durationPerMinutes = +minutesDiff + (60 * +hoursDiff);

  }

  get template() {
    return `<article class="point">
      <form class="card__form" action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="MAR 18" name="day" value="">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${this._routeType[1]}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

            <div class="travel-way__select">
              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi" ${this._routeType[0].toLowerCase() === `taxi` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus" ${this._routeType[0].toLowerCase() === `bus` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train" ${this._routeType[0].toLowerCase() === `train` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travel-way" value="ship" ${this._routeType[0].toLowerCase() === `ship` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-ship">🛳️ ship</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-transport" name="travel-way" value="transport" ${this._routeType[0].toLowerCase() === `transport` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-transport">🚊 transport</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-drive" name="travel-way" value="drive" ${this._routeType[0].toLowerCase() === `drive` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-drive">🚗 drive</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight" ${this._routeType[0].toLowerCase() === `flight` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
              </div>

              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in" ${this._routeType[0].toLowerCase() === `check-in` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="restaurant" ${this._routeType[0].toLowerCase() === `restaurant` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-restaurant">🍴 restaurant</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing" ${this._routeType[0].toLowerCase() === `sightseeing` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
              </div>
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">${this._routeType[0]} to </label>
            <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
            <datalist id="destination-select">
            ${citiesList.map((city) => `<option value="${city}"></option>`).join(` `)}
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="${this._dateTrip.format(`HH:mm`)} — ${this._finishTrip().format(`HH:mm`)}" name="time" placeholder="00:00 — 00:00">
          </label>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._price}" name="price">
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
            <label class="point__favorite" for="favorite">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>

            <div class="point__offers-wrap">
              ${this._offers.map((it) => `<input class="point__offers-input visually-hidden" type="checkbox" id="${generalization(it)}" name="offer" value="${generalization(it)}">
                <label for="${generalization(it)}" class="point__offers-label">
                  <span class="point__offer-service"${it}</span> <span class="point__offer-price">${it}</span>
                </label>`).join(` `)}
              </label>
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._text}</p>
            <div class="point__destination-images">
            ${this._photo.map((it) => `<img src="${it}" alt="picture from place" class="point__destination-image">`).join(` `)}
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  bind() {
    this._element.addEventListener(`submit`, this._onSubmitClick);
    this._element.querySelector(`.travel-way__select`).addEventListener(`click`, this._onChangeTravelWay);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeCities);
    this._element.querySelector(`.point__price .point__input`).addEventListener(`change`, this._onChangePrice);
    this._element.querySelector(`.point__time .point__input`).addEventListener(`change`, this._onChangeDuration);
    this._element.querySelector(`.point__buttons`).lastElementChild.addEventListener(`click`, this._onDeleteButtonClick);

    flatpickr(this._element.querySelector(`.point__time .point__input`), {mode: `range`, dateFormat: `H:i`, enableTime: true, time24hr: true, locale: {rangeSeparator: ` — `}});

  }

  reset() {
    this._element.removeEventListener(`submit`, this._onSubmitClick);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`click`, this._onChangeTravelWay);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangeCities);
    this._element.querySelector(`.point__price .point__input`).removeEventListener(`change`, this._onChangePrice);
    this._element.querySelector(`.point__time .point__input`).addEventListener(`change`, this._onChangeDuration);
    this._element.querySelector(`.point__buttons`).lastElementChild.removeEventListener(`click`, this._onDeleteButtonClick);
  }

}
export default EditPointTrip;

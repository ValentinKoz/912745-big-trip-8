import {generalization} from './other-functions.js';
import {createElement} from './create-element.js';
import {typeTravelWay} from './other-functions.js';
import flatpickr from 'flatpickr';
import Component from './component.js';
import {listDestinations, listOffres} from './main.js';
import moment from 'moment';

const ANIMATION_TIMEOUT = 600;

class EditPointTrip extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._basePrice = data.basePrice;
    this._dateFrom = data.dateFrom;
    this._dateTo = data.dateTo;
    this._destination = data.destination;
    this._offers = data.offers;
    this._type = data.type;
    this._isFavorite = data.isFavorite;

    this._onSubmitClick = this._onSubmitClick.bind(this);
    this._onChangePrice = this._onChangePrice.bind(this);
    this._onChangeCities = this._onChangeCities.bind(this);
    this._onChangeFirstDate = this._onChangeFirstDate.bind(this);
    this._onChangeSecondDate = this._onChangeSecondDate.bind(this);
    this._onChangeTravelWay = this._onChangeTravelWay.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onChangeFavorite = this._onChangeFavorite.bind(this);
    this._onSelectOffers = this._onSelectOffers.bind(this);
    this._onExitClick = this._onExitClick.bind(this);

    this._element = null;
    this._onSubmit = null;
    this._onDelete = null;
    this._onExit = null;
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
            <label class="travel-way__label" for="travel-way__toggle${this._id}">${this._type ? typeTravelWay[this._type.toUpperCase()] : ``}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle${this._id}">

            <div class="travel-way__select">
              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi" ${this._type === `taxi` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus" ${this._type === `bus` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train" ${this._type === `train` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight" ${this._type === `flight` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
              </div>

              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in" ${this._type === `check-in` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing" ${this._type === `sightseeing` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
              </div>
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">${this._type ? this._type + ` to ` : `` }</label>
            <input class="point__destination-input" placeholder="enter city" list="destination-select" id="destination" value="${this._destination.name ? this._destination.name : ``}" name="destination">
            <datalist id="destination-select">
            ${listDestinations[0].map((destination) => `<option value="${destination.name}"></option>`).join(` `)}
            </datalist>
          </div>
          <div class="point__time">
            choose time
              <input class="point__input" type="text" value="${this._dateFrom.format(`HH:mm DD MMM YY`)}" name="date-start" placeholder="19:00">
              <input class="point__input" type="text" value="${this._dateTo.format(`HH:mm DD MMM YY`)}" name="date-end" placeholder="21:00">
          </div>
          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._basePrice}" name="price">
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button point__button--delete" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
            <label class="point__favorite" for="favorite">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>

            <div class="point__offers-wrap">
              ${this._offers && this._offers.map((it) => `<input class="point__offers-input visually-hidden" ${it.accepted ? `checked` : ``} type="checkbox" id="${generalization(it.title)}" name="offer" value="${generalization(it.title)}">
                <label for="${generalization(it.title)}" class="point__offers-label">
                  <span class="point__offer-service"${it.title}</span> <span class="point__offer-price">+&euro;${it.price} ${it.title}</span>
                </label>`).join(` `)}
              </label>
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._destination.description && this._destination.description}</p>
            <div class="point__destination-images">
            ${this._destination.pictures ? this._destination.pictures.map((it) => `<img src="${it.src}" alt="${it.description}" class="point__destination-image">`).join(``) : ``}
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="${this._totalPrice(this._basePrice, this._offers)}">
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

  set onExit(fn) {
    this._onExit = fn;
  }

  _processForm() {
    return {
      basePrice: this._basePrice,
      dateFrom: this._dateFrom,
      dateTo: this._dateTo,
      destination: this._destination,
      picture: this._picture,
      offers: this._offers,
      type: this._type,
      isFavorite: this._isFavorite,
    };
  }
  _onChangeFavorite() {
    this._isFavorite = !this._isFavorite;
  }

  _onSubmitClick(evt) {
    evt.preventDefault();

    const newData = this._processForm();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    this.update(newData);
  }

  _partialUpdate() {
    const previousElement = this._element;

    this._element = createElement(this.template);
    previousElement.parentNode.replaceChild(this._element, previousElement);
    previousElement.remove();
  }

  _onChangeTravelWay(evt) {
    if (evt.target.tagName === `INPUT`) {
      const selectType = listOffres[0].filter((it) => it.type === evt.target.value);
      this._type = selectType[0].type;
      this._offers = selectType[0].offers;

      this.unbind();
      this._partialUpdate();
      this.bind();
    }
  }

  _onChangeCities(evt) {
    const city = listDestinations[0].filter((it) => it.name === evt.target.value);
    this._destination = city[0];

    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onChangePrice(evt) {
    this._basePrice = +evt.target.value;
  }

  _onChangeFirstDate(evt) {
    this._dateFrom = moment(evt.target.value);
  }

  _onChangeSecondDate(evt) {
    this._dateTo = moment(evt.target.value);
  }

  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
    }
  }

  _onExitClick(evt) {
    if (typeof this._onExit === `function` && evt.keyCode === 27) {
      this._onExit();
    }
  }

  _onSelectOffers(evt) {
    this._offers.map((offer) => {
      if (generalization(offer.title) === evt.target.value) {
        offer.accepted = !offer.accepted;
      }
    });
    this.unbind();
    this._partialUpdate();
    this.bind();
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

  shake(text) {
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._element.style.border = `2px solid red`;
    setTimeout(() => {
      if (text === `Save`) {
        this._element.querySelector(`.point__button--save`).innerHTML = `${text}`;
      } else {
        this._element.querySelector(`.point__button--delete`).innerHTML = `${text}`;
      }
      this._element.style.border = ``;
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  bind() {
    this._element.addEventListener(`submit`, this._onSubmitClick);
    window.addEventListener(`keydown`, this._onExitClick);
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onChangeTravelWay);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeCities);
    this._element.querySelector(`.point__price .point__input`).addEventListener(`change`, this._onChangePrice);
    this._element.querySelector(`.point__time .point__input:first-child`).addEventListener(`change`, this._onChangeFirstDate);
    this._element.querySelector(`.point__time .point__input:nth-child(2)`).addEventListener(`change`, this._onChangeSecondDate);
    this._element.querySelector(`.point__buttons`).lastElementChild.addEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.point__favorite`).addEventListener(`click`, this._onChangeFavorite);
    this._element.querySelector(`.point__offers-wrap`).addEventListener(`change`, this._onSelectOffers);

    flatpickr(this._element.querySelector(`.point__time .point__input:first-child`), {dateFormat: ` H:i j M y`, enableTime: true});
    flatpickr(this._element.querySelector(`.point__time .point__input:nth-child(2)`), {dateFormat: ` H:i j M y`, enableTime: true});

  }

  unbind() {
    this._element.removeEventListener(`submit`, this._onSubmitClick);
    window.removeEventListener(`keydown`, this._onExitClick);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onChangeTravelWay);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangeCities);
    this._element.querySelector(`.point__price .point__input`).removeEventListener(`change`, this._onChangePrice);
    this._element.querySelector(`.point__time .point__input:first-child`).removeEventListener(`change`, this._onChangeFirstDate);
    this._element.querySelector(`.point__time .point__input:nth-child(2)`).removeEventListener(`change`, this._onChangeSecondDate);
    this._element.querySelector(`.point__button--delete`).removeEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.point__favorite`).removeEventListener(`click`, this._onChangeFavorite);
    this._element.querySelector(`.point__offers-wrap`).removeEventListener(`change`, this._onSelectOffers);
  }

}
export default EditPointTrip;

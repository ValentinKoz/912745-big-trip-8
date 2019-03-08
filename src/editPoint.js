import {rand} from './random.js';
import {createElement} from './create-element.js';

class EditPointTrip {
  constructor(data) {
    this._routeType = data.routeType;
    this._cities = data.cities;
    this._photo = data.photo;
    this._offers = data.offers;
    this._text = data.text;
    this._dateTrip = data.dateTrip;
    this._price = data.price;
    this._durationPerMinutes = data.durationPerMinutes;

    this._icon = ``;
    this._element = null;
    this._onSubmit = null;
  }

  get element() {
    return this._element;
  }
  _getDateTrip() {
    const formatDate = new Date(this._dateTrip);
    const dateTime = formatDate.toString().split(` `);
    return dateTime[2] + ` ` + dateTime[1];
  }

  _getRandomOffers() {
    const QUTY_OFFERS = rand(3, 0);
    const setFromArray = Array.from(this._offers);
    const offers = new Set([]);

    while (offers.size < QUTY_OFFERS) {
      const randomOffer = setFromArray[rand(4, 0)];
      offers.add(randomOffer);
    }
    return [...offers].map((it) => `<input class="point__offers-input visually-hidden" type="checkbox" id="${it.toLowerCase().split(` `).join(`-`)}" name="offer" value="${it.toLowerCase().split(` `).join(`-`)}">
      <label for="${it.toLowerCase().split(` `).join(`-`)}" class="point__offers-label">
        <span class="point__offer-service"${it}</span> + €<span class="point__offer-price">${rand(250, 15)} ${it}</span>
      </label>`).join(` `);
  }

  _getText() {
    const QUTY_OFFERS = rand(4, 2);
    let text = this._text;
    text = text.split(`.`);
    let descriptionText = [];
    while (descriptionText.length !== QUTY_OFFERS) {
      descriptionText.push(text[rand(9, 0)]);
    }
    return descriptionText;
  }

  get template() {
    return `<article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="MAR 18" name="day" value="${this._getDateTrip()}">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">✈️</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

            <div class="travel-way__select">
              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
                <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
                <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
                <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="train" checked>
                <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
              </div>

              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
                <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing">
                <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
              </div>
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">Flight to</label>
            <input class="point__destination-input" list="destination-select" id="destination" value="${this._cities}" name="destination">
            <datalist id="destination-select">
              <option value="airport"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="hotel"></option>
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="00:00 — 00:00" name="time" placeholder="00:00 — 00:00">
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
              ${this._getRandomOffers()}
              </label>
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._getText()}</p>
            <div class="point__destination-images">
              <img src="${this._photo}" alt="picture from place" class="point__destination-image">
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`;
  }

  _onSubmitClick(evt) {
    if (evt.target.tagName === `BUTTON`) {
      evt.preventDefault();
      if (typeof this._onSubmit === `function`) {
        this._onSubmit();
      }
    }
  }
  set submit(fn) {
    this._onSubmit = fn;
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.reset();
    this._element = null;
  }

  bind() {
    this._element.addEventListener(`click`, this._onSubmitClick.bind(this));
  }

  reset() {
    this._element.removeEventListener(`click`, this._onSubmitClick.bind(this));
  }

}
export default EditPointTrip;

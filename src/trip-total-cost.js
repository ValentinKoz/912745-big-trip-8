import Component from './component.js';

class TotalCost extends Component {
  constructor(data) {
    super();
    this._points = data;

    this._sumBasePrice = this._sumBasePrice.bind(this);
    this._scoreOffers = this._scoreOffers.bind(this);
    this._scoreTotalPrice = this._scoreTotalPrice.bind(this);
  }

  get template() {
    return `
    <p class="trip__total">
      Total: <span class="trip__total-cost">€ ${this._scoreTotalPrice()}</span>
    </p>`;
  }

  _sumBasePrice() {
    return this._points.reduce(function (total, currentValue) {
      return total + currentValue.basePrice;
    }, 0);
  }

  _scoreOffers() {
    const offersForEachPoint = [];
    const offers = [];
    this._points.map((point) => {
      offersForEachPoint.push(point.offers);
    });

    offersForEachPoint.map((masOffer) => {
      masOffer.forEach((offer) => offers.push(offer));
    });
    return offers;
  }

  _scoreTotalPrice() {
    return this._totalPrice(this._sumBasePrice(), this._scoreOffers());
  }

}

export default TotalCost;

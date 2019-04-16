import {createElement} from './create-element.js';

class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._element = null;
  }
  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {}

  unbind() {}

  update() {}

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }

  _totalPrice(basePrice, offers) {
    return basePrice + offers.reduce(function (total, currentValue) {
      if (currentValue.accepted === true) {
        return total + currentValue.price;
      } else {
        return total;
      }
    }, 0);
  }

}
export default Component;

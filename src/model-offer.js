class ModelOffer {
  constructor(data) {
    this.type = data[`type`];
    this.offers = data[`offers`];
    this._changeProperty = this._changeProperty.bind(this);
  }
  _changeProperty() {
    const mas = this.offers.map((it) => {
      return {title: it.name, price: it.price, accepted: false};
    });
    this.offers = mas;
    return this;
  }

  static parseOffer(data) {
    return new ModelOffer(data)._changeProperty();
  }

  static parseOffers(data) {
    return data.map(ModelOffer.parseOffer);
  }

}

export default ModelOffer;

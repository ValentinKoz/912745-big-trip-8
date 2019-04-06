import moment from 'moment';

class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.basePrice = data[`base_price`];
    this.dateFrom = moment(data[`date_from`]);
    this.dateTo = moment(data[`date_to`]);
    this.destination = data[`destination`];
    this.offers = data[`offers`];
    this.type = data[`type`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'date_from': this.dateFrom,
      'base_price': this.basePrice,
      'date_to': this.dateTo,
      'destination': this.destination,
      'offers': this.offers,
      'type': this.type,
      'is_favorite': this.isFavorite,
    };
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }

}

export default ModelPoint;

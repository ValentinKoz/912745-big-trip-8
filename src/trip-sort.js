import Component from './component.js';

class Sort extends Component {
  constructor(data) {
    super();
    this._caption = data.caption;
    this._onSort = null;

    this.state = {
      isChecked: false,
    };
    this._onSortClick = this._onSortClick.bind(this);
  }
  set onSort(fn) {
    this._onSort = fn;
  }

  get template() {
    return `
    <div style="display:inline">
      <input type="radio" name="trip-sorting" id="sorting-${this._caption.toLowerCase()}" value="${this._caption.toLowerCase()}" ${this.state.isChecked ? `checked` : ``}>
      <label class="trip-sorting__item trip-sorting__item--${this._caption.toLowerCase()}" for="sorting-${this._caption.toLowerCase()}">${this._caption}</label>
    </div>`;
  }

  _onSortClick() {
    if (typeof this._onSort === `function`) {
      this._onSort();
    }
  }

  bind() {
    this._element
      .addEventListener(`click`, this._onSortClick);
  }

  unbind() {
    this._element
      .removeEventListener(`click`, this._onSortClick);
  }
}

export default Sort;

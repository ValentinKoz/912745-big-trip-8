import Component from './component.js';

class Filter extends Component {
  constructor(data) {
    super();
    this._caption = data.caption;
    this._onFilter = null;

    this.state = {
      isChecked: false,
    };
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `
    <div style="display:inline"
    class="item_filter">
      <input
            type="radio"
            id="filter-${this._caption.toLowerCase()}"
            name="filter"
            value="${this._caption.toLowerCase()}"
            ${this.state.isChecked ? ` checked` : ``}
            />
      <label class="trip-filter__item" for="filter-${this._caption.toLowerCase()}">${this._caption}</label></div>`.trim();
  }

  _onFilterClick() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  bind() {
    this._element
      .addEventListener(`click`, this._onFilterClick);
  }

  unbind() {
    this._element
      .removeEventListener(`click`, this._onFilterClick);
  }
}

export default Filter;

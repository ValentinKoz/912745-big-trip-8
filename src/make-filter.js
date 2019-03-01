let getTripFilter = (caption, isChecked = false) => {
  const lowerCaption = caption.toLowerCase();
  return `
  <input
        type="radio"
        id="filter-${lowerCaption}"
        name="filter"
        value="${lowerCaption}"
        ${isChecked ? ` checked` : ``}
        />
  <label class="trip-filter__item" for="filter-${lowerCaption}">${caption}</label>`;
};

export default getTripFilter;

export const getFilterData = (filters) => {
  const massivFilters = [];
  for (const filter of filters) {
    massivFilters.push({caption: filter});
  }
  return massivFilters;
};

export const renderFilter = (massiv, tripFilter, Filter, initialPoints, renderPoint, tripContainer) => {
  for (const filter of massiv) {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = () => {
      const filterName = filterComponent.element.querySelector(`input`).id;
      const filteredPoints = filterPoints(filterName, initialPoints);
      renderPoint(filteredPoints, tripContainer);
    };
    tripFilter.appendChild(filterComponent.render());
  }
};

export const filterPoints = (filterName, initialPoints) => {
  switch (filterName) {
    case `filter-everything`:
      return initialPoints;

    case `filter-future`:
      return initialPoints.filter((it) => {
        if (it.dateTrip) {
          return it.dateTrip.isAfter();
        } else {
          return false;
        }
      });

    case `filter-past`:
      return initialPoints.filter((it) => {
        if (it.dateTrip) {
          return it.dateTrip.isBefore();
        } else {
          return false;
        }
      });

    default:
      return initialPoints;
  }
};

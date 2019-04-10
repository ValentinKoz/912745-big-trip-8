export const getFilterData = (filters) => {
  return filters.map((filter) => {
    return {caption: filter};
  });
};

export const filterPoints = (filterName, initialPoints) => {
  switch (filterName) {
    case `filter-everything`:
      return initialPoints;

    case `filter-future`:
      return initialPoints.filter((it) => {
        if (it.dateFrom) {
          return it.dateFrom.isAfter();
        } else {
          return false;
        }
      });

    case `filter-past`:
      return initialPoints.filter((it) => {
        if (it.dateFrom) {
          return it.dateFrom.isBefore();
        } else {
          return false;
        }
      });

    default:
      return initialPoints;
  }
};

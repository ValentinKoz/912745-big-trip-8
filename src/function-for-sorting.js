import moment from 'moment';

export const getSortData = (sorts) => {
  return sorts.map((sort) => {
    return {caption: sort};
  });
};

export const sortPoints = (sortName, initialPoints) => {
  switch (sortName) {
    case `sorting-event`:
      return initialPoints.sort((firstElem, secondElem) => {
        const firstDate = firstElem.dateFrom.format(`DD`);
        const secondDate = secondElem.dateFrom.format(`DD`);
        if (firstDate > secondDate) {
          return 1;
        } else if (firstDate < secondDate) {
          return -1;
        } else {
          return 0;
        }
      });

    case `sorting-time`:
      return initialPoints.sort((firstElem, secondElem) => {
        const firstDuration = moment.duration(firstElem.dateTo.diff(firstElem.dateFrom)).asMinutes();
        const secondDuration = moment.duration(secondElem.dateTo.diff(secondElem.dateFrom)).asMinutes();
        if (firstDuration > secondDuration) {
          return 1;
        } else if (firstDuration < secondDuration) {
          return -1;
        } else {
          return 0;
        }
      });

    case `sorting-price`:
      return initialPoints.sort((firstElem, secondElem) => {
        if (firstElem.basePrice > secondElem.basePrice) {
          return 1;
        } else if (firstElem.basePrice < secondElem.basePrice) {
          return -1;
        } else {
          return 0;
        }
      });

    default:
      return initialPoints;
  }
};

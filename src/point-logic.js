import PointTrip from './pointTrip.js';
import EditPointTrip from './editPoint.js';
import currentData from './set-current-data.js';
import data from './data.js';

export const TEST_DATA = 7;

export const getDataForPoint = () => {
  const massivPoint = [];
  for (let i = 0; i < TEST_DATA; i++) {
    const currentPoint = currentData(data());
    massivPoint.push(currentPoint);
  }
  return massivPoint;
};

export const updatePoint = (points, i, newPoint) => {
  points[i] = Object.assign({}, points[i], newPoint);
  return points[i];
};

export const deletePoint = (points, i) => {
  points[i] = null;
  return points;
};

export const renderPoint = (points, tripContainer) => {
  tripContainer.innerHTML = ``;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const componentTrip = new PointTrip(point);
    const editComponentTrip = new EditPointTrip(point);

    componentTrip.onEdit = () => {
      editComponentTrip.render();
      tripContainer.replaceChild(editComponentTrip.element, componentTrip.element);
      componentTrip.unrender();
    };

    editComponentTrip.onSubmit = (newObject) => {
      const updatedPoint = updatePoint(points, i, newObject);
      componentTrip.update(updatedPoint);
      componentTrip.render();
      tripContainer.replaceChild(componentTrip.element, editComponentTrip.element);
      editComponentTrip.unrender();
    };

    editComponentTrip.onDelete = () => {
      deletePoint(points, i);
      tripContainer.removeChild(editComponentTrip.element);
      editComponentTrip.unrender();
    };
    tripContainer.appendChild(componentTrip.render());
  }
};

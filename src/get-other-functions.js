import PointTrip from './pointTrip.js';
import EditPointTrip from './editPoint.js';
import data from './make-data.js';

const Filters = [`Everything`, `Future`, `Past`];
const TEST_DATA = 7;

const primaryApportionment = () => {
  for (let i = 0; i < TEST_DATA; i++) {
    createPoint();
  }
};
const createPoint = () => {
  const tripContainer = document.querySelector(`.trip-day__items`);
  const componentTrip = new PointTrip(data());
  const editComponentTrip = new EditPointTrip(data());

  tripContainer.appendChild(componentTrip.render());

  componentTrip.onEdit = () => {
    editComponentTrip.render();
    tripContainer.replaceChild(editComponentTrip.element, componentTrip.element);
    componentTrip.unrender();
  };

  editComponentTrip.submit = () => {
    componentTrip.render();
    tripContainer.replaceChild(componentTrip.element, editComponentTrip.element);
    editComponentTrip.unrender();
  };
};

export default {Filters, TEST_DATA, primaryApportionment, createPoint};

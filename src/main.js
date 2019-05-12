import moment from 'moment';
import API from './api.js';
import PointTrip from './pointTrip.js';
import EditPointTrip from './editPoint.js';
import Filter from './filter.js';
import Sort from './trip-sort.js';
import TotalCost from './trip-total-cost.js';
import {getFilterData, filterPoints} from './function-for-filters.js';
import {getSortData, sortPoints} from './function-for-sorting.js';
import {buildChartMoney, buildChartTransport, buildChartTime} from './chart.js';
import {addElemToDom, renderBlankChart, blankChart, filterInfoTransport, filterInfoMoney, filterInfoTime, loadPoints, errorLoad, block, unblock, changeDate, Filters, addNewElemToDom} from './other-functions.js';
const AUTHORIZATION = `Basic eo0w590ik29889a=0.2812249828315530`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const Sorts = [`Event`, `Time`, `Price`];

const tripFilter = document.querySelector(`.trip-filter`);
const tripControlsMenu = document.querySelector(`.trip-controls__menus`);
const tripContainer = document.querySelector(`.trip-points`);
const newEvent = document.querySelector(`.trip-controls__new-event`);

const pointsAfterFilter = [];
const currentPoints = [];

export const listDestinations = [];
export const listOffres = [];
const initSort = getSortData(Sorts);
const initFilters = getFilterData(Filters);

loadPoints();
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const renderTotalCost = () => {
  const costConteiner = document.querySelector(`.trip`);

  if (document.querySelector(`.trip__total`)) {
    costConteiner.removeChild(document.querySelector(`.trip__total`));
  }
  api.getPoints().then((points) => {
    const tripCost = new TotalCost(points);
    costConteiner.appendChild(tripCost.render());
  });
};

const renderPoint = (points, newCreatePoint = false, sort = false) => {
  const tripPoints = document.querySelector(`.trip-points`);
  tripPoints.innerHTML = ``;
  tripContainer.innerHTML = ``;

  for (const point of points) {
    const componentTrip = new PointTrip(point);
    const editComponentTrip = new EditPointTrip(point);
    if (sort) {
      addNewElemToDom(componentTrip, false);
    } else if (newCreatePoint && points[points.length - 1] === point) {
      addNewElemToDom(editComponentTrip);
    } else {
      addElemToDom(componentTrip, false);
    }

    componentTrip.onEdit = () => {
      editComponentTrip.render();
      componentTrip.element.parentNode.replaceChild(editComponentTrip.element, componentTrip.element);
      componentTrip.unrender();
    };

    editComponentTrip.onSubmit = (newObject) => {
      point.basePrice = newObject.basePrice;
      point.dateFrom = newObject.dateFrom;
      point.dateTo = newObject.dateTo;
      point.destination = newObject.destination;
      point.type = newObject.type;
      point.isFavorite = newObject.isFavorite;
      point.offers = newObject.offers;

      block(editComponentTrip, `Saving`);
      api.updatePoints({id: point.id, data: point.toRAW()})
        .then(unblock(editComponentTrip))
        .then((newPoint) => {
          componentTrip.update(newPoint);
          componentTrip.render();

          for (const currentPoint of currentPoints[currentPoints.length - 1]) {
            if (currentPoint.id === newPoint.id) {
              const updetedPoint = currentPoints[currentPoints.length - 1].indexOf(currentPoint);
              currentPoints[currentPoints.length - 1][updetedPoint] = newPoint;
              break;
            }
          }

          const currentTripDay = editComponentTrip.element.parentNode.parentNode;
          currentTripDay.querySelector(`.trip-day__number`).innerHTML = `${point.dateFrom.format(`DD`)}`;
          currentTripDay.querySelector(`.trip-day__title`).innerHTML = `${point.dateFrom.format(`MMM YY`)}`;

          editComponentTrip.element.parentNode.replaceChild(componentTrip.element, editComponentTrip.element);
          changeDate(componentTrip, newPoint);
          for (const number of document.querySelectorAll(`.trip-day__number`)) {
            if (number.innerHTML < point.dateFrom.format(`DD`)) {
              const w = number.parentNode.parentNode;
              w.before(currentTripDay);
              break;
            } else if (number.innerHTML > point.dateFrom.format(`DD`) && number.parentNode.parentNode.nextElementSibling === null) {
              const w = number.parentNode.parentNode;
              w.after(currentTripDay);
              break;
            }
          }

          editComponentTrip.unrender();
        }).then(renderTotalCost)
        .catch(() => {
          editComponentTrip.shake(`Save`);
          unblock(editComponentTrip);
        });
    };

    editComponentTrip.onDelete = ({id}) => {
      block(editComponentTrip, `Deleting`);
      api.deletePoint({id})
        .then(()=> {
          for (const currentPoint of currentPoints[currentPoints.length - 1]) {
            if (currentPoint.id === id) {
              const deleteCurrentPoint = currentPoints[currentPoints.length - 1].indexOf(currentPoint);
              currentPoints[currentPoints.length - 1].splice(deleteCurrentPoint, 1);
              break;
            }
          }
        })
        .then(unblock(editComponentTrip))
        .then(tripContainer.removeChild(editComponentTrip.element.parentNode.parentNode))
        .then(renderTotalCost)
        .catch(() => {
          editComponentTrip.shake(`Delete`);
          unblock(editComponentTrip);
        });
    };

    editComponentTrip.onExit = () => {
      unblock(editComponentTrip);
      componentTrip.render();
      editComponentTrip.element.parentNode.replaceChild(componentTrip.element, editComponentTrip.element);
      editComponentTrip.unrender();
    };
  }
};

const renderFilter = (massivFilters) => {

  for (const filter of massivFilters) {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = () => {
      const filterName = filterComponent.element.querySelector(`input`).id;
      document.querySelector(`#sorting-event`).checked = true;
      const filteredPoints = filterPoints(filterName, currentPoints[currentPoints.length - 1]);
      filteredPoints.sort((firstElem, secondElem) => {
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
      pointsAfterFilter.push(filteredPoints);
      renderPoint(filteredPoints, false, true);
    };
    tripFilter.appendChild(filterComponent.render());
  }
};

const renderSort = (massivSort) => {
  const tripSorting = document.querySelector(`.trip-sorting`);

  for (const sort of massivSort) {
    const sortComponent = new Sort(sort);

    sortComponent.onSort = () => {
      const filterName = sortComponent.element.querySelector(`input`).id;
      if (pointsAfterFilter[pointsAfterFilter.length - 1]) {
        const filteredPoints = sortPoints(filterName, pointsAfterFilter[pointsAfterFilter.length - 1]);
        return renderPoint(filteredPoints, false, true);
      } else {
        const filteredPoints = sortPoints(filterName, currentPoints[currentPoints.length - 1]);
        return renderPoint(filteredPoints, false, true);
      }
    };
    tripSorting.insertBefore(sortComponent.render(), tripSorting.querySelector(`.trip-sorting__item--offers`));
  }
};

api.getDestinations().then((destinations) => {
  listDestinations.push(destinations);
});

api.getOffers().then((offres) => {
  listOffres.push(offres);
});

api.getPoints().then((points) => {
  currentPoints.push(points);
  return renderPoint(points);
}).then(renderTotalCost)
.catch(errorLoad);


renderFilter(initFilters);
renderSort(initSort);

newEvent.addEventListener(`click`, () => {
  api.getPoints().then((points) => api.createPoints(points[0]))
  .then(() => api.getPoints())
  .then((points) => {
    currentPoints.push(points);
    return renderPoint(points, true);
  }).catch();
});

tripControlsMenu.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  const menu = document.querySelector(`.trip-controls__menus`);
  const main = document.querySelector(`.main`);

  if (evt.target.innerHTML === `Stats`) {
    renderBlankChart(document.querySelector(`body`), blankChart);
    const statistic = document.querySelector(`.statistic`);

    main.classList.add(`visually-hidden`);
    statistic.classList.remove(`visually-hidden`);

    menu.children[1].classList.add(`view-switch__item--active`);
    menu.children[0].classList.remove(`view-switch__item--active`);

    api.getPoints().then((points) => filterInfoTransport(points)).then((filteredPoints) => {
      buildChartTransport(filteredPoints);
    });
    api.getPoints().then((points) => filterInfoMoney(points)).then((filteredPoints) => {
      buildChartMoney(filteredPoints);
    });
    api.getPoints().then((points) => filterInfoTime(points)).then((filteredPoints) => {
      buildChartTime(filteredPoints);
    });

  } else if (evt.target.innerHTML === `Table`) {
    if (document.querySelector(`.statistic`)) {
      const statistic = document.querySelector(`.statistic`);
      document.querySelector(`body`).removeChild(statistic);
    }
    menu.children[0].classList.add(`view-switch__item--active`);
    menu.children[1].classList.remove(`view-switch__item--active`);
    main.classList.remove(`visually-hidden`);
  }
});



const daysOfWeek = {'Sun': 'Вс', 'Mon': 'Пн', 'Tue' : 'Вт', 'Wed': 'Ср', 'Thu': 'Чт', 'Fri' : 'Пт', 'Sat' : 'Сб' };
const months = {'January': 'Январь', 'February': 'Февраль', 'March':'Март', 'April': 'Апрель', 'May': 'Май', 'June' : 'Июнь', 'July':'Июль', 'August':'Август', 'September':'Сентябрь', 'October':'Октябрь', 'November': 'Ноябрь', 'December':'Декабрь'};
const monthsAbbreviated = {'Jan': 'Янв', 'Feb': 'Февр', 'Mar':'Март', 'Apr': 'Апр', 'May': 'Май', 'Jun' : 'Июнь', 'Jul':'Июль', 'Aug':'Авг', 'Sept':'Сент', 'Oct':'Окт', 'Nov': 'Нояб', 'December':'Дек'};
		const prepareDataElement = ({label, startDate, endDate, duration}) => {

if (startDate){
	 startDate = moment(startDate);
	 }

if (endDate) endDate = moment(endDate);

if (startDate && !endDate && duration) {
	endDate = moment(startDate);
	endDate.add(duration[0], duration[1]);
}

if (!startDate && endDate && duration) {
	startDate = moment(endDate);
	startDate.subtract(duration[0], duration[1]);
}

return {
	label,
	startDate,
	endDate,
	duration,
};
};

const findDateBoundaries = data => {
let minStartDate, maxEndDate;

data.forEach(({ startDate, endDate }) => {
	if (!minStartDate || startDate.isBefore(minStartDate)) minStartDate = moment(startDate);

	if (!minStartDate || endDate.isBefore(minStartDate)) minStartDate = moment(endDate);

	if (!maxEndDate || endDate.isAfter(maxEndDate)) maxEndDate = moment(endDate);

	if (!maxEndDate || startDate.isAfter(maxEndDate)) maxEndDate = moment(startDate);
});

return {
	minStartDate,
	maxEndDate
};
};


const sortElementsByEndDate = data =>
data.sort((e1, e2) => {
	if (e1.endDate.isBefore(e2.endDate))
		return -1;
	else
		return 1;
});

const parseUserData = data => data.map(prepareDataElement);

const createElementData = (data, elementHeight, xScale, fontSize) =>
data.map((d, i) => {
	const x = xScale(d.startDate.toDate());
	const xEnd = xScale(d.endDate.toDate());
	const y = i * elementHeight * 1.5;
	const width = xEnd - x;
	const height = elementHeight;

	const charWidth = (width / fontSize);

	const tooltip = d.label;

	const singleCharWidth = fontSize * 0.5;
	const singleCharHeight = fontSize * 0.45;

	let label = d.label;
//console.log(label);
	if (label.length > charWidth) {
		label = label.split('').slice(0, charWidth - 3).join('') + '...';
	}

	const labelX = x + ((width/2) - ((label.length / 2) * singleCharWidth));
	const labelY = y + ((height / 2) + (singleCharHeight));
	//let color = ['red', 'yellow', 'blue', 'grey'][Math.floor(Math.random()*4)];

	return {
		x,
		y,
		xEnd,
		width,
		height,
		label,
		labelX,
		labelY,
		tooltip,
	};
});

const createChartSVG = (data, placeholder, { svgWidth, svgHeight, elementHeight, scaleWidth, scaleHeight, fontSize, minStartDate, maxEndDate, margin, showRelations }) => {

// create container element for the whole chart
const svg = d3.select(placeholder).append('svg').attr('width', svgWidth).attr('height', svgHeight);

console.log(minStartDate.toDate());

//.domain([minStartDate, maxEndDate])

const xScale = d3.scaleTime()
	.domain([minStartDate, maxEndDate])
	.range([0, scaleWidth]);
// prepare data for every data element
const rectangleData = createElementData(data, elementHeight, xScale, fontSize);
//console.log(rectangleData[0]);
const names = rectangleData.map((elem)=> elem.tooltip);

const uniqNames = (names) => {
	const obj = {};
	for (const name of names){
		obj[name] = true;
	}
	return Object.keys(obj);
};

const allNames = uniqNames(names);

for (const name of allNames) {
	const equalDataPoints = rectangleData.filter((dataPoint) => dataPoint.tooltip == name);

	if (equalDataPoints.length != 1) {
		const y = equalDataPoints[0].y;
		const labelY = equalDataPoints[0].labelY;
		//console.log(equalDataPoints[0].labelX);
		for (const dataPoint of equalDataPoints) {
			dataPoint.y = y;
			dataPoint.labelY = labelY;
		}
	}
}
// create data describing connections' lines
const xAxis = d3.axisBottom(xScale);
// create container for the data
const g1 = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
const barsContainer = g1.append('g').attr('transform', `translate(0,${margin.top})`);
g1.append('g').call(xAxis);

const massivG = document.querySelectorAll('g.tick');

for (const g of massivG){
	const text = g.querySelector('text');
	const [Day, Num] = text.innerHTML.split(' ');
	if (Object.keys(daysOfWeek).indexOf(Day) != -1) {
		text.innerHTML = daysOfWeek[Day] + ' ' + Num;
	} else if (Object.keys(months).indexOf(Day) != -1) {
		text.innerHTML = months[Day];
	} else if (Object.keys(monthsAbbreviated).indexOf(Day) != -1) {
		text.innerHTML = monthsAbbreviated[Day] + ' ' + Num;
	}
}
// create axes
const bars = barsContainer
	.selectAll('g')
	.data(rectangleData)
	.enter()
	.append('g');

// add stuff to the SVG

bars
	.append('rect')
	// .attr('rx', elementHeight / 2)
	// .attr('ry', elementHeight / 2)
	.attr('class', d => d.tooltip)
	.attr('x', d => d.x)
	.attr('y', d => d.y)
	.attr('width', d => d.width)
	.attr('height', d => d.height)
	.style('fill', "grey");

bars
	.append('text')
	.style('fill', 'black')
	.style('font-family', 'sans-serif')
	.attr('x', d => d.labelX)
	.attr('y', d => d.labelY)
	.text(d => d.label);

bars
	.append('title')
	.text(d => d.tooltip);
};

const createGanttChart = (placeholder, data, { elementHeight, sortMode, svgOptions }, int = 3) => {
// prepare data
const margin = (svgOptions && svgOptions.margin) || {
	top: elementHeight * 2,
	left: elementHeight * 2,
};

const scaleWidth = ((svgOptions && svgOptions.width) || 600) - (margin.left * 2);
const scaleHeight = Math.max((svgOptions && svgOptions.height) || 200, data.length * elementHeight * 2) - (margin.top * 2);

const svgWidth = scaleWidth + (margin.left * 2);
const svgHeight = scaleHeight + (margin.top * 2);

const fontSize = (svgOptions && svgOptions.fontSize) || 12;

data = parseUserData(data); // transform raw user data to valid values
//data = sortElementsByEndDate(data); сортировка элементов, можно потом удалить
const { minStartDate, maxEndDate } = findDateBoundaries(data);

// add some padding to axes
minStartDate.subtract(2-int, 'days');
maxEndDate.add(int, 'days');

createChartSVG(data, placeholder, { svgWidth, svgHeight, scaleWidth, elementHeight, scaleHeight, fontSize, minStartDate, maxEndDate, margin,});
};

const data = [{
startDate: '2017-02-23',
endDate: '2017-03-05',
label: 'worker W',
info: 'about Worker W',
},{
endDate: '2017-03-17',
duration: [5, 'days'],
label: 'worker S',
info: 'about Worker S',
},{
duration: [7, 'days'],
endDate: '2017-03-24',
label: 'worker W',
info: 'about Worker W',
}, {
startDate: '2017-02-27',
duration: [12, 'days'],
label: 'worker Q',
info: 'about Worker Q',
}, {
endDate: '2017-03-19',
duration: [1, 'days'],
label: 'worker S',
info: 'about Worker S',
}];

createGanttChart(document.querySelector('.GantGraph'), data, {
elementHeight: 20,
sortMode: 'date', // alternatively, 'childrenCount'
svgOptions: {
	width: 1100,
	height: 400,
	fontSize: 14
}
}, 0);



let ii = 0;
const buttonPlus = document.querySelector('.plus');
buttonPlus.addEventListener('click',() => {
	ii++;
	if(document.querySelector('svg')) {
	  document.querySelector('.GantGraph').removeChild(document.querySelector('svg'));
	}
	createGanttChart(document.querySelector('.GantGraph'), data, {
	  elementHeight: 20,
      sortMode: 'date', // alternatively, 'childrenCount'
      svgOptions: {
	  width: 1100,
	  height: 400,
	  fontSize: 14
    }}, ii);

});

const buttonMinus = document.querySelector('.minus');
buttonMinus.addEventListener('click',() => {
	ii--;
	if(document.querySelector('svg')) {
	  document.querySelector('.GantGraph').removeChild(document.querySelector('svg'));
	}
	createGanttChart(document.querySelector('.GantGraph'), data, {
	  elementHeight: 20,
      sortMode: 'date', // alternatively, 'childrenCount'
      svgOptions: {
	  width: 1100,
	  height: 400,
	  fontSize: 14
    }}, ii);

});

const point = document.querySelector('.GantGraph');
const body = document.querySelector('body');
body.addEventListener('click', evt => {
	if (evt.target.tagName == 'rect') {
		const filteredData = data.filter((point) => point.label == evt.target.classList.value);
		let information = ``;
		filteredData.map((point) => information += point.info + ' ');
		point.innerHTML = ``;
		point.innerHTML = information;
		console.log(filteredData, evt.target.classList.value, information);
	}
});

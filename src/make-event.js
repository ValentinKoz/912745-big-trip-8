function getEvent(icon = `🚗`, title = `Drive to Chamonix`, timetable = `10:00&nbsp;&mdash; 11:00`, duration = `1h 30m`, price = `&euro;&nbsp;20`, offerOne = `Rent a car +&euro;&nbsp;200`, offerTwo = `Order UBER +&euro;&nbsp;20`) {
  return `
    <article class="trip-point">
      <i class="trip-icon">${icon}</i>
      <h3 class="trip-point__title">${title}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${timetable}</span>
        <span class="trip-point__duration">${duration}</span>
      </p>
      <p class="trip-point__price">${price}</p>
      <ul class="trip-point__offers">
        <li>
          <button class="trip-point__offer">${offerOne}</button>
        </li>
        <li>
          <button class="trip-point__offer">${offerTwo}</button>
        </li>
      </ul>
    </article>`;
}

export default getEvent;

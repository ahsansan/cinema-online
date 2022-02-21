export function getFullTime(timeString) {
  const time = new Date(timeString);
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date = time.getDate();
  const monthIndex = time.getMonth();
  const year = time.getFullYear();
  const dayIndex = time.getDay();

  const result = `${weekday[dayIndex]}, ${date} ${month[monthIndex]} ${year}`;

  return result;
}

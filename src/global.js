// function formatDate(dateObject = new Date()) {
//   const formattedDateString = `${dateObject.getFullYear()}-${(
//     dateObject.getMonth() + 1
//   )
//     .toString()
//     .padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`;

//   return formattedDateString;
// }

function formatDate(date = new Date()) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// const SYSTEM_URL = "http://38.180.105.203:8000/";
const SYSTEM_URL = "http://localhost:8000/";
// const SYSTEM_URL = "http://18.158.82.59:8001/";

export { formatDate, SYSTEM_URL };

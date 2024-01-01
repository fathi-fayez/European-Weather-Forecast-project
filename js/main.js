let cities = document.getElementById("cities");
let dataDisplay = document.getElementById("Forecast-data");

// Add cities name to select input
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      cities.innerHTML += `<option value= "${data[i].city}, ${data[i].country}">${data[i].city}, ${data[i].country}</option>`;
    }
  })
  .catch((error) => {
    console.log("Error fetching data:", error);
  });

function search() {
  showLoader();
  const selectedCity = document.getElementById("cities").value; // Get the selected city from the dropdown

  // Fetching latitude and longitude based on the selected city from your data
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const selectedLocation = data.find(
        (item) => `${item.city}, ${item.country}` === selectedCity
      );
      if (selectedLocation) {
        const { latitude, longitude } = selectedLocation;

        // Now that you have latitude and longitude, make the weather API call
        fetch(
          `https://www.7timer.info/bin/civillight.php?lon=${longitude}&lat=${latitude}&ac=0&unit=metric&output=json&tzshift=0`
        )
          .then((response) => response.json())
          .then((data) => {
            // Process the received weather data
            displayData(data.dataseries);
            hideLoader();
          })
          .catch((error) => {
            console.log("Error fetching weather data:", error);
            hideLoader();
          });
      } else {
        console.log("Coordinates for the selected city not found in the data.");
      }
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      hideLoader();
    });
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function displayData(data) {
  // Displaying data in a list
  const dataList = document.createElement("div");
  data.forEach((item) => {
    const listItem = document.createElement("div");
    listItem.classList.add("a-day");
    const itemDateContainer = document.createElement("div");
    const itemDate = item.date.toString();

    // Parse the date string into year, month, and day
    const year = itemDate.slice(0, 4);
    const month = itemDate.slice(4, 6);
    const day = itemDate.slice(6);

    // Create a Date object with the parsed values
    const formattedDate = new Date(`${year}-${month}-${day}`);

    // Convert the Date object to a desired format (e.g., MM/DD/YYYY)
    const displayDate = formattedDate.toLocaleDateString("en-US");
    itemDateContainer.textContent = displayDate;

    // Display the formatted date on the page
    const itemWeather = document.createElement("div");
    itemWeather.textContent = item.weather;
    const itemTemp2m = document.createElement("div");
    itemTemp2m.innerHTML = `<span> H: ${item.temp2m.max} °C</span><br><span> L: ${item.temp2m.min} °C</span>`;
    listItem.appendChild(itemDateContainer);
    listItem.appendChild(itemWeather);
    listItem.appendChild(itemTemp2m);
    dataList.appendChild(listItem);
  });
  // Add the list to the page
  dataDisplay.innerHTML = dataList.innerHTML;
}

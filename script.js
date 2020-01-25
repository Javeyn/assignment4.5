$(function () {
  const apikey = '33bab16b78219638976c75dc129cd686';
  const CURRENT_WEATHER = `https://api.openweathermap.org/data/2.5/weather?appid=${apikey}&units=imperial&q=`;
  const FIVE_DAY_WEATHER = `https://api.openweathermap.org/data/2.5/forecast?appid=${apikey}&units=imperial&q=`;
  
  let userInput;
  let date = moment().format('MMM Do YYYY');
  
  logPopular();
  getData();

  function getData() {
    if (userInput) {
      $.when(
        $.get(`${CURRENT_WEATHER}${userInput}`),
        $.get(`${FIVE_DAY_WEATHER}${userInput}`)
      ).then(function (current_data, five_day_data) {
        // console.log(current_data);
        // console.log(five_day_data);

        $('#five-day-data-here').empty();
        mineData(current_data, five_day_data);
      })
    }

    $('#user-input').keyup(function (e) {
      if (e.keyCode === 13 && $('#user-input').val()) {
        $('#search-button').click();
      }
    })

    $('#search-button').click(function (e) {
      e.preventDefault();
      userInput = $('#user-input').val().trim();
      $('#five-day-data-here').empty();
      captureRecentSearch(userInput);
      $('#user-input').val('');

      $.when(
        $.get(`${CURRENT_WEATHER}${userInput}`),
        $.get(`${FIVE_DAY_WEATHER}${userInput}`)
      ).then(function (current_data, five_day_data) {

        mineData(current_data, five_day_data);
      })
    })
  }

  function mineData(data, moreData) {
    let currentCity = data[0];
    let fiveDay = moreData[0];
    let cityIcon = data[0].weather[0].icon;
    const ICON_URL = `http://openweathermap.org/img/wn/${cityIcon}@2x.png`;

    $('#main-city').text(currentCity.name + ',  ' + date);
    $('#icon-image').attr({ 'src': ICON_URL, 'alt': 'weather icon' });
    $('#temperature').text(`Temperature:  ${currentCity.main.temp} °F`);
    $('#humidity').text(`Humidity:  ${currentCity.main.humidity} %`);
    $('#wind-speed').text(`Wind Speed:  ${currentCity.wind.speed} MPH`);
    $('#current-conditions').text(`Currently: ${currentCity.weather[0].description}`);

    createFiveDay();

    function createFiveDay() {
      let dataMiner = 0;

      for (let i = 0; i < 5; i++) {
        let weatherBoxColumn = $('<div class="col text-center weather-box-column">');
        let weatherBox = $(`<div class='border five-day-data' id=${i}>`);
        let fiveDayDate = $(`<h3 id=five-day-date-${i}>`);
        let fiveDayIcon = $(`<img id=five-day-icon-${i}>`);
        let fiveDayTemp = $(`<h5 id=five-day-temperature-${i}>`);

        weatherBox.append(fiveDayDate, fiveDayIcon, fiveDayTemp);
        weatherBoxColumn.append(weatherBox);
        let fiveIcon = moreData[0].list[dataMiner].weather[0].icon;
        const FIVE_DAY_ICON_URL = `http://openweathermap.org/img/wn/${fiveIcon}@2x.png`;

        $('#five-day-data-here').append(weatherBoxColumn);
        $(`#five-day-date-${i}`).text(moment().add(i, 'days').format('MMM D'));
        $(`#five-day-icon-${i}`).attr({ 'src': FIVE_DAY_ICON_URL, 'alt': 'weather icon' });
        $(`#five-day-temperature-${i}`).text(`${fiveDay.list[dataMiner].main.temp} °F`);
        dataMiner += 9;
      }
    }
  }

  function logPopular() {
    $('#favorite-cities-here').empty();
    var tempArr = ['AUSTIN', 'CHICAGO', 'NEW YORK', 'ORLANDO', 'SAN FRANCISCO', 'SEATTLE', 'DENVER', 'LOS ANGELES', 'PHOENIX', 'HOUSTON', 'BOSTON'];

    for (let i = 0; i < tempArr.length; i++) {
      let newRecentRow = $(`<div class="row p-1 recent-row"id=recent-row-${i}>`);
      let newRecentColumn = $(`<div class="col pl-3 recent-search" id=recent-search-${i}>`).text(tempArr[i]);
      newRecentRow.append(newRecentColumn);
      $('#favorite-cities-here').append(newRecentRow);

      newRecentRow.click(function (e) {
        e.preventDefault();
        userInput = this.textContent;
        getData();
      })
    }

    displayRecents();

    function displayRecents() {
      var help = 0;
      for (let i = localStorage.length; i > 0; i--) {
        console.log(localStorage.getItem(help));
        if (localStorage.getItem(help)) {
          let stored = localStorage.getItem(help);
          // console.log(stored);
          $(`#recent-search-${help}`).text(stored);
        }
        help++;
      }
    }
  }

  function captureRecentSearch(somecity) {
    console.log('hit');
    somecity = somecity.toUpperCase();
    localStorage.setItem(localStorage.length, somecity);
    logPopular();
  }


  // localStorage.setItem(recent.toUpperCase(), recent.toUpperCase());



















});
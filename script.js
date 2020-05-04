$(document).ready(function () {
    var APIkey = "fc00b9c1092232eedaa75a3e1ce4f4b1";
    var latitude;
    var longitude;
    var clickedCity;
    var current_date = moment().format("L");
    var search_history = [];

  
    function renderWeather() {
        var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + clickedCity + "&units=imperial&APPID=" + APIkey;
        
        $.ajax({
            url:weatherURL, 
            method:"GET"
        }).then(function(response){
            console.log(response)
            $("#currentWeather").empty();
            latitude = response.city.coord.lat;
            longitude = response.city.coord.lon;
            console.log(latitude);
            console.log(longitude);
            
            var cityEl = $("<h2 id='city-name'>") ;
            var tempEl = $("<p id='temp-name'>") ;
            var humidityEl = $("<p id='humidity-name'>") ;
            var windSpeedEl = $("<p id='windspeed-name'>") ;

            var weatherData = "http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + ".png";
            var cityData = response.city.name;
            var tempData = response.list[0].main.temp;
            var humidityData = response.list[0].main.humidity;
            var windSpeedData = response.list[0].wind.speed;

            var weatherIcon = $("<img>").attr("src", weatherData);
            cityEl.text(cityData);
            tempEl.text("Temperature: " + tempData + String.fromCharCode(176) + "F");
            humidityEl.text("Humidity: "+ humidityData + "%");
            windSpeedEl.text("Windspeed: "+ windSpeedData +"MPH");

            $("#currentWeather").append(cityEl);
            $("#currentWeather").append(weatherIcon);
            $("#currentWeather").append(tempEl);
            $("#currentWeather").append(humidityEl);
            $("#currentWeather").append(windSpeedEl);
            $("#five-day-deck").empty();
            for ( i= 1; i < 6; i++) {
               var forecastDate = moment().add(i,'days').format('L');
               var forecastCol = $("<div class='col'>");
               var forecastCard =  $("<div class='card'>");
               var forecastHeader = $("<div class='card-header'>");
               var forecastBody = $("<div class='card-body'>");
               var dateData = $ ("<p>").text(forecastDate);

                forecastBody.append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastHeader);
                forecastHeader.append(dateData);

               var forecastweatherData = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png";
               var forecasttempData = response.list[i].main.temp;
               var forecasthumidityData = response.list[i].main.humidity;
               
               var forecastweathericon = $("<img>").attr("src",forecastweatherData);
               var forecasttempEl = $("<p>").text("Temperature: " + forecasttempData + String.fromCharCode(176) + "F");
               var forecasthumidityEl = $("<p>").text("Humidity: " + forecasthumidityData + "%");
               $("#five-day-deck").append(forecastCard);
               forecastCard.append(forecastBody);
               forecastBody.append(forecastweathericon,forecasttempEl,forecasthumidityEl);
                
            }

            RenderUvi();
        })
        
        
    }

    function RenderUvi() {
        var UviURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIkey + "&lat=" + latitude + "&lon=" + longitude;
        $.ajax({
            url: UviURL, 
            method: "GET"
        }).then(function(response){
            console.log(response[0].value);
            var uviData = response[0].value;
            var uviEl = $("<p id='uvi-name'>") ;
            uviEl.text("UV Index: " + uviData);
            if (uviData < 7) {
                uviEl.addClass("low");
                uviEl.removeClass("high");
            } else {
                uviEl.addClass("high");
                uviEl.removeClass("low");
            }
            $("#currentWeather").append(uviEl);
        })
    }
    
    function storagecheck(){
        var storedData =JSON.parse(localStorage.getItem("searchHistory"));
        if (storedData!==null){
            search_history = storedData;
        } 
        renderButtons();
    }
    function renderButtons() {

      $("#city-list").html("");
      
      for (var i = 0; i < search_history.length; i++) {
         var city = search_history[i];
         var genbutton = $("<button>");
         genbutton.addClass("btn btn-primary genbtn");
         genbutton.attr("data-name",city);
         genbutton.text(city);
         $("#city-list").prepend(genbutton); 
      }
    }
    

    //put the listener on btn class so that all buttons have listener

    $("#city-list").on("click", "button", function(event) {
        event.preventDefault();
        clickedCity=$(this).attr("data-name");
        console.log (clickedCity);
        renderWeather();    })

    $("#clear-city-names").on("click", function(event) {
        event.preventDefault(); 
        $("#city-input").val("");
        localStorage.clear();
        search_history =[];
        $("#city-list").html("");
        renderButtons();

    })
    
    ;$("#find-city").on("click", function(event) {
        event.preventDefault();
        var searchVal = ($("#city-input").val().toUpperCase());
        if (searchVal === "") {
        return;
        }
        search_history.push(searchVal);
        localStorage.setItem("searchHistory", JSON.stringify(search_history));
        $("#find-city").val("");
        renderButtons();
    })
    storagecheck();
})
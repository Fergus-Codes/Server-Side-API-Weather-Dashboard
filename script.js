const apiKey = '5e8a81a25717c672f8699ef9f69d47fa';
var listedCities =$("#city-list");
var citiesArray = [];


function storeCities(){
localStorage.setItem("citiesArray", JSON.stringify(citiesArray));
}


function addCitiesToLi() {
    listedCities.empty();
    for (var i = 0; i < citiesArray.length; i++) {
      var city = citiesArray[i];
      
      var li = $("<li>").text(city);
      li.attr("id","listC");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      listedCities.prepend(li);
    }

    if (!city){
        return
    } 
    else{
        getResponseWeather(city)
    };
}   


  $("#add-city").on("click", function(event){
      event.preventDefault();


    var city = $("#city-input").val().trim();
    

    if (city === "") {
        return;
    }

    citiesArray.push(city);

  storeCities();
  addCitiesToLi();
  });


  
  function getResponseWeather(cityName){
    var apiCallURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey; 


    $("#todays-weather").empty();
    $.ajax({
      url: apiCallURL,
      method: "GET"
    }).then(function(response) {
        


    var longitudeCoordinates = response.coord.lon;
    var latitudeCoordinates = response.coord.lat;  
      cityTitle = $("<h3>").text(response.name + " "+ FormatDay());
      $("#todays-weather").append(cityTitle);
      var TempetureToNum = parseInt((response.main.temp)* 9/5 - 459);
      var cityTemperature = $("<p>").text("Current tempeture: "+ TempetureToNum + " Degrees");
      $("#todays-weather").append(cityTemperature);
      var cityHumidity = $("<p>").text("Current humidity: "+ response.main.humidity + " %");
      $("#todays-weather").append(cityHumidity);
      var cityWindSpeed = $("<p>").text("Current wind Speed: "+ response.wind.speed + "K/PH");
      $("#todays-weather").append(cityWindSpeed);
      
    

        var apiCallLonLat = "https://api.openweathermap.org/data/2.5/uvi?appid="+ apiKey + "&lat=" + latitudeCoordinates +"&lon=" + longitudeCoordinates;
        $.ajax({
            url: apiCallLonLat,
            method: "GET"
        }).then(function(responseuv) {
            var searchedCityUV = $("<span>").text(responseuv.value);
            var searchedCityUVp = $("<p>").text("Current UV Index: ");
            searchedCityUVp.append(searchedCityUV);
            $("#todays-weather").append(searchedCityUVp);
        });
    
    
var apiCallCity5day = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
$.ajax({
  url: apiCallCity5day,
  method: "GET"
    }).then(function(response5day) { 
         $("#boxes").empty();
        for(var i=0, j=0; j<=5; i=i+6){
            var getThedate = response5day.list[i].dt;
            if(response5day.list[i].dt != response5day.list[i+1].dt){
                var fiveDayReportDiv = $("<div>");
                fiveDayReportDiv.attr("class","col-3 m-2 bg-white")
                var d = new Date(0); 
                d.setUTCSeconds(getThedate);
                var date = d;
                var month = date.getMonth()+1;
                var day = date.getDate();
                var dateOutput = date.getFullYear() + '-' +
                (month<10 ? '0' : '') + month + '-' +
                (day<10 ? '0' : '') + day;
                var fiveDayReporth4 = $("<h6>").text(dateOutput);
                var weatherIconGif = $("<img>");
                var weatherConditions = response5day.list[i].weather[0].main;

                // Get the incons for the different weather conditions
                if(weatherConditions==="Clouds"){
                        weatherIconGif.attr("src", "./assets/icons8-partly-cloudy-day.gif")
                    } else if(weatherConditions==="Clear"){
                        weatherIconGif.attr("src", "./assets/icons8-summer.gif")
                    }else if(weatherConditions==="Rain"){
                        weatherIconGif.attr("src", "./assets/icons8-light-rain.gif")
                    }


                var temperatureDegF = response5day.list[i].main.temp;
                var TempetureToNum = parseInt((temperatureDegF)* 9/5 - 459);
                var temperatureInDegF = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
                var pHumidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + " %");

                //Append the report h4, the Gif icons, temperature & Humidity
                fiveDayReportDiv.append(fiveDayReporth4);
                fiveDayReportDiv.append(weatherIconGif);
                fiveDayReportDiv.append(temperatureInDegF);
                fiveDayReportDiv.append(pHumidity);
                $("#boxes").append(fiveDayReportDiv);
                j++;
                }
            
        }
      
    });
      

    });
    
  }

  function FormatDay(date){
    var date = new Date();
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    var dateOutput = date.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;
    return dateOutput;
}

  $(document).on("click", "#listC", function() {
    var thisCity = $(this).attr("data-city");
    getResponseWeather(thisCity);
  });

  function init(){

    var storedCities = JSON.parse(localStorage.getItem("citiesArray"));


    if (storedCities !== null) {
        citiesArray = storedCities;
      }

    addCitiesToLi();

}

  init();
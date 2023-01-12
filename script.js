var apiKey = "IIgtBoGEsnf68Me23pXpWGZnkn5vaiyA";
var city; //takes input from search bar //Brunswick
var submitButtonEl = document.getElementById('search-btn-1');
var locationKey;
var maxTemp;
var maxUnit; 
var minTemp;
var minUnit;
var forecastDate;
var searchValue;


submitButtonEl.addEventListener('click',function(){
    //console.log("Test click"); 

    var searchInputVal = document.getElementById('search-location-1').value;
    //console.log(searchInputVal); 
    getApi(searchInputVal) 

})

function getApi(searchValue){

    //console.log(searchValue); 
    city = searchValue;
    var requestUrl = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?q=" + city + "&apikey=" + apiKey;

    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        
        for(var i=0; i < data.length; i++)
        {

            if(data[i].Country.ID == 'AU' && data[i].LocalizedName == city)
            {
                //countryID = data[i].Country.ID;
                locationKey = data[i].Key;
                getForecastApi();
            }    
        }   
    });    
}



function getForecastApi(){
    console.log(locationKey);
    var dateArray;
    var newDate;
    var weatherContent = document.querySelector('#container-weather');
    
    

    // make call to another api using location key

    //var apiKey = "IIgtBoGEsnf68Me23pXpWGZnkn5vaiyA";
    var requestUrl = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locationKey + "?apikey=" + apiKey;

    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        //console.log(data.DailyForecasts[0].Temperature);

        for(var i=0; i < 5; i++){
            //console.log('Test');

            forecastDate = data.DailyForecasts[i].Date;
            dateArray = forecastDate.split("T")
            newDate = dateArray[0]

            maxTemp = data.DailyForecasts[i].Temperature.Maximum.Value
            maxUnit = data.DailyForecasts[i].Temperature.Maximum.Unit

            maxTemp = maxTemp + " " +  maxUnit;

            minTemp = data.DailyForecasts[i].Temperature.Minimum.Value
            minUnit = data.DailyForecasts[i].Temperature.Minimum.Unit

            minTemp = minTemp + " " + minUnit;

            var icon = 'https://developer.accuweather.com/weather-icons/' + i + '.Icon';

            console.log(newDate); // replace with creating div tags for each result 
            console.log(maxTemp);
            console.log(minTemp);
            console.log(icon);

            // card container for the weather forecast body 
            var resultCard = document.createElement('div'); // card // csss for this card

            // body container for forecast content 
            var resultBody = document.createElement('div'); // body of the card // css for body card 

            resultCard.append(resultBody); // appends the body to that card 

            var titleEl = document.createElement('h3'); // creates the elemnets fior the body
            titleEl.textContent = "Weather Forecast";
            
            var bodyContentEl = document.createElement('p');
            bodyContentEl.innerHTML = '<strong>Date:</strong>' + newDate + '<br/>';
            bodyContentEl.innerHTML += '<strong>Maximum Temp:</strong>' + maxTemp + '</br>';
            bodyContentEl.innerHTML += '<strong>Minimum Temp:</strong>' + minTemp + '</br>';

            resultBody.append(titleEl, bodyContentEl); // appends the date, temp to the body 
            weatherContent.append(resultCard); // append the card to the div in the html 
            
        }

    });
}

//getApi();

window.onload = initMap;

let map;
let service;
let locationResults;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -37.8136, lng: 144.9631 },
    zoom: 13,
  });

  var marker = new google.maps.Marker({
    position: { lat: -37.8136, lng: 144.9631 },
    map: map,
  });

  function moveToLocation() {
    var location = document.getElementById("search-location-1").value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, function (results, status) {
      if (status === "OK") {
        map.setCenter(results[0].geometry.location);
        locationResults = results[0].geometry.location;
        searchWalkingTrails();
      } else {
        alert("Geocode was not successful for this location");
      }
    });
  }

  function searchWalkingTrails() {
    var request = {
      location: locationResults,
      radius: 10000, // 10 km
      types: ["park"],
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  }

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        document.getElementById("container trail").innerHTML = "";
        var counter =0;
      for (var i = 0; i < results.length; i++) {
        if (counter >= 3) {
            break;
        }
        var place = results[i];
        createMarker(results[i]);
        console.log(place);
        var result = document.createElement("div");
        result.classList.add("result-item");
        result.innerHTML += "<img src='" + place.photos[0].getUrl() + "' alt='" + place.name + "'>";
        result.innerHTML += "<p>" + place.name + "</p>";
        result.innerHTML += "<p>" + place.vicinity + "</p>";
        document.getElementById("container trail").appendChild(result);
        counter++;
      }
    }
  }

  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: './icons8-oak-tree-30.png',
    });
  }
  document
    .getElementById("search-btn-1")
    .addEventListener("click", function () {
      moveToLocation();
    });
}


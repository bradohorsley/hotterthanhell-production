
// Import stylesheets
import "./style.scss";
// Import Jquery
import $ from "jquery";
//import bootstrap
import "bootstrap";
// Import Icon JSON
import "./icons.js";

//Add into Head Tag
$("head").append("<title>Hotter Than Hell?</title>")
.append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">")
.append("<script>!function(e,t,n,c,o,a,f){e.fbq||(o=e.fbq=function(){o.callMethod?o.callMethod.apply(o,arguments):o.queue.push(arguments)},e._fbq||(e._fbq=o),o.push=o,o.loaded=!0,o.version=\"2.0\",o.queue=[],(a=t.createElement(n)).async=!0,a.src=\"https://connect.facebook.net/en_US/fbevents.js\",(f=t.getElementsByTagName(n)[0]).parentNode.insertBefore(a,f))}(window,document,\"script\"),fbq(\"init\",\"495252831702538\"),fbq(\"track\",\"PageView\");</script><noscript><img height=\"1\" width=\"1\" style=\"display:none\" src=\"https://www.facebook.com/tr?id=495252831702538&ev=PageView&noscript=1\"/></noscript>");
//.append("<script src=\"https://kit.fontawesome.com/e479f9a071.js\" crossorigin=\"anonymous\"></script>");
//Add Firebase and Analytics
//$("head").append("<script src=\"https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js\"></script>").append("<script src=\"https://www.gstatic.com/firebasejs/7.18.0/firebase-analytics.js\"></script>");

var iconsjson = localStorage.getItem("iconsjson");
var weatherIcons = JSON.parse(iconsjson);
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var months = [
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
  "December"
];
var hell;
var owid = "ab2648b7507d47338137dd253097df5c";
var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

$(function() {

 /* var firebaseConfig = {
    apiKey: "AIzaSyDLKYSJjBfjHQlhGz6Zwhp0k2cS3NrrzLM",
    authDomain: "hotter-than-hell.firebaseapp.com",
    databaseURL: "https://hotter-than-hell.firebaseio.com",
    projectId: "hotter-than-hell",
    storageBucket: "hotter-than-hell.appspot.com",
    appId: "1:631311706265:web:e25bab8e0003f9d5137008",
    measurementId: "G-FD4FVC4HMY"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics(); */

  $("#alert-container").html("<div class=\"alert alert-danger\" role=\"alert\">We couldn't find the weather in that location.</div>")

  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/weather?&lat=42.4348&lon=-83.9849&appid=" +
      owid,
    success: function(result) {
      var dt = new Date((result.dt + result.timezone) * 1000);
      var celcius = Math.round(result["main"].temp - 273.15);
      var farenheight = Math.round(celcius * 1.8 + 32);
      var rise = new Date((result["sys"].sunrise + result.timezone) * 1000);
      var set = new Date((result["sys"].sunset + result.timezone) * 1000);
      var data = [
        {
          location: "Hell, USA",
          date:
            days[dt.getDay()] +
            " " +
            dt.getDate() +
            " " +
            months[dt.getMonth()],
          time:
            dt.getHours() +
            ":" +
            (dt.getMinutes() < 10 ? "0" : "") +
            dt.getMinutes(),
          description: result.weather[0].description,
          icon: getIcon(result.weather[0].id),
          temperature: result["main"].temp,
          celcius: celcius,
          farenheight: farenheight,
          wind: result["wind"].speed,
          humidity: result["main"].humidity,
          sunrise:
            rise.getHours() +
            ":" +
            (rise.getMinutes() < 10 ? "0" : "") +
            rise.getMinutes(),
          sunset:
            set.getHours() +
            ":" +
            (set.getMinutes() < 10 ? "0" : "") +
            set.getMinutes()
        }
      ];
      hell = data;
      addWeatherCard(hell[0]);
    },
    error: function(xhr, status, error) {
      console.log(error);
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      fetchAndShowWeather(lat, lon);
    },function(error){
      switch(error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      $('#getlocation').modal();
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      $('#getlocation').modal();
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      $('#getlocation').modal();
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      $('#getlocation').modal();
      break;
  }
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
    console.log(navigator.error);
      $('#getlocation').modal();
  }

$("#get-manual-location").click(function(){
  var q = $("#manual-location").val();
  console.log(q);
  manualFetchAndShowWeather(q);
});

  //Change the temp from C to F
  $("#weather-cards-container").on('click','.c-control',function(){
    var parent = $(this).parent().parent();
    parent.find(".celcius").removeClass("hidden");
    parent.find(".farenheight").addClass("hidden");
    $(this).removeClass("not-in-use");
    parent.find(".f-control").addClass("not-in-use");


  });
  $("#weather-cards-container").on('click','.f-control',function(){
    var parent = $(this).parent().parent();
    parent.find(".celcius").addClass("hidden");
    parent.find(".farenheight").removeClass("hidden");
    $(this).removeClass("not-in-use");
    parent.find(".c-control").addClass("not-in-use");
  });
});

function addWeatherCard(data) {
  var weatherCard = $("template#weather-card").html();
  var card = weatherCard
    .replace(/{{location}}/gi, data.location)
    .replace(/{{date}}/gi, data.date)
    .replace(/{{time}}/gi, data.time)
    .replace(/{{description}}/gi, data.description)
    .replace(/{{icon}}/gi, data.icon)
    .replace(/{{celcius}}/gi, data.celcius)
    .replace(/{{farenheight}}/gi, data.farenheight)
    .replace(/{{wind}}/gi, data.wind)
    .replace(/{{humidity}}/gi, data.humidity)
    .replace(/{{sunrise}}/gi, data.sunrise)
    .replace(/{{sunset}}/gi, data.sunset);
  $("#weather-cards-container").prepend(card);
}

function getIcon(code) {
  var prefix = "wi wi-";
  var icon = weatherIcons[code].icon;
  // If we are not in the ranges mentioned above, add a day/night prefix.
  if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
    icon = "day-" + icon;
  }
  // Finally tack on the prefix.
  icon = prefix + icon;
  return icon;
}

function fetchAndShowWeather(lat, long) {
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/weather?&lat=" +
      lat +
      "&lon=" +
      long +
      "&appid=" +
      owid,
    success: function(result) {
      var dt = new Date((result.dt + result.timezone) * 1000);
      var celcius = Math.round(result["main"].temp - 273.15);
      var farenheight = Math.round(celcius * 1.8 + 32);
      var rise = new Date((result["sys"].sunrise + result.timezone) * 1000);
      var set = new Date((result["sys"].sunset + result.timezone) * 1000);
      var data = [
        {
          location: result.name,
          date:
            days[dt.getDay()] +
            " " +
            dt.getDate() +
            " " +
            months[dt.getMonth()],
          time:
            dt.getHours() +
            ":" +
            (dt.getMinutes() < 10 ? "0" : "") +
            dt.getMinutes(),
          description: result.weather[0].description,
          icon: getIcon(result.weather[0].id),
          temperature: result["main"].temp,
          celcius: celcius,
          farenheight: farenheight,
          wind: result["wind"].speed,
          humidity: result["main"].humidity,
          sunrise:
            rise.getHours() +
            ":" +
            (rise.getMinutes() < 10 ? "0" : "") +
            rise.getMinutes(),
          sunset:
            set.getHours() +
            ":" +
            (set.getMinutes() < 10 ? "0" : "") +
            set.getMinutes()
        }
      ];
      addWeatherCard(data[0]);
    },
    error: function(xhr, status, error) {
      console.log(error);
    }
  });
}
function manualFetchAndShowWeather(q) {
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/weather?&q=" +
      q +
      "&appid=" +
      owid,
    success: function(result) {
      var dt = new Date((result.dt + result.timezone) * 1000);
      var celcius = Math.round(result["main"].temp - 273.15);
      var farenheight = Math.round(celcius * 1.8 + 32);
      var rise = new Date((result["sys"].sunrise + result.timezone) * 1000);
      var set = new Date((result["sys"].sunset + result.timezone) * 1000);
      var data = [
        {
          location: result.name,
          date:
            days[dt.getDay()] +
            " " +
            dt.getDate() +
            " " +
            months[dt.getMonth()],
          time:
            dt.getHours() +
            ":" +
            (dt.getMinutes() < 10 ? "0" : "") +
            dt.getMinutes(),
          description: result.weather[0].description,
          icon: getIcon(result.weather[0].id),
          temperature: result["main"].temp,
          celcius: celcius,
          farenheight: farenheight,
          wind: result["wind"].speed,
          humidity: result["main"].humidity,
          sunrise:
            rise.getHours() +
            ":" +
            (rise.getMinutes() < 10 ? "0" : "") +
            rise.getMinutes(),
          sunset:
            set.getHours() +
            ":" +
            (set.getMinutes() < 10 ? "0" : "") +
            set.getMinutes()
        }
      ];
      addWeatherCard(data[0]);
    },
    error: function(xhr, status, error) {
      console.log(error);
    }
  });
}
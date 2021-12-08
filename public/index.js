function addCity(city)
{
    var context = {
        city: city
    }
    var newCity = Handlebars.templates.city(context)
    var results = document.getElementById('results-section')
    results.insertAdjacentHTML('beforeend', newCity)
}

function addEvent(artist, date, city)
{
    var context = {
        artist: artist,
        date: date,
        city: city
    }
    var newEvent = Handlebars.templates.event(context)
    var city = document.querySelectorAll('[city-name=' + city + ']')
    city.insertAdjacentHTML('beforeend', newEvent)
}

//slider bar
// var distanceText = document.getElementById('radius-input')
var distanceText = document.getElementById('radius-containter')
var distanceSlider = document.getElementsByClassName('radius-slider')

console.log("text-input: ", distanceText)
console.log("slider-input", distanceSlider)
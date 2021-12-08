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

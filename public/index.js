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
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        var distanceText = document.getElementById('radius-input')
        var distanceSlider = document.getElementsByClassName('radius-slider')
    
        console.log("text-input: ", distanceText)
        console.log("slider-input", distanceSlider)

        var distanceValue = 75

        distanceText.addEventListener('change', function(){
            distanceValue = distanceValidation(parseInt(distanceText.value), distanceValue)
            distanceSlider[0].value = distanceValue
            console.log("distanceValue input changed to: ", distanceValue)
        })

        distanceSlider[0].addEventListener('input', function(){
            distanceValue = distanceValidation(parseInt(distanceSlider[0].value), distanceValue)
            distanceText.value = distanceValue
            console.log("distanceValue input changed to: ", distanceValue)
        })
    }
  };

function distanceValidation(x, last){
    if(isNaN(x)){
        return last
    }else{
        return x
    }
}
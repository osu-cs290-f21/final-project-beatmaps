// Create the script tag, set the appropriate attributes
const script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCleAO0L-ilQ0Vb-yGOmQHV6bfnfPg72TA&callback=initMap';
script.async = true;

let map;
let events;
let circleRadius;
let searchResultPromise
let coordsPromise;

// Attach your callback function to the `window` object
window.initMap = function () {
    updatePage()

    let slider = document.getElementById("radius-slider")
    coordsPromise.then(
        (data) => {
            map = new google.maps.Map(document.getElementById("map"), {
                center: {lat: data.coords[1], lng: data.coords[0]},
                zoom: 6,
            })

            console.log(data)

            circleRadius = new google.maps.Circle({
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                map,
                center: {lat: data.coords[1], lng: data.coords[0]},
                radius: parseInt(data.radius) * 1609 //convert from miles to meters
            })
        }
    )
    slider.oninput = () => {
        const radius = parseInt(slider.value)
        circleRadius.setRadius(radius * 1609)
        for (let i = 0; i < markers.length; i++) {
            if (markers[i]["data"].distance <= radius) {
                markers[i]["marker"].setMap(map)
            } else {
                markers[i]["marker"].setMap(null)
            }
        }
    }

    let markers = []
    searchResultPromise.then(
        (data) => {
            console.log("prmosie", data)
            for (let i = 0; i < events.length; i++) {
                markers.push({
                        "data": data[i],
                        "marker": new google.maps.Marker({
                            position: {lat: events[i].coords[1], lng: events[i].coords[0]},
                            map: map,
                        })
                    }
                )
            }
        }
    )
};

// Append the 'script' element to 'head'
document.head.appendChild(script);


//slider bar
document.onreadystatechange = () => {
    document.getElementById("search_button").addEventListener("click", () => {
        console.log("Searching")
        $.post("/search", {
            location: document.getElementById("location-input").value,
            start_date: document.getElementById("time-start").value,
            end_date: document.getElementById("time-end").value,
            radius: parseInt(document.getElementsByClassName("radius-slider")[0].value)
        }).then(
            ()=> {
                if (window.location.pathname === '/result')
                    updatePage()
            }
        )
    })
    if(window.location.pathname !== '/result') {
        if (document.readyState === 'complete') {
            const distanceText = document.getElementById('radius-input');
            const distanceSlider = document.getElementsByClassName('radius-slider');

            let distanceValue = 75;

            distanceText.addEventListener('change', function () {
                distanceValue = distanceValidation(parseInt(distanceText.value), distanceValue)
                distanceSlider[0].value = distanceValue
            })

            distanceSlider[0].addEventListener('input', function () {
                distanceValue = distanceValidation(parseInt(distanceSlider[0].value), distanceValue)
                distanceText.value = distanceValue
            })
        }

    } else {
        searchResultPromise.then(
            ()=>{
                const events_html = document.getElementsByClassName('search-results')
                console.log("in else:", events_html)
                console.log(events.length)
                for (let i = 0; i < events.length; i++) {
                    console.log("in loop", i)
                    events_html[i].addEventListener("click",
                        () => {
                            console.log("clocked event number", i)
                            const template = Handlebars.templates.event_details(events[i])
                            if (document.getElementById('event-section') !== null) {
                                document.getElementById('event-section').remove()
                            }
                            document.getElementById('find-event').insertAdjacentHTML('beforeend', template)
                        }
                    )
                }
            }
        )

        const searchResults = document.getElementsByClassName('search-results')

        for(let i = 0; i < searchResults.length; i++){
            searchResults[i].addEventListener('click', function(){
                console.log("clocked")
                for(let j = 0; j < searchResults.length; j++){
                    searchResults[j].classList.remove('search-clicked')
                }
                searchResults[i].classList.add('search-clicked')
            })
        }
    }
};

function distanceValidation(x, last) {
    if (isNaN(x)) {
        return last
    } else {
        return x
    }
}

Handlebars.registerHelper("log", function(something) {
    console.log(something);
});

function updatePage(){
    searchResultPromise = $.get("/searchGetResult", (data) => {
        console.log("get result:", data)
        events = data
        return data
    })
    coordsPromise = $.get("/userCoords", (data) => {
        // map.setCenter({lat: data.coords[1], lng: data.coords[0]})
        // circleRadius.setCenter({lat: data.coords[1], lng: data.coords[0]})
        return data
    })
}

// event selection

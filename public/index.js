// Create the script tag, set the appropriate attributes
const script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCleAO0L-ilQ0Vb-yGOmQHV6bfnfPg72TA&callback=initMap';
script.async = true;

let map;
let events;
let circleRadius;

// Attach your callback function to the `window` object
window.initMap = function () {
    let searchResultPromise = $.get("/searchGetResult", (data) => {
        console.log("get result:", data)
        events = data
        return data
    })

    let coordsPromise = $.get("/userCoords", (data) => {
        return data
    })

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
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                markers.push({
                        "data": data[i],
                        "marker": new google.maps.Marker({
                            position: {lat: data[i].coords[1], lng: data[i].coords[0]},
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
    if (document.readyState === 'complete') {
        var distanceText = document.getElementById('radius-input')
        var distanceSlider = document.getElementsByClassName('radius-slider')

        var distanceValue = 75

        distanceText.addEventListener('change', function () {
            distanceValue = distanceValidation(parseInt(distanceText.value), distanceValue)
            distanceSlider[0].value = distanceValue
        })

        distanceSlider[0].addEventListener('input', function () {
            distanceValue = distanceValidation(parseInt(distanceSlider[0].value), distanceValue)
            distanceText.value = distanceValue
        })
    }

    document.getElementById("search_button").addEventListener("click", () => {
        console.log("Searching")
        $.post("/search", {
            location: document.getElementById("location-input").value,
            start_date: document.getElementById("time-start").value,
            end_date: document.getElementById("time-end").value,
            radius: parseInt(document.getElementsByClassName("radius-slider")[0].value)
        })
    })

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

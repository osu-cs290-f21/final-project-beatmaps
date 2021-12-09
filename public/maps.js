// Create the script tag, set the appropriate attributes
const script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCleAO0L-ilQ0Vb-yGOmQHV6bfnfPg72TA&callback=initMap';
script.async = true;

let map;
let events;
let circleRadius;

let searchResultPromise = $.get("/searchGetResult", (data) => {
    events = data
    document.getElementById("events").textContent = JSON.stringify(data)
    return data
})

let coordsPromise = $.get("/userCoords", (data) => {
    return data
})


// Attach your callback function to the `window` object
window.initMap = function () {
    let slider = document.getElementById("myRange")
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
        console.log(slider.value)
        const radius = parseInt(slider.value)
        circleRadius.setRadius(radius * 1609)
        document.getElementById("events").textContent = ""
        for (let i = 0; i < markers.length; i++) {
            console.log(markers[i]["data"].distance)
            console.log(radius)
            if (markers[i]["data"].distance <= radius) {
                markers[i]["marker"].setMap(map)
                document.getElementById("events").textContent += JSON.stringify(markers[i]["data"])
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

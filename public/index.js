let map;
let markers = [];

function initMap() {
    const moveButton = document.getElementById("moveButton") //Button MUST be here for document to be recognized for some reason, maybe the google maps script is doing sth?
    const deleteButton = document.getElementById("deleteButton")
    let custom_pos = {
        lat: 44.5632702,
        lng: -123.2776147
    }

    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8,
    });

    moveButton.addEventListener("click", () => {
        map.setCenter(custom_pos)
        markers.push(new google.maps.Marker({
            position: custom_pos,
            map: map,
        }))
        console.log(markers)
    })

    deleteButton.addEventListener("click", () => {
        setMapOnAll(null);
        markers = []
        console.log(markers)
    })
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

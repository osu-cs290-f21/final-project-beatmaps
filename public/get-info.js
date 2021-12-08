document.getElementById("search_button").addEventListener("click", () => {
    $.post("/search", {
        location: document.getElementById("location-input").value,
        start_date: document.getElementById("time-start").value,
        end_date: document.getElementById("time-end").value,
        radius: document.getElementsByClassName("radius-slider")[0].value
    }, (data) => {
        console.log("result", data)
    })
})

document.getElementById("search_button").addEventListener("click", () => {
    $.post("/search", {
        location: document.getElementById("location-input").value,
        start_date: document.getElementById("time-start").value,
        end_date: document.getElementById("time-end").value,
        radius: 200//document.getElementsByClassName("radius-slider")[0].value
    }, () => {
        $.get('searchSplitCity', (data)=>{
            console.log("Data:", data)
        })
    })
})

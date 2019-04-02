const request = new XMLHttpRequest();
const optionList = document.querySelector("#option-list1");

const searchBar = document.querySelector("#search-bar");
searchBar.addEventListener("input", function() {
    request.open("GET", `https://www.ifixit.com/api/2.0/suggest/${searchBar.value}?doctypes=device`, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            //clear search results
            while (optionList.firstChild) {
                optionList.removeChild(optionList.firstChild);
            }

            if (searchBar.value === "") {
                return;
            }
            const data = JSON.parse(this.response);
            data["results"].forEach(result => {
                const option = document.createElement("li");
                option.setAttribute("class", "option");
                option.textContent = result.title;

                optionList.appendChild(option);
            });
        } else {
            console.log("error loading categories"); //TODO Issue #6
        }
    }
    request.send();
});

/* category chooser
function loadCategories(devicesData, devices) {
    for (let entry in devicesData) {
        const device = document.createElement("li");
        device.setAttribute("class", "option");
        device.textContent = entry;
    
        devices.appendChild(device);
    }
}


request.open("GET", "https://www.ifixit.com/api/2.0/categories", true);
request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        loadCategories(JSON.parse(this.response), devices);
    } else {
        console.log("error loading data"); //TODO Issue #6
    }
};
request.send();*/
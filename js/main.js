const request = new XMLHttpRequest();
const resultContainer = document.querySelector("#result-container");

const searchBar = document.querySelector("#search-bar");
searchBar.addEventListener("input", function() {
    if (searchBar.value !== "") {
        loadSearchResults(searchBar.value);
    }
});

function loadSearchResults(searchQuery) {
    request.open("GET", `https://www.ifixit.com/api/2.0/suggest/${searchQuery}?doctypes=device`, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            //clear search results
            while (resultContainer.firstChild) {
                resultContainer.removeChild(resultContainer.firstChild);
            }

            const resultList = document.createElement("ul");
            resultList.setAttribute("class", "option-list");
            resultContainer.appendChild(resultList);

            const data = JSON.parse(this.response);
            data["results"].forEach(result => {
                const option = document.createElement("li");
                option.setAttribute("class", "option");
                option.textContent = result.title;

                resultList.appendChild(option);
            });
        } else {
            console.log("error loading categories"); //TODO Issue #6
        }
    }
    request.send();
}

/* category chooser
function loadOptions(list) {
    request.open("GET", "https://www.ifixit.com/api/2.0/categories", true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            const data = JSON.parse(this.response);
            for (let entry in data) {
                const option = document.createElement("li");
                option.setAttribute("class", "option");
                option.textContent = entry;
            
                list.appendChild(option);
            }
        } else {
            console.log("error loading data"); //TODO Issue #6
        }
    };
    request.send();
    
}*/
let deviceList = [];
//TODO Issue #4 load stored devices into deviceList & update

const request = new XMLHttpRequest();
const resultContainer = document.querySelector("#result-container");
const bagList = document.querySelector("#bag-list");

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", function() {
    deviceList = [];
    clearContainer(bagList);
})

const searchBar = document.querySelector("#search-bar");
searchBar.addEventListener("input", function() {
    if (this.value !== "") {
        loadSearchResults(resultContainer, this.value);
    } else {
        loadOptions(resultContainer);
    }
});

function loadSearchResults(resultContainer, searchQuery) {
    request.open("GET", `https://www.ifixit.com/api/2.0/suggest/${searchQuery}?doctypes=device`, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            clearContainer(resultContainer);

            let json = JSON.parse(this.response);
            //formats json similar to /categories/'s response
            data = {};
            for (let obj of json["results"]) {
                data[obj.title] = {};
            }
            
            addOptions(resultContainer, data);
        } else {
            console.log("error loading categories"); //TODO Issue #6
        }
    }
    request.send();
}

function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function loadOptions(resultContainer) {
    request.open("GET", "https://www.ifixit.com/api/2.0/categories", true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            clearContainer(resultContainer); 

            const data = JSON.parse(this.response);
            addOptions(resultContainer, data);
        } else {
            console.log("error loading data"); //TODO Issue #6
        }
    };
    request.send();
}

function addOptions(resultContainer, data) {
    const optionList = document.createElement("ul");
    optionList.className = "option-list";
    resultContainer.appendChild(optionList);

    for (let entry in data) {
        const option = document.createElement("li");
        option.className =  "option";
        option.textContent = entry;
        if (Object.entries(data[entry]).length !== 0) { //is a category
            const img = document.createElement("img");
            img.id = "arrow";
            img.src = "images/arrow.png";
            option.appendChild(img);
        }
        option.addEventListener("click", function() {
            while (resultContainer.lastChild !== this.parentElement) {
                resultContainer.removeChild(resultContainer.lastChild);
            }
            
            //"selected" status handling
            this.className = "option selected";
            for (let opt of this.parentElement.children) {
                if (opt !== this) {
                    opt.className = "option";
                }
            }

            if (Object.entries(data[this.textContent]).length === 0) { //is a device
                addDevice(bagList, this.textContent);
            } else {
                addOptions(resultContainer, data[this.textContent]);
            }

        });
        optionList.appendChild(option);
    }
}

function addDevice(bagList, device) {
    const found = deviceList.some(d => d === device);
    if (found) {
        //throw error?
        return;
    }
    console.log("AY");
    const deviceObj = document.createElement("li");
    deviceObj.className = "device";
    deviceObj.textContent = device;
    deviceObj.addEventListener("click", function() {
        removeDevice(bagList, device);
    });

    bagList.appendChild(deviceObj);

    deviceList.push(device);
    //TODO save local storage Issue #4
}

function removeDevice(bagList, device) {
    const found = deviceList.some(d => d === device);
    if (!found) {
        //throw error
        return;
    }

    for (let d of bagList.children) {
        if (d.textContent === device) {
            d.remove();
            deviceList = deviceList.filter(d => d !== device);
            break;
        }
    }
    //TODO save ls #4
}

loadOptions(resultContainer);
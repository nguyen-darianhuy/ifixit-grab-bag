const resultContainer = document.querySelector("#result-container");
const bagList = document.querySelector("#bag-list");

let deviceList = [];
loadDeviceList();

loadOptions();

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", function() {
    deviceList = [];
    clearContainer(bagList);
    saveDeviceList();
});

function saveDeviceList() {
    localStorage.setItem("deviceList", JSON.stringify(deviceList));
}

function loadDeviceList() {
    let storedList = JSON.parse(localStorage.getItem("deviceList"));
    if (!storedList) {
        storedList = [];
    }

    for (let d of storedList) {
        addDeviceToBag(d);
    }
}

const searchBar = document.querySelector("#search-bar");
searchBar.addEventListener("input", function() {
    if (this.value !== "") {
        loadSearchResults(this.value);
    } else {
        loadOptions();
    }
});

function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function loadSearchResults(searchQuery) {
    const request = new XMLHttpRequest();
    request.open("GET", `https://www.ifixit.com/api/2.0/suggest/${searchQuery}?doctypes=device`, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            clearContainer(resultContainer);

            const json = JSON.parse(this.response);
            //formats json similar to /categories/'s response
            const options = {};
            for (let option of json["results"]) {
                options[option.title] = {};
            }
            
            if (json["results"].length !== 0) {
                addOptions(options);
            } else {
                displayErrorMessage(resultContainer, "no-search-results");
            }
        } else {
            displayErrorMessage(resultContainer, "api");
        }
    }
    request.onerror = function() {
        displayErrorMessage(resultContainer, "no-internet");
    }
    request.send();
}

function displayErrorMessage(container, errorType) {
    messages = {
        "api": "iFixit API not responding. Please try again later.",
        "no-internet": "Unable to connect to Internet, please check your connection.",
        "no-search-results": "No matches found. Did you spell it correctly?"
    }
    clearContainer(container);
    const m = document.createElement("p"); 
    m.className = "error-message";
    m.textContent = messages[errorType];
    container.appendChild(m);
}

function loadOptions() {
    const request = new XMLHttpRequest();
    request.open("GET", "https://www.ifixit.com/api/2.0/categories", true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            clearContainer(resultContainer); 

            const options = JSON.parse(this.response);
            addOptions(options);
        } else {
            displayErrorMessage(resultContainer, "api");
        }
    };
    request.onerror = function() {
        displayErrorMessage(resultContainer, "no-internet");
    }
    request.send();
}

function addOptions(options) {
    const optionList = document.createElement("ul");
    optionList.className = "option-list";
    resultContainer.appendChild(optionList);

    for (let entry in options) {
        const option = document.createElement("li");
        option.className =  "option";
        option.textContent = entry;
        if (Object.entries(options[entry]).length !== 0) { //is a category
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

            if (Object.entries(options[this.textContent]).length === 0) { //is a device
                addDeviceToBag(this.textContent);
            } else {
                addOptions(options[this.textContent]);
            }

        });
        optionList.appendChild(option);
    }
}

function addDeviceToBag(device) {
    const found = deviceList.some(d => d === device);
    if (found) {
        //throw error?
        return;
    }
    const deviceObj = document.createElement("li");
    deviceObj.className = "device";
    deviceObj.textContent = device;
    deviceObj.addEventListener("click", function() {
        removeDeviceFromBag(device);
    });

    bagList.appendChild(deviceObj);

    deviceList.push(device);
    saveDeviceList();
}

function removeDeviceFromBag(device) {
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
    saveDeviceList();
}


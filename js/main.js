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

/**
 * Save the items in bag to browser local storage
 */
function saveDeviceList() {
    localStorage.setItem("deviceList", JSON.stringify(deviceList));
}

/**
 * Load items to bag from browser local storage
 */
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

/**
 * Clear a container of children
 * @param {Node} container 
 */
function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

/**
 * Display search results from API
 * @param {string} searchQuery 
 */
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

/**
 * Display a red error message 
 * @param {Node} container Container in which to display the message
 * @param {string} errorType Type of error
 */
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

/**
 * Display categories from API
 */
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

/**
 * Display child categories from parent category
 * @param {Object} options 
 */
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

/**
 * Add device to bag and save
 * @param {string} device 
 */
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

/**
 * Remove device from bag and save
 * @param {string} device 
 */
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


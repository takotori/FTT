// Put all the javascript code here, that you want to execute after page load.
let sideBar = document.getElementById("partial-discussion-sidebar");
let sideBarDialog = document.getElementsByClassName("Box-sc-g0xbh4-0 eabjER");

if (sideBar !== null) {
    createSidebarTimeTracking(sideBar);
} else if (sideBarDialog !== null && sideBarDialog.length > 0) {
    createSidebarTimeTracking(sideBarDialog[0].getElementsByClassName("Box-sc-g0xbh4-0")[0].firstChild);
}

function createSidebarTimeTracking(element) {
    const dialog = "    <div id=\"ftt-dialog\">\n" +
        "      <label for=\"ftt-date\">Day</label>\n" +
        "      <input id=\"ftt-date\" type=\"date\"><br>\n" +
        "      <label for=\"ftt-hours\">Hours</label>\n" +
        "      <input id=\"ftt-hours\" type=\"number\" min=\"0\"><br>\n" +
        "      <label for=\"ftt-minutes\">Min</label>\n" +
        "      <input id=\"ftt-minutes\" type=\"number\" min=\"0\" max=\"59\"><br>\n" +
        "      <button id=\"ftt-submit\">Submit</button>\n" +
        "      <button id=\"ftt-history\">History</button>\n" +
        "    </div>";

    element.parentNode.insertAdjacentHTML("afterbegin", dialog);
    document.getElementById("ftt-date").valueAsDate = new Date();
}

let fttDate = document.getElementById("ftt-date");
let fttHours = document.getElementById("ftt-hours");
let fttMinutes = document.getElementById("ftt-minutes");
let fttSubmit = document.getElementById("ftt-submit");


function getIssueId() {
    if (sideBar !== null) {
        let elem = document.getElementsByTagName("collapsible-sidebar-widget")[0];
        let attribute = elem.getAttribute("url");
        return attribute.split("/")[4]
    } else if (sideBarDialog !== null && sideBarDialog.length > 0) {
        let url = window.location.href;
        let urlParts = url.split("=");
        return urlParts[urlParts.length - 1];
    }
    return "0";
}

function getIssueTitle() {
    let elem = document.getElementsByTagName("bdi")[0];
    return elem.innerText;
}

function onSuccess() {
    alert("success")
}

function onFail() {
    alert("failed")
}

function addToStorage() { // not working yet
    let issueId = getIssueId();
    let getFromStorage = browser.storage.local.get(issueId);
    if (Object.keys(getFromStorage).length !== 0) {
        const newEntry = {
            date: fttDate.value,
            hours: fttHours.value,
            min: fttMinutes.value
        }
        getFromStorage.get("history").push(newEntry);
        browser.storage.local.set(issueId, getFromStorage);
    } else {
        browser.storage.local.set({
            issueId: getIssueId(),
            issueTitle: getIssueTitle(),
            history: [
                {
                    date: fttDate.value,
                    hours: fttHours.value,
                    min: fttMinutes.value
                }
            ],

        }).then(onSuccess, onFail);
    }
}

fttSubmit.addEventListener("click", addToStorage)
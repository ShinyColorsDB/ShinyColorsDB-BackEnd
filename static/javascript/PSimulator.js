let icons;
let currentSelectedColumn = "SCard1";

function Init() {
    setUpColumnListener();
    getIconList();
}

function setUpColumnListener() {
    document.querySelectorAll(".columnBtn").forEach(element => {
        element.addEventListener("click", function (e) {
            e.preventDefault();
            currentSelectedColumn = this.parentElement.parentElement.id;
        });
    });
}

async function getIconList() {
    let data = await fetch("/general/getCardList", {
        method: "GET"
    });
    icons = await data.json();

    icons.forEach((e, index) => {
        if (e.CardType.match(/P_/)) {
            setUpCardIcon(e, index, "P");
        }
        else if (e.CardType.match(/S_/)) {
            setUpCardIcon(e, index, "S");
        }
    });

    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function setUpCardIcon(e, index, type) {
    const Aria = type == "P" ? document.getElementById("PIconAria") : document.getElementById("SIconAria");

    const div = document.createElement("div");
    div.classList.add("card", "col-1", "ps-0", "pe-0", "mb-2", "mt-2");
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn-outline-light", "btn", "p-0");
    button.setAttribute("data-icon-index", index);
    button.setAttribute("data-bs-toggle", "tooltip");
    button.setAttribute("data-bs-placement", "top");
    button.setAttribute("title", e.CardName);
    button.setAttribute("data-bs-dismiss", "modal");

    button.addEventListener("click", changeColumn);

    const img = document.createElement("img");
    img.classList.add("img-fluid");
    img.src = `https://static.shinycolors.moe/pictures/smlPic/${e.SmallPic}`;
    button.appendChild(img);
    div.appendChild(button);
    Aria.appendChild(div);
}

function changeColumn(e) {
    e.preventDefault();
    const c = document.getElementById(currentSelectedColumn);

    let btn = c.querySelector("div > button"),
        btnImg = c.querySelector("div > button > img"),
        btnTitle = c.querySelector("div > div > h5");
    const iconIndex = Number(this.getAttribute("data-icon-index"));
    btnImg.src = `https://static.shinycolors.moe/pictures/smlPic/${icons[iconIndex].SmallPic}`;
    btnTitle.textContent = icons[iconIndex].CardName;
}
let count = 0;
let imgP, imgS, imgL;
let isInPCardList = true;

let pNavLink, sNavLink;
let SSRNavLink, SRNavLink, RNavLink, NNavLink;
let PSSRCardList, PSRCardList, PRCardList, SSSRCardList, SSRCardList, SRCardList, SNCardList;
let cardPicture;
let cardTypeTitle;
let cardInfoLink;

function Main() {
    imgP = document.getElementById("imgP");
    imgS = document.getElementById("imgS");
    imgL = document.getElementById("imgL");

    pNavLink = document.getElementById("PList");
    sNavLink = document.getElementById("SList");

    SSRNavLink = document.getElementById("SSRList");
    SRNavLink = document.getElementById("SRList");
    RNavLink = document.getElementById("RList");
    NNavLink = document.getElementById("NList");

    cardTypeTitle = document.getElementById("cardTypeTitle");

    PSSRCardList = document.getElementById("PSSRCardList");
    PSRCardList = document.getElementById("PSRCardList");
    PRCardList = document.getElementById("PRCardList");

    SSSRCardList = document.getElementById("SSSRCardList");
    SSRCardList = document.getElementById("SSRCardList");
    SRCardList = document.getElementById("SRCardList");
    SNCardList = document.getElementById("SNCardList");

    cardPicture = document.getElementById("cardPicture");

    cardInfoLink = document.getElementById("cardInfoLink");

    pNavLink.addEventListener('click', ToggleToPCardList, false);
    sNavLink.addEventListener('click', ToggleToSCardList, false);

    SSRNavLink.addEventListener('click', ToggleCardListSSR, false);
    SRNavLink.addEventListener('click', ToggleCardListSR, false);
    RNavLink.addEventListener('click', ToggleCardListR, false);
    NNavLink.addEventListener('click', ToggleCardListN, false);

    ToggleCardListSSR(false);
}

function ChangeTachie() {
    count = count + 1 < 3 ? count + 1 : 0;
    switch (count) {
        case 0:
            toggleDisplay(imgP, true);
            toggleDisplay(imgL, false);
            toggleDisplay(imgS, false);
            break;
        case 1:
            toggleDisplay(imgP, false);
            toggleDisplay(imgL, true);
            toggleDisplay(imgS, false);
            break;
        case 2:
            toggleDisplay(imgP, false);
            toggleDisplay(imgL, false);
            toggleDisplay(imgS, true);
            break;
    }
}

function toggleDisplay(img, type) {
    if (type) {
        img.classList.remove("d-none");
    } else {
        img.classList.add("d-none");
    }
}

function ToggleToPCardList(e) {
    e.preventDefault();
    if (isInPCardList) return;

    isInPCardList = true;

    pNavLink.classList.add("active", "disabled");
    sNavLink.classList.remove("active", "disabled");

    ToggleCardListSSR(false);

    NNavLink.classList.add("disabled");
}

function ToggleToSCardList(e) {
    e.preventDefault();
    if (!isInPCardList) return;

    isInPCardList = false;

    pNavLink.classList.remove("active", "disabled");
    sNavLink.classList.add("active", "disabled");

    ToggleCardListSSR(false);

    NNavLink.classList.remove("disabled");
}

function ToggleCardListSSR(e) {
    if (e) e.preventDefault();
    [PSSRCardList, PSRCardList, PRCardList, SSSRCardList, SSRCardList, SRCardList, SNCardList].forEach(element => {
        element.classList.add("d-none");
    });
    [SSRNavLink, SRNavLink, RNavLink, NNavLink].forEach(element => {
        element.classList.remove("active");
    });
    SSRNavLink.classList.add("active");
    if (isInPCardList) {
        cardTypeTitle.textContent = "P-SSR";
        PSSRCardList.classList.remove("d-none");
    } else {
        cardTypeTitle.textContent = "S-SSR";
        SSSRCardList.classList.remove("d-none");
    }
}

function ToggleCardListSR(e) {
    if (e) e.preventDefault();
    [PSSRCardList, PSRCardList, PRCardList, SSSRCardList, SSRCardList, SRCardList, SNCardList].forEach(element => {
        element.classList.add("d-none");
    });
    [SSRNavLink, SRNavLink, RNavLink, NNavLink].forEach(element => {
        element.classList.remove("active");
    });
    SRNavLink.classList.add("active");
    if (isInPCardList) {
        cardTypeTitle.textContent = "P-SR";
        PSRCardList.classList.remove("d-none");
    } else {
        cardTypeTitle.textContent = "S-SR";
        SSRCardList.classList.remove("d-none");
    }
}

function ToggleCardListR(e) {
    if (e) e.preventDefault();
    [PSSRCardList, PSRCardList, PRCardList, SSSRCardList, SSRCardList, SRCardList, SNCardList].forEach(element => {
        element.classList.add("d-none");
    });
    [SSRNavLink, SRNavLink, RNavLink, NNavLink].forEach(element => {
        element.classList.remove("active");
    });
    RNavLink.classList.add("active");
    if (isInPCardList) {
        cardTypeTitle.textContent = "P-R";
        PRCardList.classList.remove("d-none");
    } else {
        cardTypeTitle.textContent = "S-R";
        SRCardList.classList.remove("d-none");
    }
}

function ToggleCardListN(e) {
    if (e) e.preventDefault();
    [PSSRCardList, PSRCardList, PRCardList, SSSRCardList, SSRCardList, SRCardList, SNCardList].forEach(element => {
        element.classList.add("d-none");
    });
    [SSRNavLink, SRNavLink, RNavLink, NNavLink].forEach(element => {
        element.classList.remove("active");
    });
    NNavLink.classList.add("active");
    cardTypeTitle.textContent = "S-N";
    SNCardList.classList.remove("d-none");
}

function changePicture(link) {
    cardPicture.src = `https://static.shinycolors.moe/pictures/bigPic/${link}`;
}

function changeCardLink(str1, str2) {
    cardInfoLink.href = str1;
    cardInfoLink.textContent = str2;
}
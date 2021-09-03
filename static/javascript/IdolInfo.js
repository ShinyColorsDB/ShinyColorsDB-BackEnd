let currentPCard = true;

function Init() {
    let pList = document.getElementById("PList"),
        sList = document.getElementById("SList");
    let pCard = document.getElementById("divCardProduce"),
        sCard = document.getElementById("divCardSupport");
    pList.addEventListener("click", (e) => {
        e.preventDefault();
        if(currentPCard) return;

        sList.classList.remove("active", "disabled");
        pList.classList.add("active", "disabled");
        currentPCard = true;
        pCard.classList.remove("d-none");
        sCard.classList.add("d-none");
    });

    sList.addEventListener("click", (e) => {
        e.preventDefault();
        if(!currentPCard) return;

        pList.classList.remove("active", "disabled");
        sList.classList.add("active", "disabled");
        currentPCard = false;
        sCard.classList.remove("d-none");
        pCard.classList.add("d-none");
    });
}
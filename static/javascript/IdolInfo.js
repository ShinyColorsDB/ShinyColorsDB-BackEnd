$(function() {
    let count = 0;
    $(".cardElement").click(function(e) {
        let pic = $(this).attr("data-picture"), link = $(this).attr("data-carduuid"), name = $(this).attr("data-cardname");
        $("#cardPicture").attr("src", `https://static.shinycolors.moe/pictures/bigPic/${pic}`);
        if ($("#PList").hasClass("active")) {
            $('#cardInfoLink').attr("href", `/info/PCardInfo?UUID=${link}`).text(name);
        }
        else {
            $('#cardInfoLink').attr("href", `/info/SCardInfo?UUID=${link}`).text(name);
        }
    });

    $(".cardType").click(function(e) {
        if($(this).hasClass("active") || $(this).hasClass("disabled")) return;

        $(".cardType").removeClass("active disabled");
        $(this).addClass("active disabled");

        $(".cardList").addClass("d-none");
        $(".cardRarity").removeClass("active disabled");
        $("#SSRList").addClass("active disabled");
        $("#cardTypeTitle").text(`${$(this).attr("data-cardType")}-SSR`);
        
        if($(this).attr("data-cardType") == "P"){
            $("#NList").addClass("disabled");
            $("#PSSRCardList").removeClass("d-none");
        }
        else if($(this).attr("data-cardType") == "S") {
            $("#NList").removeClass("disabled");
            $("#SSSRCardList").removeClass("d-none");
        }
    });

    $(".cardRarity").click(function() {
        if($(this).hasClass("active") || $(this).hasClass("disabled")) return;

        $(".cardRarity").removeClass("active disabled");
        $(this).addClass("active disabled");

        if($(".cardType.active.disabled").attr("data-cardType") == "P") {
            $("#NList").addClass("disabled");
        }

        let type = $(".active.cardType").attr("data-cardType");
        let rari = $(".active.cardRarity").attr("data-cardRarity");
        $(".cardList").addClass("d-none");
        $(`#${type}${rari}`).removeClass("d-none");
        $("#cardTypeTitle").text(`${type}-${$(this).attr("data-title")}`);
    });

    $("#nextTachie").click(function() {
        count = count + 1 < 3 ? count + 1 : 0;

        $(".tachie").addClass("d-none");
        switch(count) {
            case 0: 
                $("#imgP").removeClass("d-none");
                break;
            case 1:
                $("#imgS").removeClass("d-none");
                break;
            case 2:
                $("#imgL").removeClass("d-none");
                break;
        }
    });
});
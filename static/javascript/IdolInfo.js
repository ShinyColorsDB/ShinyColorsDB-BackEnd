$(function() {
    let count = 0;
    $(".cardElement").click(function(e) {
        let pic = $(this).attr("data-picture"), link = $(this).attr("data-carduuid"), name = $(this).attr("data-cardname");
        $("#cardPicture").attr("src", `https://static.shinycolors.moe/pictures/bigPic/${pic}`);
        $('#cardInfoLink').attr("href", `/info/PCardInfo?UUID=${link}`).text(name);
    });

    $(".cardType").click(function(e) {
        if($(this).hasClass("active") || $(this).hasClass("disabled")) return;

        $(".cardType").removeClass("active disabled");
        $(this).addClass("active disabled");

        $(".cardList").addClass("d-none");
        $(".cardRarity").removeClass("active disabled");
        $("#SSRList").addClass("active disabled");
        
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

        let type = $(".active.cardType").attr("data-cardType");
        let rari = $(".active.cardRarity").attr("data-cardRarity");
        $(".cardList").addClass("d-none");
        $(`#${type}${rari}`).removeClass("d-none");
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
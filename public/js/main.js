
function showComments() {
    $("#comment-box").toggle(
        () => {
            $("#comment-box").fadeIn("slow");

        },
        () => { $("#comment-box").fadeOut("slow") },
    )
}
$(document).ready(function () {
    $('#comment-button').click(function () {
        $("#comment-box").toggle(function () {
            $("#comment-box").slideOut();
        },
            function () {
                $("#comment-box").slideIn();
            });
    });
})

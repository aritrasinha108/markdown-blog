
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
    $("#upvote-button").click(function (event) {
        const xhr = new XMLHttpRequest();
        var title = event.target.getAttribute("data-id");
        console.log("title is: " + title);
        xhr.open('POST', `/articles/toggleUpvote/${title}`, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                if (response.status == 'like') {
                    var upvotes = parseInt(event.target.innerText);
                    console.log('earlier ' + upvotes);
                    upvotes++;
                    event.target.innerHTML = ` <img width="20.0" height="20.0" src="../../assets/upvote.jpeg" alt="">
                                ${upvotes}`;
                    // alert(response.message);
                    console.log('now ' + upvotes);

                }
                if (response.status == 'unlike') {
                    var upvotes = parseInt(event.target.innerText);
                    console.log('earlier ' + upvotes);
                    upvotes--;
                    event.target.innerHTML = ` <img width="20.0" height="20.0" src="../../assets/upvote.jpeg" alt="">
                                ${upvotes}`;
                    // alert(response.message);
                    console.log('now ' + upvotes);
                }
                if (response.status == "error") {
                    alert(response.message);
                }


            }
        }
        var formData = new FormData();

        formData.append("title", title);
        xhr.send(formData);


    });
    $("#downvote-button").click(function (event) {
        const xhr = new XMLHttpRequest();
        var title = event.target.getAttribute("data-id");
        console.log("title is: " + title);
        xhr.open('POST', `/articles/toggleDownvote/${title}`, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                if (response.status == 'dislike') {
                    var downvotes = parseInt(event.target.innerText);
                    console.log('earlier ' + downvotes);
                    downvotes++;
                    event.target.innerHTML = ` <img width="20.0" height="20.0" src="../../assets/downvote.png" alt="">
                                ${downvotes}`;
                    // alert(response.message);
                    console.log('now ' + downvotes);
                }
                if (response.status == 'undo') {
                    var downvotes = parseInt(event.target.innerText);
                    console.log('earlier ' + downvotes);
                    downvotes--;
                    event.target.innerHTML = ` <img width="20.0" height="20.0" src="../../assets/downvote.png" alt="">
                                ${downvotes}`;
                    // alert(response.message);
                    console.log('now ' + downvotes);
                }
                if (response.status == "error") {
                    alert(response.message);
                }


            }
        }
        var formData = new FormData();

        formData.append("title", title);
        xhr.send(formData);


    });
    $("#add-comment").click(function (event) {
        event.preventDefault();
        const xhr = new XMLHttpRequest();
        const id = event.target.getAttribute("data-id");
        let comment = document.getElementById(id).value;
        console.log(comment);
        xhr.open('POST', `/articles/${id}&${comment}`, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                if (response.status == "success") {
                    $("#comment-box").append(`
                    <div class="card" class="each-comment"
                    style="display: flex; flex-direction: row; justify-content: start ;height: auto;margin: 5px 2px;">


                    <div class="profile pr-0">
                        <img src="../../assets/profile.png" class="mt-2" width="20%" height="40px" alt="...">
                        ${response.username}
                    </div>

                    <div class="card-body">
                        <p class="card-text" style="text-align: start; font-size: 1.2em;">
                            ${response.comment}
                        </p>
                    </div>
                </div>`);
                }
                else {
                    alert(response.message);
                }

            }
        }
        var formData = new FormData();
        // let comment = document.getElementById(id).value;
        formData.append("comment", comment);
        xhr.send(formData);

    })


});
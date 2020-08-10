
function showComments(event) {
    let id = event.target.getAttribute("data-id");


    let display = $(`#comment-box-${id}`).css('display');
    console.log(display);
    if (display == "none") {
        $(`#comment-box-${id}`).css('display', 'block');

    }
    else if (display == 'block') {
        $(`#comment-box-${id}`).css('display', 'none');
    }
}
$(document).ready(function () {
    console.log("Website ready...");

    var elements = document.getElementsByClassName("upvote-button");
    console.log(elements);
    for (var i = 0; i < elements.length; i++) {
        console.log("at element index:" + i);
        index = elements[i].dataset.index
        id = elements[i].dataset.id;
        console.log(index);
        if (index != -1) {
            elements[i].style.color = "blue";

        }
        else {
            elements[i].style.color = "black";
        }



    }
    var elements = document.getElementsByClassName("downvote-button");
    console.log(elements);
    for (var i = 0; i < elements.length; i++) {
        console.log("at element index:" + i);
        index = elements[i].dataset.index
        id = elements[i].dataset.id;
        console.log(index);
        if (index != -1) {
            elements[i].style.color = "blue";

        }
        else {
            elements[i].style.color = "black";
        }



    }

    $(".upvote-button").click(function (event) {
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
                    event.target.innerHTML = `${upvotes}`;
                    event.target.style.color = "blue";
                    // alert(response.message);
                    console.log('now ' + upvotes);

                }
                if (response.status == 'unlike') {
                    var upvotes = parseInt(event.target.innerText);
                    console.log('earlier ' + upvotes);
                    upvotes--;
                    event.target.innerHTML = `${upvotes}`;
                    event.target.style.color = "black";

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
    $(".downvote-button").click(function (event) {
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
                    event.target.innerHTML = `${downvotes}`;
                    event.target.style.color = "blue";

                    // alert(response.message);
                    console.log('now ' + downvotes);
                }
                if (response.status == 'undo') {
                    var downvotes = parseInt(event.target.innerText);
                    console.log('earlier ' + downvotes);
                    downvotes--;
                    event.target.innerHTML = `${downvotes}`;
                    event.target.style.color = "black";

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
    $(".add-comment").click(function (event) {

        event.preventDefault();
        const xhr = new XMLHttpRequest();
        const id = event.target.getAttribute("data-id");
        let comment = document.getElementById(id).value;
        let commentElement = document.getElementById(id);
        console.log(comment);
        xhr.open('POST', `/articles/${id}&${comment}`, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                if (response.status == "success") {
                    let comments = parseInt(document.getElementById(`comment-button-${id}`).innerHTML);
                    comments++;
                    document.getElementById(`comment-button-${id}`).innerHTML = comments;
                    $(`#comment-box-${id}`).append(`
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
            commentElement.value = "";
        }
        var formData = new FormData();
        // let comment = document.getElementById(id).value;
        formData.append("comment", comment);
        xhr.send(formData);

    })


});
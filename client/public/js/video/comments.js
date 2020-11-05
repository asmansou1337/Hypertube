var sendComment = document.getElementById("sendComment");
var getComments = document.getElementById("getComments");

// Get Comments on page load
 axios.get(`${getComments.action}`)
  .then((result) => {
    if (result.data.Message !== undefined) {
      document.getElementById("noCommentsContainer").innerHTML = `<div class="media pb-5 mx-5 col-sm-10">
    <div class="media-body text-center">
      <span class='lang' key="noComments">${result.data.Message}</span>
    </div>
  </div>`;
    } else if (result.data.error !== undefined)
      throw new Error(result.data.error);
    else appendComment(result.data);
  })
  .catch((e) => {
    document.querySelector(".errorComments").innerHTML = `<div class="card">
                      <div class="card-body danger-color">
                        ${e.message}
                      </div>
              </div>`;
  });

// Sending comments
$(sendComment).submit(function (e) {
  e.preventDefault();
  document.querySelector(".errorComments").innerHTML = ''
  var comment = document.getElementById("myComment").value;
  axios.post(`${sendComment.action}`, { comment })
    .then((result) => {
      if (result.data.error !== undefined) throw new Error(result.data.error);
      appendComment([result.data]);
      document.getElementById("myComment").value = "";
      document.getElementById("noCommentsContainer").innerHTML = "";
    })
    .catch((e) => {
      document.getElementById("myComment").value = "";
      if (e.response && e.response.status === 404) {
        $(window).attr('location','/error')
        e.message = "Not Found!!"
      }
      document.querySelector(".errorComments").innerHTML = `<div class="card">
                        <div class="card-body danger-color">
                            ${e.message}
                        </div>
                    </div>`;
    });
});

function appendComment(data) {
  var content = "";
  for (var i = 0; i < data.length; i++) {
    content += `<div class="media pb-5 mx-5 col-sm-10">
                <a href="/users/view/${data[i].userId}"><img
                    class="rounded-circle small_avatar z-depth-1-half mr-3" style="width: 90px; height: 90px;"
                    src="${data[i].profileImg}"
                    alt="${data[i].username}"
                /></a>
                <div class="media-body">
                    <h5 class="mt-0 font-weight-bold" style="color: #929fba;">${data[i]['username']}</h5>
                    <h6 class="mt-0" style="color: #929fba;">${data[i].date}</h6>
                    <span>${data[i].content}</span>
                </div>
            </div>`;
  }
  content += document.getElementById("commentsContainer").innerHTML;
  document.getElementById("commentsContainer").innerHTML = content;
}

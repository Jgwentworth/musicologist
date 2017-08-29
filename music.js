let musicInfo = [];

$("#artist-error").hide();
$("#playlist-title").hide();
$("#similar-artist").hide();
$("#no-results").hide();
$("#empty-list").hide();

function addSongFromField(event) {
  event.preventDefault();

  const info = $('#musicField').eq(0).val();
  //validates empty field
  if (info == "") {
    $("#artist-error").show()
    return
  }; 
  musicInfo.push(info);
  $("#artist-error").hide();
  renderList();
  $('#musicField').eq(0).val('');
  changeProgressBar(1);
}
//removes song on click
$('body').on("click", "li.list-group-item", function(){
  const delSong = $(this).text()
  let result = musicInfo.filter(function(elem){
    return elem != delSong; 
  });
  musicInfo = result;
  $(this).remove();
  $("#getPlaylistBtn").attr("class", "btn btn-default disabled")
  $("#playlist").empty()
  changeProgressBar(-1);
  $("#similar-artist").hide();
  $("#addSongPrompt").show();
})

$('#addButton').click(addSongFromField)

$('#musicField').keyup(function(event) {
  if (event.which == 13) { // User presses Enter
    addSongFromField(event);
  }
});

function renderList() {
  const $list = $('.info').eq(0);

  $list.empty();
  for (const info of musicInfo) {
    let i = 0
    const $item = $('<li class="list-group-item">').text(info);

    $list.append($item)
  }
}

function addSongs(list){
  //console.log(list);
  shuffle(list);
  //console.log(list);
  for (i = 0; i < list.length; i++) {
    let playlistSong = $("<div class='panel panel-default'>");
    playlistSong.append($("<div class='panel-body'>").text(list[i].trackName))
    playlistSong.append($("<div class='panel-footer'>").text("By " + list[i].artistName))
    $("#playlist").append(playlistSong);
  }
}

// TODO shuffle function
function shuffle(array) {
  console.log(array)
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  console.log(array)
  return array;
}


let progressBar = 0
function changeProgressBar(val){

  if (val > 0) {
    progressBar = progressBar + 20;
    if (progressBar >= 100) {
      progressBar = 100;
      $("#getPlaylistBtn").attr( "class", "btn btn-primary btn-lg");
      $("#addSongPrompt").hide();
    }
  } else {
    progressBar = progressBar - 20;
    if (progressBar < 0) {
      progressBar = 0;
    };
  }
  let size = 'width: ' + progressBar + '%'
  $("#progress-bar").attr( "style" , size);
  return progressBar
};

function displayPlaylist(){
  $("#playlist").empty()
  
  for (i=0; i < musicInfo.length; i ++) {
    let artistName = musicInfo[i]
    $.ajax({
      url: 'https://itunes.apple.com/search?term='+ artistName + "&limit=5",
      dataType: 'json'
    }).then(function(resp){  
      $("#no-results").hide();
      let songResults = resp.results;
      if (songResults.length == 0) {
        $("#no-results").show();
      } else {
      addSongs(songResults);
      }
    })
    .catch(function (err){
    console.log ("something went wrong", err)
    });
  };
  }

$('#getPlaylistBtn').click(function (event) {
  if (musicInfo.length == 0) {
    $("#empty-list").show();
    return
  };
  $("#playlist-title").show();
  $("#similar-artist").show();
  // TODO: Display songs with thumbnail on album
  // TODO: Use second api to find top songs
  displayPlaylist();
});

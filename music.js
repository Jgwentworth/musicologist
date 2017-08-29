let musicInfo = [];

$("#artist-error").hide();
$("#playlist-title").hide();
$("#similar-artist").hide();
$("#no-results").hide();

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
}
//removes song on click
$('body').on("click", "li.list-group-item", function(){
  const delSong = $(this).text()
  let result = musicInfo.filter(function(elem){
    return elem != delSong; 
  });
  musicInfo = result;
  $(this).remove();
})
//TODO: validation for song name
$('#addButton').click(addSongFromField);
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
  for (i = 0; i < list.length; i++) {
    let playlistSong = $("<div class='panel panel-default'>");
    playlistSong.append($("<div class='panel-body'>").text(list[i].trackName))
    playlistSong.append($("<div class='panel-footer'>").text("By " + list[i].artistName))
    $("#playlist").append(playlistSong);
    //$("#playlist").append($("<button type='button' class='list-group-item'>").text(list[i].trackName))

  }
}
// Displays Playlist
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
    $("#no-results").show();  
    console.log ("something went wrong", err)
    });
  };
  }


$('#getPlaylistBtn').click(function (event) {
  $("#playlist-title").show();
  $("#similar-artist").show();
  // TODO: Display songs with thumbnail on album
  // TODO: Use second api to find top songs
  displayPlaylist();
});

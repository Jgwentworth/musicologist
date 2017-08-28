const musicInfo = [];

function addSongFromField(event) {
  event.preventDefault();

  const info = $('#musicField').eq(0).val();
  musicInfo.push(info);
  renderList();
  $('#musicField').eq(0).val('');
}

// TODO: Implement deletion of song. NEEDS TO BE REMOVED FROM MUSICINFO ARRAY
$(".list-group-item").click(function(){
  $(this).hide()
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
    $("#playlist").append($("<p>").text(list[i].trackName))
  }
}


// TODO: clean up code in displayPlaylist function
function displayPlaylist(){
  $("#playlist").empty()
  
  for (i=0; i < musicInfo.length; i ++) {
    let artistName = musicInfo[i]
    $.ajax({
      url: 'https://itunes.apple.com/search?term='+ artistName + "&limit=5",
      dataType: 'json'
    }).then(function(resp){
      let songResults = resp.results;
      addSongs(songResults);
    })
    .catch(function (err){
    console.log ("something went wrong", err)
    });
  };
  }


$('#getPlaylistBtn').click(function (event) {
  // TODO: Display songs with thumbnail on album
  // TODO: Use second api to find top songs
  displayPlaylist();
});

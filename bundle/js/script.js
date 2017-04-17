$(document).ready(function() {
  var videoData;
  var currentVideoIndex = 0;    //Start with first video.

  //showVideo(): show video in the player.
  var showVideo = function(videoIndex) {
    if (videoData.length == 0) {
      console.log("No videos found.");
      return;
    }

    //Circular array of videos.
    if (videoIndex < 0)
      currentVideoIndex = videoData.length - 1;
    else
      currentVideoIndex = (videoIndex % videoData.length);

    var selVideo = videoData[currentVideoIndex];

    $('.media-title').html(selVideo['title']);
    $('.media-description').html(selVideo['desc']);

    $('video source').attr('type', selVideo['videoType']);
    $('video source').attr('src', selVideo['videoSrc']);
    $('video')[0].load();
    $('video')[0].play();

    $('video')[0].onended = function(e) {
      showVideo(currentVideoIndex + 1);
    };
  };

  // Startup.
  (function() {
    renderMedia(
      function(videoDetails) {
        videoData = videoDetails;

        //load the first video.
        showVideo(currentVideoIndex);
      },
      function(errMsg) {
        console.log(JSON.stringify(errMsg));
        alert('Error occurred - please check console log.');      //version 1.0: just show the error in the alert box.
      }
    );

    $('.next-video-button').on('click', function() {
      showVideo(currentVideoIndex + 1);
    });

    $('.prev-video-button').on('click', function() {
      showVideo(currentVideoIndex - 1);
    });
  })();
});

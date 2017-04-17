/* queryServer(): wrapper for ajax call.
   apiEndPoint must get either 'getMediaCollection'
   or 'getMediaItem' (specify id in param).
*/
var queryServer = function (apiEndPoint, successFn, failFn, param) {
  var configObj = getConfig();

  if (! (apiEndPoint in configObj['endPoints'])) {
    console.log('Invalid endpoint "' + apiEndPoint + '" specified!".');
    return;
  }

  var urlStr = 'https://' + configObj['baseUrl'] + configObj['endPoints'][apiEndPoint];

  if (param != undefined)
     urlStr += param;

  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: urlStr,
    headers: {
      "Authorization": "Basic " + btoa(configObj['auth']['user'] + ":" + configObj['auth']['pwd'])
    },
  }).done(function(data) {
    if (typeof successFn == 'function')
      successFn(data);
  }).fail(function(err) {
    if (typeof failFn == 'function')
      failFn(err);
  });
};


/* renderMedia(): get all the playable media information & present it to the user.
   Retrieve all the playable media along with links.

   renderVideoSuccessFn(videoDetails): calls your callback with video details of the available videos.
   renderVideoFailFn(errorMsg): calls your callback with error message.
*/
var renderMedia = function(renderVideoSuccessFn, renderVideoFailFn) {
  var videoItems = [];
  var configObj = getConfig();

  queryServer('getMediaCollection',
    function(data) {
      var itemCount = data['count'];

      for(var i = 0; i < itemCount; i++) {    //Walk through the videos.
        var item = data['items'][i];

        var videoDetails = {};
        videoDetails['title'] = item['title'];
        videoDetails['desc'] = item['description_plain'];

        var files = item['joins']['files']['items'][0];   //Get the first video (v1 player: no checks, mvp).
        videoDetails['videoType'] = 'video/' + files['container'];      //video/mp4, etc.
        videoDetails['videoSrc'] = 'https://' + configObj['baseUrl'] + files['links']['content']; //full url to the video.

        videoItems.push(videoDetails);
      }

      renderVideoSuccessFn(videoItems);   //Returns important information.
    },
    function(errMsg) {
      renderVideoFailFn(errMsg);
    }
  );
};

// getConfig(): configuration settings.
var getConfig = function() {
  const configArr = {
      baseUrl: 'riipen.mediacore.tv',
      endPoints: {
        getMediaCollection: '/api2/media?joins=files',
        getMediaItem: '/api2/media/'
      },
      auth: {
        user: 'riipenchallenge@mediacore.com',
        pwd: 'riipenchallenge'
      }
  };

  return configArr;
};

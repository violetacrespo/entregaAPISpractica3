document.addEventListener("DOMContentLoaded", function() {
    var videoPlayer = document.getElementById("videoPlayer");
    var videoFileInput = document.getElementById("videoFileInput");
    var playButton = document.getElementById("playButton");
    var pauseButton = document.getElementById("pauseButton");
    var increaseVolumeButton = document.getElementById("increaseVolumeButton");
    var decreaseVolumeButton = document.getElementById("decreaseVolumeButton");
    var loadingMessage = document.getElementById("loadingMessage");

    videoFileInput.addEventListener("change", function(event) {
        var file = event.target.files[0];
        if (file) {
            loadingMessage.style.display = "block";
            var fileURL = URL.createObjectURL(file);
            loadVideo(fileURL);
        }
    });

    function loadVideo(url) {
        var mediaSource = new MediaSource();
        videoPlayer.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener("sourceopen", function() {
            var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');

            fetch(url)
                .then(response => response.arrayBuffer())
                .then(videoData => {
                    sourceBuffer.addEventListener('updateend', function() {
                        if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
                            mediaSource.endOfStream();
                            loadingMessage.style.display = "none";
                            videoPlayer.play();
                        }
                    });
                    sourceBuffer.appendBuffer(videoData);
                })
                .catch(error => {
                    console.error("Error al cargar el vídeo: ", error);
                    loadingMessage.style.display = "none";
                });
        });
    }

    playButton.addEventListener("click", function() {
        videoPlayer.play();
    });

    pauseButton.addEventListener("click", function() {
        videoPlayer.pause();
    });

    increaseVolumeButton.addEventListener("click", function() {
        if (videoPlayer.volume < 1) {
            videoPlayer.volume += 0.1;
        }
    });

    decreaseVolumeButton.addEventListener("click", function() {
        if (videoPlayer.volume > 0) {
            videoPlayer.volume -= 0.1;
        }
    });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.function == "captureVisible") {
            screenShot.captureVisible();
            sendResponse({ success: true });
        }
    });

var screenShot = {
    captureVisible: function () {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            chrome.tabs.executeScript(tabs[0].id, { file: "js/screenshot/captureVisible.js" }, function () {

                window.setTimeout(function () {
                    chrome.tabs.captureVisibleTab(null, { format: localStorage.format === 'jpg' ? 'jpeg' : 'png', quality: 100 }, function (img) {
                        //chrome.tabs.sendMessage(tabs[0].id, {msg: 'restore_overflow'});
                        let image = new Image();
                        image.onload = function () {
                            let canvas = document.createElement('canvas');
                            let ctx = canvas.getContext('2d');
                            canvas.width = image.naturalWidth;
                            canvas.height = image.naturalHeight;
                            ctx.drawImage(image, 0, 0);
                            /*
                            if (localStorage.keepOriginalResolution === 'true') {
                                canvas = downScaleCanvas(canvas, 1 / (window.devicePixelRatio || 1));
                            }
                            */
                            //canvas = downScaleCanvas(canvas, 1 / (window.devicePixelRatio || 1));

                            screenShot.createBlob(canvas, function () {
                                screenShot.createEditPage('save');
                            });
                        };
                        image.src = img;
                        console.log(img);
                    });
                }, 100);

            });
        });
    },
    createBlob: function (canvas, callback) {
        canvas.toBlob(function (blob) {
            let patch = localStorage.filePatch = (window.URL || window.webkitURL).createObjectURL(blob);
            if (callback) callback(patch, blob);
        }, 'image/' + (localStorage.format === 'jpg' ? 'jpeg' : 'png'), localStorage.imageQuality / 100);
    },
    createEditPage: function (params) {
        console.log(params)
        let option = params || localStorage.enableEdit;
        switch (option) {
            case 'copy':
                screenShot.copyToClipboard(localStorage.filePatch);
                break;
            case 'save':
                screenShot.download(localStorage.filePatch);
                break;
            case 'edit':
            case 'done':
            default:
                //screenShot.setScreenName();
                chrome.tabs.create({ url: 'app/#/popup?' + ((option === 'edit' || !option) ? '' : ('?' + option)) });
                break;
        }
    },
    download: function () {
        let canvas = document.createElement('canvas');
        let screen = new Image();
        screen.onload = function () {
            canvas.width = screen.width;
            canvas.height = screen.height;

            canvas.getContext('2d').drawImage(screen, 0, 0);
            chrome.downloads.download({
                url: canvas.toDataURL('image/' + (localStorage.format === 'jpg' ? 'jpeg' : 'png'), localStorage.imageQuality / 100),
                filename: "test",//screenShot.getFileName(),
                saveAs: localStorage.enableSaveAs !== 'false'
            });
        };
        screen.src = localStorage.filePatch;
    }
}
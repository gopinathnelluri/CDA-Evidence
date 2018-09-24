chrome.commands.onCommand.addListener(function(command) {
    if(command == "take_screen_shot_edit"){
        screenShot.captureVisiblePartAndEdit();
    } else if(command == "capture_window_and_edit"){
        screenShot.captureWindowAndEdit();
    } else if(command == "take_screen_shot_upload"){
        screenShot.captureVisiblePartAndUpload();
    } 
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.function == "captureVisible") {
            screenShot.captureVisible();
            sendResponse({ success: true });
        } else if (request.function == "captureVisiblePartAndEdit") {
            screenShot.captureVisiblePartAndEdit();
            sendResponse({ success: true });
        } else if (request.function == "captureWindowAndEdit") {
            screenShot.captureWindowAndEdit();
            sendResponse({ success: true });
        } else if (request.function == "captureVisiblePartAndUpload") {
            screenShot.captureVisiblePartAndUpload();
            sendResponse({ success: true });
        } else if (request.function == "captureFullPage") {
            screenShot.captureFullPage();
            sendResponse({ success: true });
        } else if (request.function == "uploadToImageFromEditor") {
            screenShot.uploadToImageFromEditor();
            sendResponse({ success: true });
        } 
});

var screenShot = {
    citiCDAurl: "localhost:4200",
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


                            screenShot.createBlob(canvas, function (patch, blob) {
                                console.log(patch, blob);
                                screenShot.createEditPage('edit', patch);
                            });
                        };
                        image.src = img;
                    });
                }, 100);

            });
        });
    },

    captureVisiblePartAndEdit: function () {
        chrome.tabs.captureVisibleTab(null, { format: localStorage.format === 'jpg' ? 'jpeg' : 'png', quality: 100 }, function (img) {
            screenShot.createEditPage('edit', img);
        });
    },

    captureVisiblePartAndUpload: function () {
        chrome.tabs.captureVisibleTab(null, { format: localStorage.format === 'jpg' ? 'jpeg' : 'png', quality: 100 }, function (img) {
            
            screenShot.submitToCDA(img);
            /*
            localStorage.setItem('uploadImage', img);
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
                chrome.tabs.query({ }, function (allTabsList) {
                    let allTabs = allTabsList;
                    console.log("tabs",allTabs);
                    
                    for(var i = 0;i < allTabs.length;++i){
                        if(allTabs[i].url.includes("localhost:4200")){
                            console.log("main tab",allTabs[i]);
                            chrome.tabs.update(allTabs[i].id, {highlighted: true, active: true}, (tab) => {
                                chrome.tabs.executeScript(tab.id, {file: "js/screenshot/submitImage.js"}, function (tab) {
                                    chrome.tabs.executeScript(tab.id, { code: "submitImageNow('"+img+"')" }, function (response) {
                                    })
                                })
                            });
                           
                            
                            chrome.tabs.sendMessage(allTabs[i].id, {greeting: "hello"}, function(response) {
                                console.log(response.farewell);
                            });
                        }
                    }
                })
                
                tab = tabs[0];
                chrome.tabs.executeScript(tab.id, {file: "js/screenshot/uploadImage.js"}, function () {
                    chrome.tabs.executeScript(tab.id, { code: "uploadImageNow('"+img+"')" }, function (response) {
                    })
                })
                
            })
            */
        });
    },

    uploadToImageFromEditor: function(){
        var img  = localStorage.uploadToImageFromEditor;
        if(img){
            screenShot.submitToCDA(img);
        }
    },

    submitToCDA: function(img){
        chrome.tabs.query({ }, function (allTabsList) {
            let allTabs = allTabsList;
            console.log("tabs",allTabs);
            
            for(var i = 0;i < allTabs.length;++i){
                if(allTabs[i].url.includes(screenShot.citiCDAurl)){
                    console.log("main tab",allTabs[i]);
                    chrome.tabs.update(allTabs[i].id, {highlighted: true, active: true}, (tab) => {
                        chrome.tabs.executeScript(tab.id, {file: "js/screenshot/submitImage.js"}, function (tab) {
                            chrome.tabs.executeScript(tab.id, { code: "submitImageNow('"+img+"')" }, function (response) {
                            })
                        })
                    });
                   
                    /*
                    chrome.tabs.sendMessage(allTabs[i].id, {greeting: "hello"}, function(response) {
                        console.log(response.farewell);
                    });*/
                }
            }
        })
    },

    captureWindowAndEdit: function () {
        screenShot.captureDesktop(function (canvas) {
            screenShot.createBlob(canvas, function () {
                //console.log(canvas.toDataURL());
                screenShot.createEditPage('edit', canvas.toDataURL());
            });
        });
    },

    captureDesktop: function (cb) {
        chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], function (streamId) {
            window.navigator.webkitGetUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: streamId,
                        maxWidth: 4000,
                        maxHeight: 4000
                    }
                }
            }, function (stream) {
                let video = document.createElement('video');
                video.addEventListener('loadedmetadata', function () {
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext("2d");
                    canvas.width = this.videoWidth;
                    canvas.height = this.videoHeight;
                    ctx.drawImage(this, 0, 0);

                    stream.getTracks()[0].stop();
                    this.pause();
                    this.remove();
                    canvas.remove();
                    cb && cb(canvas);
                }, false);
                video.src = window.URL.createObjectURL(stream);
                video.play();
            }, function (err) {
                console.log(err);
            });
        });
    },

    captureFullPage: function () {

        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            tab = tabs[0];

            //chrome.tabs.executeScript(tab.id, {file: "js/screenshot/fullPage.js"}, function () {
            /*
            chrome.tabs.executeScript(tab.id, {code: "let timeScrollEntirePage = " + (localStorage.timeScrollEntirePage || 200) + ";"}, function () {
                //chrome.tabs.executeScript(tab.id, {file: "js/page.js"}, function () {
                //    sendScrollMessage(tab);
                //});
            });
            */
            //});

            chrome.tabs.executeScript(tab.id, { code: "var x = {windowWidth: window.innerWidth, windowHeight: window.innerHeight, documentWidth: document.body.clientWidth, documentHeight: document.body.clientHeight}; x" }, function (response) {
                console.log(response);
                if (response && response[0]) {
                    let windowWidth = response[0].windowWidth;
                    let windowHeight = response[0].windowHeight;
                    let documentWidth = response[0].documentWidth;
                    let documentHeight = response[0].documentHeight;
                    var imageArray = [];
                    //let fullPageImage = new Image();

                    let fullPageCanvas = document.createElement('canvas');
                    let fullPageCTX = fullPageCanvas.getContext('2d');
                    fullPageCanvas.width = documentWidth;
                    fullPageCanvas.height = documentHeight;
                    if (windowWidth == documentWidth) {
                        if (documentHeight <= windowHeight) {

                        } else {
                            var height = 0;
                            function f() {
                                chrome.tabs.executeScript(tab.id, { code: "window.scrollTo(0, " + height + ")" }, function () {
                                    chrome.tabs.captureVisibleTab(null, { format: localStorage.format === 'jpg' ? 'jpeg' : 'png', quality: 100 }, function (dataURI) {
                                        var myCanvas = document.createElement('canvas');
                                        
                                        var ctx = myCanvas.getContext('2d');
                                        var img = new Image;
                                        
                                        img.src = dataURI;
                                        img.onload = function(){
                                            myCanvas.width = img.naturalWidth;
                                            myCanvas.height = img.naturalHeight;
                                            ctx.drawImage(img,0,0);
                                            console.log(dataURI)
                                            console.log(myCanvas.toDataURL());
                                        }
                                        
                                        
                                        /*
                                        screenShot.createBlob(myCanvas, function (patch, blob) {
                                            console.log(patch, blob);
                                            chrome.tabs.create({ url: patch });
                                        });
                                        

                                        //imageArray.push(image);
                                        fullPageCTX.drawImage(img, 0, height);
                                        height = height + windowHeight;
                                        if (height <= documentHeight) {
                                            //setTimeout(f, 300);
                                        } else {
                                            console.log(fullPageCanvas.toDataURL());
                                            screenShot.createBlob(fullPageCanvas, function (patch, blob) {
                                                console.log(patch, blob);
                                                chrome.tabs.create({ url: patch });
                
                                            });
                                        }
                                        */
                                    })
                                });
                            }
                            f();
                        }
                    }

                }
            });
        });



        console.log("new");
        let screencanvas = {};
        let tab;

        function sendScrollMessage(tab) {
            screenShot.newwholepage = true;
            screencanvas = {};

            if (scroll_crop === true) {
                chrome.tabs.sendRequest(tab.id, {
                    msg: 'scrollPage',
                    'scroll_crop': true,
                    'hideFixedElements': (localStorage.hideFixedElements === 'true'),
                    'xs': xs,
                    'ys': ys,
                    'ws': ws,
                    'hs': hs
                });
            } else {
                chrome.tabs.sendRequest(tab.id, {
                    msg: 'scrollPage',
                    'scroll_crop': false,
                    'hideFixedElements': (localStorage.hideFixedElements === 'true')
                });
            }
        }

        chrome.extension.onRequest.addListener(function (request, sender, callback) {
            let fn = { 'capturePage': capturePage, 'openPage': openPage }[request.msg];
            if (fn) {
                fn(request, sender, callback);
            }
        });

        function scrollPage() {

        }

        //capturePage();

        function capturePage(data, sender, callback) {
            let canvas;
            if (screenShot.newwholepage) {
                screenShot.newwholepage = false;
                canvas = document.createElement('canvas');
                let maxSize = 32767;
                let maxArea = 268435456;
                let width = Math.ceil(Math.min(data.totalWidth * data.ratio, maxSize));
                let height = Math.ceil(Math.min(data.totalHeight * data.ratio, maxSize));
                if (!data.scroll_crop) {
                    width -= data.hasVScroll ? data.scrollWidth : 0;
                    height -= data.hasHScroll ? data.scrollWidth : 0;
                }
                if (width * height < maxArea) {
                    canvas.width = width;
                    canvas.height = height;
                } else {
                    canvas.width = width;
                    canvas.height = Math.floor(maxArea / width);
                }
                screencanvas.canvas = canvas;
                screencanvas.ctx = canvas.getContext('2d');
            }

            chrome.tabs.captureVisibleTab(null, { format: localStorage.format === 'jpg' ? 'jpeg' : 'png', quality: 100 }, function (dataURI) {
                /*
                let image = new Image();
                let x = 0;
                let y = Math.ceil(data.elem ? (data.h < data.elem.h ? (data.elem.y + (data.elem.h - data.h)) : data.elem.y) : 0) * data.ratio;
                let w = Math.ceil(data.w) * data.ratio - (data.hasVScroll ? data.scrollWidth : 0);
                let h = Math.ceil(data.h) * data.ratio - (data.hasHScroll ? data.scrollWidth : 0);
                let x2 = Math.ceil(data.scrollLeft % data.x > 0 ? data.scrollLeft : data.x) * data.ratio;
                let y2 = Math.ceil(data.elem ? (data.y + data.elem.y) : data.y) * data.ratio;
                let w2 = w;
                let h2 = h;
                image.onload = function () {
                    if (data.scroll_crop) {
                        x = Math.ceil(data.x) * data.ratio;
                        y = Math.ceil(data.y_shift) * data.ratio;
                        w = Math.ceil(data.w) * data.ratio;
                        h = Math.ceil(data.h) * data.ratio;
                        x2 = 0;
                        y2 = Math.ceil(data.y_crop) * data.ratio;
                        w2 = Math.ceil(data.w) * data.ratio;
                        h2 = Math.ceil(data.h) * data.ratio;
                    }

                    // w = image.naturalWidth < w ? image.naturalWidth : w;
                    // h = image.naturalHeight < h ? image.naturalHeight : h;
                    // console.log(image.naturalWidth, w, image.naturalHeight, h);
                    // console.log(data, x, y, w, h, x2, y2, w2, h2);

                    screencanvas.ctx.drawImage(image, x, y, w, h, x2, y2, w2, h2);
                    callback(true);
                };*/
                //image.src = dataURI;
                //console.log(dataURI)
            });
        }
        function openPage(data) {

        }
        /*
                function openPage(data) {
                    if (scroll_crop === true) scroll_crop = false;
        
                    if (localStorage.keepOriginalResolution === 'true') screencanvas.canvas = downScaleCanvas(screencanvas.canvas, data.zoom);
        
                    screenShot.createBlob(screencanvas.canvas, function (path) {
                        if (save_scroll) {
                            save_scroll = false;
                            screenShot.download(path);
                        } else if (send_nimbus) {
                            send_nimbus = false;
                            screenShot.createEditPage('nimbus');
                        } else if (send_slack) {
                            send_slack = false;
                            screenShot.createEditPage('slack');
                        } else if (send_google) {
                            send_google = false;
                            screenShot.createEditPage('google');
                        } else if (send_print) {
                            send_print = false;
                            screenShot.createEditPage('print');
                        } else {
                            screenShot.createEditPage();
                        }
                    });
                }
        
                chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
                    tab = tabs[0];
                    chrome.tabs.executeScript(tab.id, {file: "js/clearCapture.js"}, function () {
                        chrome.tabs.executeScript(tab.id, {code: "let timeScrollEntirePage = " + (localStorage.timeScrollEntirePage || 200) + ";"}, function () {
                            chrome.tabs.executeScript(tab.id, {file: "js/page.js"}, function () {
                                sendScrollMessage(tab);
                            });
                        });
                    });
                });
        */
    },
    createBlob: function (canvas, callback) {
        canvas.toBlob(function (blob) {
            let patch = localStorage.filePatch = (window.URL || window.webkitURL).createObjectURL(blob);
            if (callback) callback(patch, blob);
        }, 'image/' + (localStorage.format === 'jpg' ? 'jpeg' : 'png'), localStorage.imageQuality / 100);
    },
    createEditPage: function (params, image) {
        console.log(image)
        localStorage.setItem('patch', image)
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
                chrome.tabs.create({ url: 'app/index.html#edit' });
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
                filename: screenShot.getFileName(),
                saveAs: localStorage.enableSaveAs !== 'false'
            });
        };
        screen.src = localStorage.filePatch;
    },
    getFileName: function () {
        let s = "{case}_{timestamp}";//localStorage.fileNamePatternScreenshot;
        let f = (localStorage.format === 'jpg' ? 'jpeg' : 'png');
        let info = JSON.parse(localStorage.pageinfo || '{}');
        let url = document.createElement('a');
        url.href = info.url || '';
        s = s.replace(/\{url}/, info.url || '')
            .replace(/\{case}/, '1234')
            .replace(/\{timestamp}/, +new Date() || '');

        return s.replace(/[\*\|\\\:\"\<\>\?\/#]+/ig, '-') + ('.' + f);
    }
}
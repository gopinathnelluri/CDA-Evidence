function submitImageNow(img, meta){
    console.log(img,meta);
    var div = document.createElement('div');

    div.className = 'upload-message-container';
    div.id = "upload-message-container"

    div.innerHTML =
        "<div style='position:fixed; top:0px;z-index:999999;width:100%;height:100%;display: flex;justify-content: center;align-items: center;'>"
        +"<div style='width:300px;height:fit-content;border:5px solid #9c9c9c;padding: 10px;border-radius: 5px;background: white;'>"
        +"    <div style='color:#043f77!important;width:100%;text-align:center;border-bottom: 5px solid #043f77;margin-bottom: 5px;'>"
        +"        <h3 style='color:#043f77!important;'>CDA Evidence</h3>"
        +"    </div>"
        +"    <div style='width:100%;background: #e4e4e4;'>"
        +"    <img id='cda-evidence-image' style='display:block;margin-left:auto;margin-right:auto;max-width:100%;max-height:600px;'/>"
        +"    </div>"
        +"    <div style='width:100%;text-align:center;padding-top:20px;padding-bottom:20px;'>"
        +"        <b><p id='cda-upload-message'>uploading..!</p></b>"
        +"    </div>"
        +"</div>"
        +"</div>";

    
    document.getElementsByTagName('body')[0].appendChild(div);
    document.getElementById("cda-evidence-image").src = img;

    
    prepareBlob(img, div, meta);
    /*
    setTimeout( () => {
        document.getElementById("cda-upload-message").innerText = "Upload Complted!";
        setTimeout( () => {
            div.parentNode.removeChild(div);
        }, 2000);
    }, 1000);
    */
}

function prepareBlob(img, div, meta){
    let image = new Image();
    image.src = img;
    image.onload = function () {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0);
        canvas.toBlob((blob) => {
            post(blob, div, meta)
        })
    };   
}

function post(blob, div, meta){
    var metaData = JSON.parse(meta);

    metaData["upload_timestamp"] = +new Date();
    metaData = JSON.stringify(metaData);
    console.log(metaData);
    var data = new FormData();
    data.append("image", blob, "image123.png");
    data.append("meta", metaData);
    data.append("submit", "done");

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        console.log(this.responseText);
        document.getElementById("cda-upload-message").innerText = "Upload Complted!";
        setTimeout( () => {
            if(document.getElementById("refreshImageList")){
                document.getElementById("refreshImageList").click();
            } else if(document.getElementById("cdaƒrame") && document.getElementById("cdaƒrame").contentWindow.document.getElementById("refreshImageList")){
                document.getElementById("cdaƒrame").contentWindow.document.getElementById("refreshImageList").click();;
            }
            div.parentNode.removeChild(div);
        }, 2000);
    }
    });

    xhr.open("POST", "http://localhost:8080/cda/api/uploadImage.php");
    xhr.setRequestHeader("cache-control", "no-cache");
    //xhr.setRequestHeader("postman-token", "7fe1c939-1d5e-3b34-3ede-9d7df9d52f8f");

    xhr.send(data);
}


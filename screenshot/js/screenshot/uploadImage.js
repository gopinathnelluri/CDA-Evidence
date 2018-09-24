function uploadImageNow(img){
    var div = document.createElement('div');

    div.className = 'upload-message-container';
    div.id = "upload-message-container"

    div.innerHTML =
        "<div style='position:fixed; top:0px;z-index:999999;width:100%;height:100%;display: flex;justify-content: center;align-items: center;'>"
        +"<div style='width:300px;height:fit-content;border:5px solid #9c9c9c;padding: 10px;border-radius: 5px;background: white;'>"
        +"    <div style='color:#043f77!important;width:100%;text-align:center;border-bottom: 5px solid #043f77;margin-bottom: 5px;'>"
        +"        <h3 style='color:#043f77!important;'>CDA Evidence</h3>"
        +"    </div>"
        +"    <div style='width:100%;'>"
        +"    <img id='cda-evidence-image' style='width:100%;'/>"
        +"    </div>"
        +"    <div style='width:100%;text-align:center;padding-top:20px;padding-bottom:20px;'>"
        +"        <b><p id='cda-upload-message'>uploading..!</p></b>"
        +"    </div>"
        +"</div>"
        +"</div>";

    
    document.getElementsByTagName('body')[0].appendChild(div);
    document.getElementById("cda-evidence-image").src = img;

    setTimeout( () => {
        document.getElementById("cda-upload-message").innerText = "Upload Complted!";
        setTimeout( () => {
            div.parentNode.removeChild(div);
        }, 2000);
    }, 1000);
}


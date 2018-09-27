import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  
  iframeMode: boolean = false;
  constructor() {
    
  }

  ngOnInit() {
    console.log(localStorage.iframeMode);

   if(localStorage.iframeMode != undefined && localStorage.iframeMode != null){
    this.iframeMode = localStorage.iframeMode == "true" ? true : false;
   } else {
     localStorage.setItem("iframeMode", "false");
   }
  }

  iframeModeChanged(event){
    if(event){
      localStorage.setItem("iframeMode", "true");
    } else {
      localStorage.setItem("iframeMode", "false");
    }
    console.log("check",localStorage.iframeMode);
  }

  captureVisiblePart(){
    (<any>chrome.extension).sendMessage({function: "captureVisible"}, function(response) {
      if(response.success){
        console.log("captureVisible");
      }
    });
  }

  captureVisiblePartAndEdit(){
    (<any>chrome.extension).sendMessage({function: "captureVisiblePartAndEdit"}, function(response) {
      if(response.success){
        console.log("captureVisiblePartAndEdit");
      }
    });
  }

  captureWindowAndEdit(){
    (<any>chrome.extension).sendMessage({function: "captureWindowAndEdit"}, function(response) {
      console.log(response);
      if(response.success){
        console.log("captureWindowAndEdit");
      }
    });
  }

  captureWindowAndUpload(){
    (<any>chrome.extension).sendMessage({function: "captureWindowAndUpload"}, function(response) {
      console.log(response);
      if(response.success){
        console.log("captureWindowAndUpload");
      }
    });
  }

  captureVisiblePartAndUpload(){
    (<any>chrome.extension).sendMessage({function: "captureVisiblePartAndUpload"}, function(response) {
      if(response.success){
        console.log("captureVisiblePartAndUpload");
      }
    });
  }

  captureFullPage(){
    (<any>chrome.extension).sendMessage({function: "captureFullPage"}, function(response) {
      if(response.success){
        console.log("captureFullPage");
      }
    });
  }
  
  captureFullPageAndUpload(){
    (<any>chrome.extension).sendMessage({function: "captureFullPageAndUpload"}, function(response) {
      if(response.success){
        console.log("captureFullPageAndUpload");
      }
    });
  }

}

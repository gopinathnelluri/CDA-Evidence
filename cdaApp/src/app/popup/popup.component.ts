import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  //background = chrome.extension.getBackgroundPage();
  //extension:any = chrome.extension;
  
  
  background:any = chrome.extension.getBackgroundPage();
  //sendMessage:any = this.background.sendMessage;
  
  constructor() {
    
  }

  ngOnInit() {
    console.log(chrome,"\n============\n",this.background);
  }

  captureVisiblePart(){
    (<any>chrome.extension).sendMessage({function: "captureVisible"}, function(response) {
      if(response.success){
        console.log("hey");
      }
    });
    //this.sendMessage();
    //this.screenshot.captureVisible();
  }

}

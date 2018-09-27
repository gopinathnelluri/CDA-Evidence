import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//var ImageEditor = require('tui-image-editor');
//var blackTheme = require('./js/theme/black-theme.js');
//import {ImageEditor} from 'tui-image-editor';

declare var tui: any;
declare var blackTheme:any;
declare var whiteTheme:any;


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  imageEditor: any;
  patch: any;
  lastTextObject: any;
  userGenratedMeta: any = {};
  
  constructor(private route: ActivatedRoute) { 
    localStorage.removeItem('userGeneratedMeta');
  }

  ngOnInit() {
    this.patch = localStorage.patch ? localStorage.patch : 'https://uh8yh30l48rpize52xh0q1o6i-wpengine.netdna-ssl.com/wp-content/uploads/2014/05/header-image-photo-rights.png';
    this.imageEditor = new tui.ImageEditor('#tui-image-editor-container', {
      includeUI: {
          loadImage: {
              path: this.patch,
              name: 'SampleImage'
          },
          theme: blackTheme, // or whiteTheme
          initMenu: 'text',
          menuBarPosition: 'bottom'
      },
      //cssMaxWidth: 700,
      //cssMaxHeight: 500
      cssMaxWidth: 700,
      cssMaxHeight: 500,
      selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70
      }
    });

    this.imageEditor.on('objectActivated', function(props) {
      console.log("objectActivated",props);
      if(this.lastTextObject != undefined && this.lastTextObject != null){
        this.userGenratedMeta[this.lastTextObject] = this.imageEditor.getObjectProperties(this.lastTextObject, 'text');
      }
      if(props.type === "i-text"){
        this.lastTextObject = props.id;
        this.userGenratedMeta[this.lastTextObject] = this.imageEditor.getObjectProperties(this.lastTextObject, 'text');
      }
    }.bind(this));

    this.imageEditor.on('mousedown', function(event, originPointer) {
      if(this.lastTextObject != undefined && this.lastTextObject != null){
        this.userGenratedMeta[this.lastTextObject] = this.imageEditor.getObjectProperties(this.lastTextObject, 'text');
      }
    }.bind(this));

    console.log(this.imageEditor);

    this.addUploadButton();
 
  }

  addUploadButton(){
    let uploadButton = '<button id="uploadButton" class="tui-image-editor-download-btn" style="background-color: #5286ee;border: 1px solid #5286ee;color: #fff;font-family: NotoSans, sans-serif;font-size: 12px">Upload</button>';
    document.getElementsByClassName("tui-image-editor-header-buttons")[0].innerHTML += uploadButton;
    document.getElementById("uploadButton").addEventListener('click', function() {
      //alert("CDA Evidence uploaded");
      this.uploadClicked();
    }.bind(this));
  }

  uploadClicked(){
    this.userGenratedMeta[this.lastTextObject] = this.imageEditor.getObjectProperties(this.lastTextObject, 'text');
    var imageElement;
    var userGenTextMeta = [];
    if(Object.keys(this.userGenratedMeta).length > 0){
      console.log(Object.keys(this.userGenratedMeta));
      Object.keys(this.userGenratedMeta).forEach(function(key) {
        if(key != undefined && key != "undefined"){
          userGenTextMeta.push(this.userGenratedMeta[key].text);
        }
      }.bind(this));
    }
    imageElement = document.getElementsByClassName("lower-canvas")[0];
    if(imageElement){
      var img = imageElement.toDataURL();
        console.log("hello2",img);
        localStorage.setItem('uploadToImageFromEditor', img);
        localStorage.setItem('userGeneratedMeta', JSON.stringify(userGenTextMeta));
        (<any>chrome.extension).sendMessage({function: "uploadToImageFromEditor"}, function(response) {
          if(response.success){
            console.log("uploadToImageFromEditor");
            window.close();
          }
        });
    }
  }
}

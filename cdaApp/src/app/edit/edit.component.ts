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

  patch: any;
  
  constructor(private route: ActivatedRoute) { 
   
  }

  ngOnInit() {
    this.patch = localStorage.patch ? localStorage.patch : 'https://uh8yh30l48rpize52xh0q1o6i-wpengine.netdna-ssl.com/wp-content/uploads/2014/05/header-image-photo-rights.png';
    var imageEditor = new tui.ImageEditor('#tui-image-editor-container', {
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


    this.addUploadButton();
 
  }

  addUploadButton(){
    let uploadButton = '<button id="uploadButton" (click)="uploadClicked()" class="tui-image-editor-download-btn" style="background-color: #5286ee;border: 1px solid #5286ee;color: #fff;font-family: NotoSans, sans-serif;font-size: 12px">Upload</button>';
    document.getElementsByClassName("tui-image-editor-header-buttons")[0].innerHTML += uploadButton;
    document.getElementById("uploadButton").addEventListener('click', function() {
      alert("CDA Evidence uploaded");
      window.close();
    });
  }

  uploadClicked(){
    alert("uploaded");
  }
}

import { Component, OnInit } from '@angular/core';
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

  

  constructor() { }

  ngOnInit() {
    var imageEditor = new tui.ImageEditor('#tui-image-editor-container', {
      includeUI: {
          loadImage: {
              path: 'https://uh8yh30l48rpize52xh0q1o6i-wpengine.netdna-ssl.com/wp-content/uploads/2014/05/header-image-photo-rights.png',
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

 
  }

}

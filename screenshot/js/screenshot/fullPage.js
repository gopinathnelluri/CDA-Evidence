/*
console.log("Taking Full Page ScreenShot!");

function windowDimensionForCDAExtension() {
    var w = window.innerWidth;
    var h = window.innerHeight;
}

function scrollPage(width, height) {
    window.scrollTo(width, height);
}
*/
var fixedElements = [];
function hideFixedElements() {
    document.getElementsByTagName("body")[0].classList.add("citiCDAHideScrollBat");
    fixedElements = [];
    var nodeIterator = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false);
    var currentNode;
    while (currentNode = nodeIterator.nextNode()) {
        var nodeComputedStyle = document.defaultView.getComputedStyle(currentNode, "");
        if (!nodeComputedStyle) return;
        if (nodeComputedStyle.getPropertyValue("position") === "fixed" || nodeComputedStyle.getPropertyValue("position") === "sticky") {
            fixedElements.push(currentNode);
        }
    }

    for (var k = 0, len = fixedElements.length; k < len; ++k) {
        // transition-property: none !important; transform: none !important; animation: none !important;
        //fixedElements[k].style.cssText += 'opacity: 0 !important; animation: none !important';
        fixedElements[k].classList.add("citiCDAFixedElementsHide");
    }
}

function unHideFixedElements(){
    document.getElementsByTagName("body")[0].classList.remove("citiCDAHideScrollBat");
    for (var k = 0, len = fixedElements.length; k < len; ++k) {
        // transition-property: none !important; transform: none !important; animation: none !important;
        //fixedElements[k].style.cssText += 'opacity: 1 !important; animation: none !important';
        fixedElements[k].classList.remove("citiCDAFixedElementsHide");
    }
}

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
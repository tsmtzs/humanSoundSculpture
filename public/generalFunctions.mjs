// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//
// Web client javascript.
// This file collects several functions
// no specific to this piece.
// ////////////////////////////////////////////////////////////

// Enable full screen mode
// adapted from
//https://developer.mozilla.org/samples/domref/fullscreen.html
function toggleFullScreen(elem) {
    if (!document.mozFullScreen && !document.webkitFullScreen) {
	if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
	} else {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
    } else {
	if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
	} else {
            document.webkitCancelFullScreen();
	}
    }
}

export { toggleFullScreen };


// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//
// Web client javascript.
// This file collects several functions
// no specific to this piece.
// ////////////////////////////////////////////////////////////

// Enable full screen mode
// adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
	element.requestFullscreen().catch(err => {
	    alert(`Error in Promises: ${err.message} (${err.name})`);
	});
    } else {
	document.exitFullscreen();
    }
}

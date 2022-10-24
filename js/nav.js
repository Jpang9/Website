var nav = document.getElementById("web-nav")
var title = nav.getElementsByClassName("title")[0]

title.addEventListener('click', toggleMenu, false);

nav.addEventListener('touchstart', handleTouchStart, false);        
nav.addEventListener('touchmove', handleTouchMove, false);

var _state = false
                                                   
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             
         evt.originalEvent.touches; 
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                                                      
    yDown = firstTouch.clientY;      
                               
};                                                
                                                                         
function handleTouchMove(evt) {
    if (window.innerWidth >= 1001) {
        return;
    }

    if ( ! yDown ) {
        return;
    }
                                 
    var yUp = evt.touches[0].clientY;

    var yDiff = yDown - yUp;
                                                                         

    if ( yDiff > 0 ) {
            navBarState(false)           
            /* up swipe */ 
    } else { 
            navBarState(true)
            /* down swipe */
    }                                                                 
    yDown = null;                                             
};

function toggleMenu() {
    if (window.innerWidth >= 1001) {
        return;
    }
    navBarState(!_state)
}


function navBarState(state) {
    if (state) {
        _state = state
        nav.classList.add("shown")
        document.getElementsByTagName("html")[0].style.overscrollBehaviorY = "contain" 
        document.body.style.overflowY = "hidden"
    } else {
        _state = state
        nav.classList.remove("shown")

        document.getElementsByTagName("html")[0].style.overscrollBehaviorY = "initial" 
        setTimeout( function() { document.body.style.overflowY = "initial"}, 250)
    }
}
const mix_x = 50;
const max_x = 50;
const within_ms = 300;

let start_x;
let start_y;
let start_time;

const touchStart = (e)=>{
  e.preventDefault()
     start_x = e.touches[0].pageX;
     start_y = e.touches[0].pageY;
     start_time = new Date();
  }
  
const Swipe = (e) => {
    let end_x = e.changedTouches[0].pageX;
    let end_y = e.changedTouches[0].pageY;
    let end_time = new Date();
    let move_x = end_x - start_x;
    let move_y = end_y - start_y;
    let time = end_time - start_time;
    let x_abs = Math.abs(move_x);
    let y_abs = Math.abs(move_y);
    let swiped = x_abs > mix_x && y_abs < max_x && time < within_ms;
    
    if (swiped) {
      return {
        left : move_x < 0, 
        right : move_x > 0, 
        up: move_y < 0, 
        down: move_y > 0 }
    } else return false 
}

const swipeLeft = ()=> Swipe().left
const swipeRight = ()=> Swipe().right
const swipeUp = ()=> Swipe().up
const swipeDown = ()=> Swipe().down
 
 
 
element.addEventListener('touchstart',(e)=>{})
 
 
 
 
 
 
const $ = sel => document.querySelector(sel)
const $$ = sel => document.querySelectorAll(sel)
const arrayFrom = (sel) => Array.from($$(sel))
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return {
    year : [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
			date.getFullYear()
    ].join('-'),
    hours:[
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
    //  padTo2Digits(date.getSeconds()),
    ].join(':')
  };
}

const isMobile = ()=> navigator.userAgent.match(/Android/i) ||
navigator.userAgent.match(/iPhone/i)
const allElements = (tag)=> document.getElementsByTagName(tag);
const ID_all = (ids = "*",allIds = [])=> {;
  for (var i = 0, n = allElements(ids).length; i < n; ++i) {
    var el = allElements(ids)[i];
    if (el.id) { allIds.push(el.id); }
  }
    return allIds
  }

  const safeID = (id,num = null ) => {
 
    (!num) && (num = 0)
    if(!ID_all().includes(id)){
      return id
    }
    else{
      num ++
      safeID(id,num)
    }
}
// converts string from camelCase to snake-case
function toSnakeCase(text) {
  return text.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}


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

console.log(String.replace)
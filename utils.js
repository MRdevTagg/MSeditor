const $ = sel => document.querySelector(sel)
const $$ = sel => document.querySelectorAll(sel)
const arr = (sel) => Array.from($$(sel))
let KEY = 'html'
const editor = ()=>$(`#${KEY}edit`);

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

const isTouch = ()=> 
{ let touch = new Boolean
  navigator.userAgent.match(/Android/i) ||
navigator.userAgent.match(/iPhone/i)? touch = true : touch = false 
return touch;
}

const evBind = (touch,no_touch)=>{
  if(isTouch())return touch;
  else return no_touch;
}

console.log(isTouch())
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



const addDrag = (el)=>{
    const isDragging = ()=> { el.dataset.draggin;}
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    const setDataset = (element,attribute,value)=>
    {element.setAttribute('data-'+attribute,value)}

    el.addEventListener(evBind('touchstart','mousedown'),
    (e) =>{
     el.style['filter'] = 'brightness(120%)'

      setDataset(el,'draggin','on')
      dragOffsetX = isTouch() ? e.touches[0].clientX - el.offsetLeft : e.clientX - el.offsetLeft;
      dragOffsetY = isTouch() ? e.touches[0].clientY - el.offsetTop : e.clientY - el.offsetTop;
    });
    el.addEventListener(evBind('touchmove','mousemove'), 
    (e) =>{
      if (el.dataset.draggin == 'on') {
        if(el.offsetTop - el.offsetHeight + 50 >= visualViewport.height - el.offsetHeight-25){
           setDataset(el,'draggin','off')
          el.style.top = el.offsetTop - el.offsetHeight + 25 + 'px'
        }  else{ 
          x = isTouch() ? e.changedTouches[0].clientX - dragOffsetX : e.clientX - dragOffsetX;
          y = isTouch() ? e.changedTouches[0].clientY - dragOffsetY : e.clientX - dragOffsetX;
        el.style.left =  `${x}px`;
        el.style.top = `${y}px`;
      }}
    });
    el.addEventListener(evBind('touchend','click'),(event)=> {
      el.style['filter'] = 'brightness(100%)'
      el.style.transform = 'scale(1)'
        setDataset(el,'draggin','off')
    },{bubbles:false});
  
}
addDrag($('.tools'))
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



const addDrag = (movableDiv)=>{
    const isDragging = ()=> { movableDiv.dataset.draggin;}
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    const setDataset = (element,attribute,value)=>
    {element.setAttribute('data-'+attribute,value)}

    movableDiv.addEventListener('touchstart',
    (event) =>{
     movableDiv.style['filter'] = 'brightness(120%)'

      setDataset(movableDiv,'draggin','on')
      dragOffsetX = event.touches[0].clientX - movableDiv.offsetLeft;
      dragOffsetY = event.touches[0].clientY - movableDiv.offsetTop;
    });
    movableDiv.addEventListener('touchmove', 
    (event) =>{
      if (movableDiv.dataset.draggin == 'on') {
        if(movableDiv.offsetTop - movableDiv.offsetHeight + 50 >= visualViewport.height - movableDiv.offsetHeight-25){
           setDataset(movableDiv,'draggin','off')

          movableDiv.style.top = movableDiv.offsetTop - movableDiv.offsetHeight + 25 + 'px'
        }
          else{ 


        movableDiv.style.left = (event.changedTouches[0].clientX - dragOffsetX) + 'px';
        movableDiv.style.top = (event.changedTouches[0].clientY - dragOffsetY) + 'px';
      }}
    });
    movableDiv.addEventListener('touchend',(event)=> {
      movableDiv.style['filter'] = 'brightness(100%)'

      movableDiv.style.transform = 'scale(1)'
        setDataset(movableDiv,'draggin','off')
    },{bubbles:false});
  
}
addDrag($('.tools'))
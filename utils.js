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


HTMLTextAreaElement.prototype.addEvents = (listeners = {})=> {
  if (listeners == null) {return}
    for (let ev in listeners) {
      let callback = listeners[ev];
      this.addEventListener(ev, callback);
    }
  
} 

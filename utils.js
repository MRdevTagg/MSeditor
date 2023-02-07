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
const Style = (el,style) => window.getComputedStyle(el,null).getPropertyValue(style)
const create = (el,container,attributes,cb = null,late_cb = null) =>{
	element = document.createElement(el)
	attributes.forEach((attr)=> element.setAttribute(attr[0],attr[1]))
	cb !== null && cb
	$(container).appendChild(el)
	late_cb !== null && late_cb

};
const isMobile = ()=> {
  return navigator.userAgent.match(/Android/i) ||
navigator.userAgent.match(/iPhone/i)}
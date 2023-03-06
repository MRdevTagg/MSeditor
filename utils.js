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

let pops = 1
const okMsj = (msj) => {
  el = new UIelement({
  element:'div',
  attributes:{
    id:`pops${pops}`,
    class:'after_action_dialog uiElement',
  },
  listeners: {click : ()=>{el.hide(700);}},
  callbacks:[()=>{
  el.$.innerHTML = msj;
    setTimeout(() => {
      el.hide(400,{opacity:'0',transform:'translateX(200px) scale(.3)'})
  }, 4000)}]
})
el.show(500)
}
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
// Función que convierte una cadena de texto de camelCase a snake-case
function toSnakeCase(text) {
  return text.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}
class ButtonUI {
  constructor({element,container,attributes,onClick}) {
    this.element = element || 'div';
    this.attributes = attributes;
    this.container = container || 'body';
    this.onClick = ()=>{alert('clicked')}
  }
  
  createButton(){
  let el = document.createElement(this.element)
  el.addEventListener('click',this.onClick)
 
   this.attributes !== null && this.attributes.forEach((attr) => {el.setAttribute(attr.name,attr.value)})
  
   document.querySelector(this.container).appendChild(el)
  }
}


const attr_uno = [
    {name:'id',value:'uno'},
    {name:'class',value:'black'},
  ]
  
  const attr_load = [
    {name:'id',value:'load'},
    {name:'class',value:'filemanagebtn htext'},
    {name:'data-hover',value:'CARGAR'},
  ] 
  const attr_remove = [
    { name: 'id', value: 'removeItem' },
    { name: 'class', value: 'filemanagebtn htext'},
    { name: 'data-hover', value: 'ELIMINAR' },
    ]
    
 const btn_uno = new ButtonUI({
  attributes: attr_uno,
  
 })

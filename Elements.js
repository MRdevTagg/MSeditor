
  /////////////////////
 ////// BUTTONS //////
/////////////////////
//// contain logs history
let logs = []

const modal_confirm = ()=>{
  let modal = document.createElement('div')
  modal.classList.add('modal-parent')
  modal.innerHTML = `
  <div class="modal-container" data-draggin="off">
    <div class="modal-title"><p>${confirm_title()[act_KEY]}</p></div>
    <div class="modal-content">${confirm_content()[act_KEY]}
      ${act_KEY == 'save' ? 
      '<input id="name" type="text" placeholder="Nombre" autocomplete="off"/>':''}
    </div>
    <div class="modal-buttons">
      <button class="modal-btn" onclick="actionPerform()">Aceptar</button>
      <button class="modal-btn" onclick="modal_confirm_hide()">Cancelar</button>
    </div>
  </div>
  `
  
  $('body').appendChild(modal)
 addDrag($('.modal-container'))
  setTimeout(()=>{modal.style.opacity = 1})
}
const modal_confirm_hide = ()=>{
  $('.modal-parent').style.opacity = 0;
  setTimeout(()=>{$('.modal-parent').remove()}, 500)
}

const save_btn = new UIelement({
      element: 'picture',
      attributes: {id:'save', class :'filemanagebtn', style:"z-index : 9;"},
      listeners: {click:()=>{
      act_KEY = 'save';
      modal_confirm()
      }},
})

const load_btn = new UIelement({
      element: 'picture',
      attributes: {id:'load', class :'filemanagebtn', style:"z-index : 9;"},
      listeners: {click:()=>{
        act_KEY ='load';
        modal_confirm()
      }},
})

const remove_btn = new UIelement({
      element: 'picture',
      attributes: {id:'removeItem', class :'filemanagebtn', style:"z-index : 9;"},
      listeners: {click:()=>{
        act_KEY ='delete';
        modal_confirm()
      }},
})

const removeAll_btn = new UIelement({
      element: 'picture',
      attributes: {id:'remove', class :'filemanagebtn', style:"z-index : 9;"},
      listeners: {click:()=>{
        act_KEY ='delete-all';
        modal_confirm()
      }},
})
const download_btn = new UIelement({
  element: 'picture',
  container : $('#fullEditor'),
  attributes: {
    id:'download', 
    class :'filemanagebtn addtext-btn htext uiElement',
    'data-hover':`Descargar\nCódigo`
  },
  callbacks:[(this_)=>{
    this_.$.style.left=`
    ${$('.'+KEY).clientWidth + $('.'+KEY).offsetLeft - this_.$.clientWidth -18
  }px`;
     this_.$.style.top = `${$('.'+KEY).offsetTop += 7.5}px`;
  }],
  listeners: {click:()=>{
    act_KEY = 'download'
    download(source[KEY],'index',`${KEY == 'js' ? 'text/javascript' :`text/${KEY}`}`)}
  },
  state:new State({visible:true})
})
const fileopen_btn = new UIelement({
  container:$('#fullEditor'),
element: 'label',
attributes: {
  id:'fileopenlabel',
  class:'filemanagebtn addtext-btn uiElement htext',
  for:'file-open', 
  'data-hover':'importar'
},
callbacks:[(this_)=>{
  // fix top
this_.$.style.left=`
${$('.'+KEY).clientWidth + ($('.'+KEY).offsetLeft - this_.$.clientWidth *2)-25
}px`; 
this_.$.style.top = `${$('.'+KEY).offsetTop += 7.5}px`;
},],
state:new State({visible:true})
})
const all_btns = new UIelement({
    element:'div',
    attributes:{
      class:'uiElement buttons slrbtns',
    },
    childs:[save_btn,load_btn,remove_btn],
    callbacks:[(this_)=>{
      this_.childs.forEach(child => child.show(700));
    }],
})



////CONFIRM DIALOG////


 ///////// ACTION BASED OBJECTS  ////// 


const confirm_title = ()=>{
return {
 'save': `Confirmar ${selected?'Sobreescribir':'Crear'}`,
 'load':`Confirmar Abrir `,
 'delete': `Confirmar Eliminar`,
 'delete-all': `Confirmar Eliminar todo`}
}
const confirm_content = ()=>{
if( selected ){
      const {name,dateyear,datehours} = selected.dataset
      return {
      save: `<p>Sobreescribir el Archivo: "${name}"<br>
              Modificado: ${dateyear} | ${datehours}hs</p>`,
      load: `<p>Cargar el Archivo: "${name}"<br> Modificado: ${dateyear} | ${datehours}hs</p>
      <p class="modal-warning">Se perderán los datos de la sesión actual</p>`,
      delete:`<p>Eliminar el archivo "${name}"<br>
      Modificado: ${dateyear} | ${datehours}hs</p> <p class="modal-warning">No se puede deshacer</p>`,
      'delete-all': `<p>Eliminar todos los archivos?</p>
      <p class="modal-warning">No se puede deshacer</p>`}
    }
   else{
    return {
      save:`<p>Nombrar Archivo Nuevo:</p>`,
      load:'<p>Selecciona un archivo o crea uno Nuevo</p>',
      delete:'<p>Selecciona un archivo para eliminar</p>',
      'delete-all':'<p>Se eliminaran todos los Archivos</p><p class="modal-warning">No se puede deshacer</p>',
      }
    }
}
const log_msg = ()=> {
  let dateyear = formatDate(new Date()).year
  let datehours = formatDate(new Date()).hours
if( selected ){
      const {name} = selected.dataset
      return {
      save: `El Archivo con el nombre: ”${name}”
      Actualizado con éxito el día ${dateyear} a las ${datehours}`,
      load: `El Archivo: ”${name}”
      Cargado con éxito el ${dateyear} a las ${datehours}`,
      delete:`El Archivo: ”${name}”
      ha sido eliminado el ${dateyear} a las ${datehours}`,
      'delete-all': `Eliminar todos los archivos?,`,
      'download': `Descargando archivo ${KEY.toUpperCase()}`
    }
    }
   else{
    return {
      save:`El Archivo ha sido Creado con éxito el día ${dateyear} a las ${datehours}`,
      load:'Selecciona un archivo o crea uno Nuevo',
      delete:`Archivo eliminado el día ${dateyear} a las ${datehours}`,
      'delete-all':'Se han eliminado todos los Archivos',
      'download': `Descargando archivo ${KEY.toUpperCase()}`
      }
    }
}
const Action = ()=>{
  return{
    save:()=>{save()},
    load:()=>{selected && load()},
    delete:()=>{selected && removeItem()},
    'delete-all':()=>{removeAlldata()},

  }
}
  
  
// LOG
const log_structure = {
  container:$('main'),
      id: safeID('confirmD',0),
      element: 'div',
      attributes: {
          class: 'after_action_dialog uiElement',
          },
}
const create_action_log = (msj = null)=>{
  let log = new UIelement(log_structure)
 
  log.show(700)
  log.transition({
    transition:'all 600ms ease',
    transform:'scale(.7)'},600)
  log.$.innerHTML = msj ? msj : log_msg()[act_KEY]
 logs.push(log_msg()[act_KEY])
  setTimeout(() => {
    log.hide(600,{
        transition:'all 600ms ease-out',
        opacity:'0',transform:'scale(.6)'})
  }, 3000)

 return
}

/// SNIPPETS
const addColor = (val)=>{
  let color = val.value
  editor().setRangeText(
    color, editor().selectionStart, editor().selectionEnd, "end");
  editor().focus();
  updateSource()
}


download_btn.show()
fileopen_btn.show()



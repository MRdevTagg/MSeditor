
dialogs = []



  /////////////////////
 ////// BUTTONS //////
/////////////////////

const save_btn = new UIelement({
      element: 'picture',
      attributes: {id:'save', class :'filemanagebtn', style:"z-index : 9;"},
      listeners: {click:()=>{
  action = 'save';
  actionSelect() ; 
	confirm_dialog.show(700); 
	input_name.show(700,{opacity:1,transform:'scale(.9)'})
      }},
})

const load_btn = new UIelement({
      element: 'picture',
      attributes: {id:'load', class :'filemanagebtn', style:"z-index : 9;"},
      listeners: {click:()=>{
        action ='load';
        actionSelect();	
        confirm_dialog.show(700)
      }},
})

const remove_btn = new UIelement({
      element: 'picture',
      attributes: {id:'removeItem', class :'filemanagebtn', style:"z-index : 9;"},
      listeners: {click:()=>{
        action ='delete';
        actionSelect();
        confirm_dialog.show(700)
      }},
})

const removeAll_btn = new UIelement({
      element: 'picture',
      attributes: {id:'remove', class :'filemanagebtn', style:"z-index : 9;"},
      listeners: {click:()=>{
        action ='delete-all';
        actionSelect();	
        confirm_dialog.show(700)
      }},
})
const download_btn = new UIelement({
  element: 'picture',
  container : $('.lang'),
  attributes: {id:'download', class :'filemanagebtn uiElement', style:"z-index : 9;"},
  listeners: {click:()=>selectFileToDownload()},
})
const all_btns = new UIelement({
    element:'div',
    attributes:{
      class:'uiElement buttons slrbtns',
    },
    childs:[save_btn,load_btn,remove_btn],
    callbacks:[(uiel)=>{
      uiel.childs.forEach(child => child.show(700));
    }],
})

download_btn.show()


////CONFIRM DIALOG////

const input_name = new UIelement({
  element : 'input',
  attributes : {
    id: "name",
    class : 'uiElement',
    type: "text",
    placeholder: "Nombre" ,
    autocomplete:"off"
  },
 
    callbacks : [
      (this_) => {
        if(action === 'save'){
        this_.show(300)}
        else{
        this_.hide(300)
        }
      },
      (this_) => {
        if(this_.state.added) {
          this_.$.value = selected?
          selected.dataset.name : 
          'Nuevo';}
      }],
  state : new State({visible : false})
})
const btn_ok = new UIelement({
 element:'picture',
 attributes: {
   "id" : 'ok-btn',
   'class' : 'uiElement'
 },
 listeners:{click: ()=>{actionPerform()}},
  state: new State({visible:true}),

})
const dialog_header = new UIelement({
       element: 'div',
       attributes: {
         'id': 'dialog--header',
         'class': 'uiElement dialog-head',
       },
       
       state: new State({visible:true}),
       callbacks: [(this_)=>{this_.$.innerHTML = onAction().title[action].toUpperCase()}],
       childs:[]
})
const dialog_message = new UIelement({
  element:'div',
  attributes:{
    id : 'dialog-message',
    class:'uiElement'
  },
  callbacks :[
    (uiel)=>
    (uiel.$) && (uiel.$.innerHTML = onAction().ask[action])],  
  state:new State({visible:true})
}) 
const confirm_dialog = new UIelement({
  element:'div',
  attributes: {
    'id':'confirm',
    'class':'uiElement dialog',
  },
  childs : [dialog_header,dialog_message,input_name,btn_ok],
  
})




 ///////// MESSAGES //////

const msj_menu_title = ()=>{
  return{
	'save': selected?'SOBREESCRIBIR':'GUARDAR NUEVO',
	'load':'ABRIR',
	'delete':'ELIMINAR',
	'delete-all':'ELIMINAR TODO'
	}}
const msj_ask_confirm_title = ()=>{
return {
 'save': `${selected?'Sobreescribir':'Guardar'}?`,
 'load':`Abrir el archivo?`,
 'delete': `Eliminar`,
 'delete-all': `Eliminar todo`}
}
const msj_ask_confirm = ()=>{
if( selected ){
      const {name,dateyear,datehours} = selected.dataset
      return {
      save: `<p>"${name}"</p> <br><p class="date">
              Modificado:<br>${dateyear}<br>a las<br>${datehours}hs</p>`,
      load: `<p>"${name}"</p><br><p class="date">creado el <br>${dateyear} 
              a las<br> ${datehours}hs</p><br><p class="warning">se perderán los datos de la sesion actual</p>`,
      delete:`Eliminar el archivo?<br> <span>"${name}"</p> <br>${ `<p class="date">creado el<br> ${dateyear}
              a las ${datehours}hs</p>`}<br>`,
      'delete-all': `Eliminar todos los archivos?`}
    }
   else{
    return {
      save:`<p>Nombrar Archivo:</p>`,
      load:'Selecciona un archivo o crea uno Nuevo',
      delete:'Selecciona un archivo',
      'delete-all':'Se eliminaran todos loa Archivos <br> <span class="warning">No se puede deshacer</span>',
      }
    }
}
const msj_after_confirm = ()=> {
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
      'delete-all': `Eliminar todos los archivos?`}
    }
   else{
    return {
      save:`El Archivo ha sido Creado con éxito el día ${dateyear} a las ${datehours}`,
      load:'Selecciona un archivo o crea uno Nuevo',
      delete:'Selecciona un archivo',
      'delete-all':'Se han eliminado todos los Archivos',
      }
    }
}

const actions_ = ()=>{
  return{
    save:()=>{save()},
    load:()=>{selected && load()},
    delete:()=>{selected && removeItem()},
    'delete-all':()=>{removeAlldata()},

  }
}

const onAction = ()=>{
     return {
    perform: actions_(),
    title : msj_ask_confirm_title(),
    ask : msj_ask_confirm(),
    menu_title : msj_menu_title(),
    after_confirm : msj_after_confirm(),   
    }
  }
const create_action_log = ()=>{
  let log = new UIelement({
      id: safeID('confirmD',0),
      element: 'div',
      attributes: {
          class: 'after_action_dialog uiElement',
          },
  })
  dialogs.push(log)
  log.show(700)
  log.transition({transition:'all 600ms ease',transform:'translateX(-300px) scale(.6)'},600)
  log.$.innerHTML = onAction().after_confirm[action]

  setTimeout(() => {
      log.hide(2000,{transition:'all 1000ms ease-out',opacity:'0',transform:'translateX(400px) scale(.6)'})
  }, 3000)

 return
}
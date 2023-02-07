function title() {
  let title;
  switch (action) {
    case 'save':
     title = `${selected?'Sobreescribir':'Guardar'}?`
      break;
    case 'load':
     title = `Abrir el archivo?`
      break;
    case 'delete':
     title = `Eliminar`
      break;
    
  }
  return `<p>${title.toUpperCase()}</p>`
}

function message() {
  let msj = 'TXT'
  if (selected) {
 const {name,dateyear,datehours} = selected.dataset 
  switch (action) {
    case "save":
      msj = `<p>"${name}"</p> <br><p class="date">Modificado :<br>${dateyear}<br>a las<br> ${datehours}hs</p>
`
      break
    case 'load':
      msj = `<p>"${name}"</p><br><p class="date">creado el <br>${dateyear} a las<br> ${datehours}hs</p><br><p class="warning">se perderán los datos de la sesion actual</p>`
      break
    case 'delete':
      
      msj = `Eliminar el archivo?<br> <span>"${name}"</p> <br>${ `<p class="date">creado el<br> ${dateyear}
        a las ${datehours}hs</p>`}<br>`
      break
    default: msj = 'Selecciona un archivo'
      break
  }}
    else{
      switch (action) {
    case "save":
      msj = `<p>sin-nombre</p>`
      break
    case 'load':
      msj =  'selecciona un archivo o crea uno Nuevo'
      break
    case 'delete':
      
      msj =  'Selecciona un archivo'
      break
    default: msj = 'Selecciona un archivo'
      break
  }
    }
  
  return msj
}


const after_action_dialog = new UIelement({
  element:'div',
  attributes:{
    id:'after_action_dialog',
    class:'uiElement'
  },
  listeners: {click : ()=>{after_action_dialog.hide(700);}},
  callbacks:[()=>
    setTimeout(() => {
      after_action_dialog.hide(400,{opacity:'0',transform:'translateX(200px) scale(.3)'})
  }, 4000)]
})


////CONFIRM DIALOG////
const input_name = new UIelement({
  element : 'input',
  attributes : {
    id:"name",
    'class' :'uiElement',
    type:"text",
    placeholder:"Nombre" ,
    autocomplete:"off"
  },
 
    callbacks : [
      () => {
        if(action === 'save'){
        input_name.show(300)}
        else{
        input_name.hide(300)
        }
      },
      () => {
        if(input_name.state.added) {
          input_name.$.value =selected?
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
       listeners:{
         'click':(e)=>{
           dialog.$.style.background = 'white'}},
       state: new State({visible:true}),
       callbacks: [()=>{dialog_header.$.innerHTML = title()}],
       childs:[]
 })

const dialog_message = new UIelement({
  element:'h3',
  attributes:{
    id : 'dialog-message',
    class:'uiElement'
  },
  callbacks :[
    ()=>
    (dialog_message.$) && (dialog_message.$.innerHTML = message())],  state:new State({visible:true})
}) 
const dialog = new UIelement({
  element:'div',
  attributes: {
    'id':'confirm',
    'class':'uiElement dialog',
  },
  childs : [dialog_header,dialog_message,input_name,btn_ok],
  
 })





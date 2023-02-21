
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
  container : $('#editor'),
  attributes: {
    id:'download', 
    class :'filemanagebtn addtext-btn htext',
    style:`
    top : ${$('.lang').offsetTop += 8}px; 
    position:absolute`,
    'data-hover':`Descargar\n${view}`
  },
  callbacks:[(this_)=>{
    this_.$.style.left=`
    ${$('.lang').clientWidth + $('.lang').offsetLeft - this_.$.clientWidth -10
  }px`; 

  }],
  listeners: {click:()=>{
    action = 'download'
    downloadFile[view]()}},
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
const fileopen_btn = new UIelement({
  container:$('#editor'),
element: 'label',
attributes: {
  id:'fileopenlabel',
  class:'filemanagebtn addtext-btn uiElement htext',
  for:'file-open', 
  style:`top : ${$('.lang').offsetTop += 8}px; `,
  'data-hover':'importar'
},
callbacks:[(this_)=>{
this_.$.style.left=`
${$('.lang').clientWidth + ($('.lang').offsetLeft - this_.$.clientWidth *2)-15
}px`; 

}],
state:new State({visible:true})
})


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
      (this_) => { action === 'save' ? this_.show(300) : this_.hide(300) },
      (this_) => { (this_.state.added) && (this_.$.value = selected ? selected.dataset.name : 'Nuevo') }
  ],
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
const btn_cancel = new UIelement({
 element:'picture',
 attributes: {
   "id" : 'cancel-btn',
   'class' : 'uiElement'
 },
 listeners:{click: ()=>{
   confirm_dialog.hide(500,{'opacity':0})}
 },
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
    (this_)=>
    (this_.$) && (this_.$.innerHTML = onAction().ask[action])],  
  state:new State({visible:true})
}) 
const confirm_dialog = new UIelement({
  element:'div',
  attributes: {
    'id':'confirm',
    'class':'uiElement dialog',
  },
  childs : [dialog_header,dialog_message,input_name,btn_ok,btn_cancel],
  
})




 ///////// MESSAGES ////// return any

// const msj_menu_title = ()=>{
//   return{
// 	'save': selected ? 'SOBREESCRIBIR':'GUARDAR NUEVO',
// 	'load':'ABRIR',
// 	'delete':'ELIMINAR',
// 	'delete-all':'ELIMINAR TODO'
// 	}}
const msj_ask_confirm_title = ()=>{
return {
 'save': `${selected?'Sobreescribir':'Nuevo'}?`,
 'load':`Abrir el archivo?`,
 'delete': `Eliminar`,
 'delete-all': `Eliminar todo`}
}
const msj_ask_confirm = ()=>{
if( selected ){
      const {name,dateyear,datehours} = selected.dataset
      return {
      save: `<p>"${name}"</p><br><p class="date">
              Modificado:<br>${dateyear} | ${datehours}hs</p>`,
      load: `<p>"${name}"</p><br><p class="date">
      Modificado:<br>${dateyear} | ${datehours}hs</p><br><p class="warning">se perderán los datos de la sesion actual</p>`,
      delete:`<p>"${name}"</p><br><p class="date">
      Modificado:<br>${dateyear} | ${datehours}hs</p><br>`,
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
      'delete-all': `Eliminar todos los archivos?,`,
      'download': `Descargando archivo ${view.toUpperCase()}`
    }
    }
   else{
    return {
      save:`El Archivo ha sido Creado con éxito el día ${dateyear} a las ${datehours}`,
      load:'Selecciona un archivo o crea uno Nuevo',
      delete:'Selecciona un archivo',
      'delete-all':'Se han eliminado todos los Archivos',
      'download': `Descargando archivo ${view.toUpperCase()}`
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
    perform : actions_(),
    title : msj_ask_confirm_title(),
    ask : msj_ask_confirm(),
    // menu_title : msj_menu_title(),
    after_confirm : msj_after_confirm(),   
    }
  }
  
  
// LOG
const log_structure = {
      id: safeID('confirmD',0),
      element: 'div',
      attributes: {
          class: 'after_action_dialog uiElement',
          },
}
const create_action_log = (msj = null)=>{
  let log = new UIelement(log_structure)
  dialogs.push(log)
  log.show(700)
  log.transition({
    transition:'all 600ms ease',
    transform:'translateX(-300px) scale(.6)'},600)
  log.$.innerHTML = msj? msj : onAction().after_confirm[action]

  setTimeout(() => {
    log.hide(2000,{
        transition:'all 1000ms ease-out',
        opacity:'0',transform:'translateX(400px) scale(.6)'})
  }, 3000)

 return
}

/// SNIPPETS


const addSnippet = (e) => {
      e.preventDefault()
      let tag = {
        open:e.target.dataset.body,
        close:e.target.dataset.closure,
      }
      let input_ = $(`#${view}edit`)
      let selectedtext = input_.value.slice(input_.selectionStart, input_.selectionEnd);
      input_.setRangeText(
      `${tag.open}${selectedtext}${tag.close}`, input_.selectionStart, input_.selectionEnd,"end");
  
      input_.focus();
      input_.selectionEnd -= tag.close.length;
      updatePreviewDocument()
}
 createTag = (tag)=>{
   return{
      tagname: tag,
      body : `<${tag}>`,
      closure:`</${tag}>`,
    }
 }
const snippets = { 
  html : 
  [
  createTag('div'),
  createTag('p'),
  createTag('a'),
  createTag('nav'),
  createTag('h1'),
  createTag('header'),
  createTag('main'),
  createTag('aside')
],
  css:[
{tagname:'body',
body:`body{
  `,
closure:`
}`},
{tagname:'property',
body:'prop :',
closure:' value ;'
}

],
  js:[
{tagname:'const',
body:'const newConst = ',
closure:'/* any */;'
},
{tagname:'let',
 body:'let newlet = ',
 closure:'/* any */;'
},
{tagname:'class',
    body:`class NameClass{
  constructor(prop){
    this.prop = prop;
  }
  classMethod(){

  }`,
    closure:`
}`
  },
{tagname:'if',
    body:`if(){
  `,
    closure:`
}`
},
{tagname:'else',
body:'else{',
closure:`/* code */
}`
},
{tagname:'forEach',
  body:'array.forEach((item,index,array)=>{',
  closure:`
    //code
})`
},
{tagname:'$',
body:"document.querySelector('",
closure:"')",
},
{tagname:'fun',
body:`function foo(){
  `,
closure:` 
}`
},
{tagname:'listener',
body:"element.addEventListener('",
closure:"',(e)=>{})",
},
  ]
}

const structure_snippets = (snippets_data)=>{ 
      return{
      element:'button',
      attributes:{
        class:'addtext-btn',
        'data-tagname': snippets_data.tagname,
        'data-body': snippets_data.body,
        'data-closure':snippets_data.closure
      },
      callbacks: [(_this)=>{
        _this.$.innerHTML = _this.$.dataset.tagname
      }],
      listeners :{
        click : (e) =>addSnippet(e)
      },
      state: new State({visible:true}),
    }
    }

const snippets_btn_container = new UIelement({
  container: $('#editor'),
  element: 'div',
  attributes: { 
    class: 'uiElement snippets-container',
    style:`top : ${$('.lang').offsetTop += 5}px; left:${$('.lang').offsetLeft += 5}px;` }
})
const createSnippets = ()=>
{
  snippets_btn_container.childs = []
  snippets[view].forEach((snipp)=>{
    snipp = new UIelement(structure_snippets(snipp))
    snippets_btn_container.childs.push(snipp)
  })
  snippets_btn_container.show();
}
createSnippets()
download_btn.show()
fileopen_btn.show()


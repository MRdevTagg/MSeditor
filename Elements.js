
////CONFIRM DIALOG////
const btn_ok = new UIelement({
 element:'picture',
 attributes: {
   "id" : 'ok-btn',
   'class' : 'uiElement ui-btn'
 },
 listeners:{click: ()=>{actionBtn()}},
  state: new State({visible:true}),

})
const dialog_header = new UIelement({
       element: 'div',
       attributes: {
         'id': 'dialog--header',
         'class': 'uiElement dialog-head',
         "data-hover": 'data'
       },
       listeners:{
         'click':(e)=>{
           dialog.$.style.background = 'white'}},
       state: new State({visible:true}),
       childs:[]
 })

const dialog_message = new UIelement({
  element:'h3',
  attributes:{
    id : 'dialog-message',
    class : 'uiElement'
  },
  callbacks :[()=>dialog_message.$.innerHTML = 'TEXTO']
}) 
const dialog = new UIelement({
  element:'div',
  attributes: {
    'id':'confirm',
    'class':'uiElement dialog',
    "data-hover":'data'
  },
  childs : [dialog_header,dialog_message,btn_ok],
  
 })


const btn_show = new UIelement({
  element:'button',
  attributes : {id:'showbtn','class' : 'uiElement'},
  listeners :{
    click: () => {
        dialog.showOrHide(700)
    }
  },
})
btn_show.state.visible = true;
dialog.state.visible = true;
dialog_message.state.visible = true;


dialog.create()
 btn_show.create()

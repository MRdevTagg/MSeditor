const $ = sel => document.querySelector(sel)

class ButtonUI {
  constructor({element,container,attributes,listeners}) {
    this.element = element || 'picture';
    this.attributes = attributes;
    this.listeners = listeners
    this.container = container || document.body;
    this.$;
    this.added = false;
    this.visible = false;
  }
  remove$(){
    this.$.remove()
    this.added = false
  }
  show(ms){
    let st = this.$.style
    st.transition = `opacity ${ms}ms`
    st.opacity = '1'
  }
  hide(ms){
    let st = this.$.style
    st.transition = `opacity ${ms}ms`
    st.opacity = '0'
    setTimeout(()=>{
      this.visible = false;
      this.remove$();
    },ms)
  }
  addAtributes(cb){
    
      switch (cb) {
        case 'attr':
          for(let attr in this.attributes){
              let value = this.attributes[attr]
              this.$.setAttribute(attr,value)}
          break;
        case 'listener':
          for(let attr in this.listeners){
              let value = this.listeners[attr]
              this.$.addEventListener(attr,value);}
          break;
        
      }
    
  }
  
  add(){
    let el = document.createElement(this.element);
   this.container.appendChild(el)
   this.$ = el
   this.attributes !== null && this.addAtributes('attr')
   this.listeners !== null && this.addAtributes('listener')
   this.added = true;
  }
  create(){
    !this.added && this.add()
  }
}


 
    
 const btn_uno = new ButtonUI({
  element:'div',
  attributes: {
    'id':'blaclbox',
    'class':'clase',
    "data-hover":'data',
    'style':'opacity:0;background:black;width:60px;height:60px;'
  },
  listeners:{
     'touchstart' : (e)=>{e.target.style.background= 'blue'},
     'touchend' : (e)=>{e.target.style.background= 'red'},
  }
 })
const btn_show = new ButtonUI({
  element:'button',
  attributes : {id:'showbtn'},
  listeners :{
    click: ()=>!btn_uno.show(2000)
  },
})
 btn_uno.create()
 btn_show.create()

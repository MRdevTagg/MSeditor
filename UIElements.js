
class UIelement {
  constructor({element,container,attributes,listeners}) {
    this.element = element || 'picture';
    this.attributes = attributes;
    this.listeners = listeners
    this.container = container || document.body;
    this.$;
    this.state = {
      added : false,
      visible : false
     
    };
  }
  remove$(){
    this.$.remove()
    this.state.added = false
  }
  show(ms){
    !this.state.added && this.create() 
    let st = this.$.style
    st["transition"] = `opacity ${ms}ms`
    setTimeout(() => {
      st["opacity"] = '1'
    }, 10);
    
    this.state.visible = true
  }
  hide(ms){
    let st = this.$.style
    st["transition"] = `opacity ${ms}ms`
    st["opacity"] = '0'
    setTimeout(()=>{
      this.state.visible = false;
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
   this.state.visible ? this.$.style.opacity = '1' :this.$.style.opacity = '0'
   this.state.added = true;
  }
  create(){
    !this.state.added && this.add()
  }
}


 
    
 const btn_uno = new UIelement({
  element:'div',
  attributes: {
    'id':'blaclbox',
    'class':'clase',
    "data-hover":'data',
    'style':'background:black;width:60px;height:60px;'
  },
  listeners:{
     'touchstart' : (e)=>{e.target.style.background= 'blue'},
     'touchend' : (e)=>{e.target.style.background= 'red'},
  }
 })
const btn_show = new UIelement({
  element:'button',
  attributes : {id:'showbtn','style':'z-index:8;position:absolute;background:blue;width:60px;height:60px;'},
  listeners :{
    click: () => {
        !btn_uno.state.visible ? btn_uno.show(2000) : btn_uno.hide(2000) }
  },
})
btn_show.state.visible = true;



 btn_uno.create()
 btn_show.create()

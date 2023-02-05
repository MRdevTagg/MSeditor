
class State {
  constructor({added,visible}) {
    this.added = added || false
    this.visible = visible || false
  }
}
class UIelement {
  constructor({element,container,attributes,listeners,callbacks,childs,state}) {
    this.element = element || 'picture';
    this.attributes = attributes;
    this.listeners = listeners || {};
    this.callbacks = callbacks || [];
    this.container = container || document.body;
    this.childs = childs || null;
    this.$;
    this.state = state || new State({});
  }
  remove$(){
    this.removeChilds()
    this.$.remove()
    this.state.added = false
  }
  show(ms){
    this.create() 
    if (!this.state.visible) {
    let st = this.$.style
    st["transition"] = `opacity ${ms}ms`
    setTimeout(()=>
    st["opacity"] = '1',50)
    this.state.visible = true
    }
  }
  hide(ms){
    if (this.state.added) {
    let st = this.$.style
    st["transition"] = `opacity ${ms}ms`
    st["opacity"] = '0'
    setTimeout(()=>{
      this.state.visible = false;
      this.remove$();
    },ms)
    }
  }
  
  showOrHide(showms,hidems){
    !this.state.visible ? 
    this.show(showms) : 
    this.hide(hidems | showms) 
  }
  
  addAtributes(){
    

    if (this.attributes !== null) {
      for(let attr in this.attributes){
        let value = this.attributes[attr]
        this.$.setAttribute(attr,value)
      }
    }
  }
  addListeners() {
    if (this.listeners !== null) {
      for (let attr in this.listeners) {
        let value = this.listeners[attr];
        this.$.addEventListener(attr, value);
      }
    }
  }

  addChilds(){
    if (this.childs !== null) {
      this.childs.forEach((child) =>{
        child.container = this.$
        child.create()
      })
    }
  } 
  removeChilds(){
    if (this.childs !== null) {
      this.childs.forEach((child) =>{
        child.remove$()
      })
    }
  } 
  
  add$(){
    let el = document.createElement(this.element);
   this.container.appendChild(el)
   this.$ = el
   this.addAtributes()
   this.addListeners();
   this.state.visible ? 
   this.$.style.opacity = '1' :
   this.$.style.opacity = '0';
   this.addChilds();
   this.callbacks !==null && this.callbacks.forEach(cb=>{cb()})
   this.state.added = true;
  }
  create(){
    !this.state.added && this.add$()
  }
}



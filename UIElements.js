
class State {
  constructor({added,visible,multi_instance,instances}) {
    this.added = added || false
    this.visible = visible || false
    this.multi_instance = multi_instance || false
    this.instances = instances || []
  }
}
class UIelement {
  constructor({id,element,container,attributes,listeners,callbacks,childs,state}) {
    this.id = id || 'noId'
    this.element = element || 'picture';
    this.attributes = attributes;
    this.listeners = listeners || {};
    this.callbacks = callbacks || []; //se le puede pasar un parametro para referenciar el this
    this.container = container || document.body;
    this.childs = childs || [];
    this.$;
    this.state = state || new State({});
  }
  
  add$() {
    let el = document.createElement(this.element);
    this.container.appendChild(el)
    this.$ = el
    this.addAtributes()
    this.addListeners();
    this.state.visible ?
      this.$.style.opacity = '1' :
      this.$.style.opacity = '0';
    this.addChilds();
    this.state.added = true;
    this.addCalls();
  }
  remove$(){
    this.removeChilds()
    this.$.remove()
    this.state.added = false
  }
  transition(transition,ms){
    if (transition !== null) {

      for (let tran in transition) {
        let value = transition[tran]
        this.$.style[tran] = value
      }
    }
  }
  show(ms = 500,transition ={'opacity' : '1','transform':'scale(1)'}){
    this.create() 
    if (!this.state.visible) {
    let st = this.$.style
    st["transition"] = `all ${ms}ms`
    setTimeout(()=>{
    this.transition(transition,ms)
    this.state.visible = true

    }
    ,50)
    }
  }
  hide(ms = 500,transition = {'opacity':'0','transform':'scale(.9)'}, remove = true){
    if (this.state.added && this.state.visible) {
    
    this.transition(transition,ms)

    setTimeout(()=>{
    this.state.visible = false;
      remove && this.remove$();
    },ms)
    }
  }
  
  showOrHide(showms,hidems){
    !this.state.visible ? 
    this.show(showms) : 
    this.hide(hidems || showms) 
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
  addCalls(){
  if(this.state.added ){
  this.callbacks!==null && this.callbacks.forEach(cb=>{cb(this)})//el parametro que pasamos dede afuera es this
    return
  }
}
  addChilds(){
    if (this.childs !== null) {
      this.childs.forEach((child) =>{
       if (child)
        {child.container = this.$
        child.create()}
      })
    }
  } 
  removeChilds(){
    if (this.childs) {
      this.childs.forEach((child) =>{
        child.remove$()
      })
    }
  } 
  
  
  create(container = null,show = false){
    container && (this.container = container)
    if (this.state.multi_instance) {
      this.add$()
      show && this.show()
    }
    else !this.state.added && this.add$() 
    show && this.show()
  }
 
}



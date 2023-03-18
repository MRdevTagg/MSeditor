/*

*/ 


class History{
	constructor(){
		this.keys = ['html','css','js']
		this.log = { html:[], css:[], js:[] };
		this.index = { html:-1, css:-1, js:-1 };
		this.editor = (key)=> $(`#${key}edit`);
	}
	add(key){
	const{ index, log, editor } = this;
	(index[key] < log[key].length-1) && this.log[key].splice(index[key]+1)
		this.log[key].push(editor(key).value)
		index[key] = log[key].length-1;
		
}
	undo(key){	
		const{ index, log, editor } = this
			if (index[key] === 0) {return}
			index[key] --
			if(log[key][index[key]] !== undefined){
				editor(key).value = log[key][index[key]]
			}
			updateSource()
			editor(key).focus()
		}
	redo(key){
		const{ index, log, editor } = this;
			if(index[key] === log[key].length-1) {return}
			index[key]++
			if(log[key][index[key]] !== undefined){
			editor(key).value = log[key][index[key]]}
			updateSource()
			editor(key).focus()
		}
	clear(key){
		if(key){
			this.log[key] = [];
			this.index[key] = -1;
			this.add(key)
		}else{
		this.keys.map( key =>{
			this.log[key] = [];
			this.index[key] = -1;
			this.add(key)
		})}
		
	}
	}


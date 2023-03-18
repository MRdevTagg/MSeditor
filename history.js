/*

*/ 


class History{
	constructor(key){
		this.key = key;
		this.keys = ['html','css','js']
		this.log = { html:[], css:[], js:[] };
		this.index = { html:-1, css:-1, js:-1 };
		this.editor = ()=> $(`#${this.key}edit`);
	}
	add(){
	const{ index, log, key, editor } = this;
	(index[key] < log[key].length-1) && log[key].splice(index[key]+1)
		log[key].push(editor().value)
		index[key] = log[key].length-1;
}
	undo(){	
		const{ index, log, key, editor } = this
			if (index[key] === 0) {return}
			index[key] --
			if(log[key][index[key]] !== undefined){
				editor().value = log[key][index[key]]
			}
			updateSource()
			editor().focus()
		}
	redo(){
		const{ index, log, key, editor } = this;
			if(index[key] === log[key].length-1) {return}
			index[key]++
			if(log[key][index[key]] !== undefined){
			editor().value = log[key][index[key]]}
			updateSource()
			editor().focus()
		}
	clear(){
		this.keys.map( key =>{
			this.log[key] = [];
			this.index[key] = -1;
		})
		this.add()
	}
	}


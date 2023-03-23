/*

*/ 


class HistoryRecord{
	constructor(){
		this.keys = ['html','css','js']
		this.log = { html:[], css:[], js:[] };
		this.index = { html:-1, css:-1, js:-1 };
		this.editor = (key)=> $(`#${key}edit`);
	}
	add(key){
	const{ index, log, editor } = this;
	(index[key] < log[key].length-1) && this.log[key].splice(index[key])
		this.log[key].push(editor(key).value)
		this.index[key] = this.log[key].length-1;
		
}
	undo(key){	
		const{ index, log, editor } = this
			if (this.index[key] === 0) {return}
			this.index[key] --
			if(log[key][this.index[key]] !== undefined){
				editor(key).value = log[key][this.index[key]]
			}
			updateSource()
			editor(key).focus()
			editor(key).selectionEnd = 12
		}
	redo(key){
		const{ index, log, editor } = this;
			if(index[key] === log[key].length-1) {return}
			this.index[key]++
			if(log[key][index[key]] !== undefined){
			editor(key).value = log[key][index[key]]}
			updateSource()
			editor(key).focus()
			editor(key).selectionStart = selection
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

	function writeText(rangeText,end = 0,input = editor()) {
	
		input.setRangeText(selection? selection + rangeText : rangeText,
			input.selectionStart,
			input.selectionEnd,
			'end');
			input.focus();
			input.selectionEnd += end
			updateSource();
	
	}
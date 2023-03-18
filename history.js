/*
h = history
i = index
v = view
*/ 


class History{
	constructor(){
		this.h = {html:[],css:[],js:[]}
		this.i = {html:-1,css:-1,js:-1}
	}
	add(v){
	if(this.i[v] < this.h[v].length-1){
		this.h[v].splice(this.i[v]+1);
	}
		this.h[v].push($(`#${v}edit`).value)
		this.i[v] = this.h[v].length-1
}
	undo(v){	
			if (this.i[v] === 0) {return}
			this.i[v] --
			if(this.h[v][this.i[v]] !== undefined){
			  	$(`#${v}edit`).value = this.h[v][this.i[v]]}
			updatePreviewDocument()
			$(`#${v}edit`).focus()
		}
	redo(v){
			if (this.i[v] === this.h[v].length-1) {return}
			this.i[v]++
			if(this.h[v][this.i[v]] !== undefined){
					$(`#${v}edit`).value = this.h[v][this.i[v]]}
			updatePreviewDocument()
			$(`#${v}edit`).focus()
		}
	}
let history = new History()

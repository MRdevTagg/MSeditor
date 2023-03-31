export default class KeyBoardController{
	constructor(){
		this.keyNames = []
	}
	move(inputText){
		return {
		right	:(inputText)=>{
			this.keyNames.push(inputText)
		},
		left	:(inputText)=>{

		},
		up		:(inputText)=>{

		},
		down	:(inputText)=>{

		},
		}
	}
}
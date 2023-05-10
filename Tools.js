class Tools{
	constructor({parent,tools,id}){
		this.id = id || null
		this.parent = parent || document.body
		this.tools = tools || ['left','up','right', 'down']
		this.action = {
				right:()=>{
						editor().selectionStart += 1
				},
				left:()=>{
						if (LC().line === 1 && LC().col === 1) return;
						editor().selectionEnd -= 1;
				},
				up:()=>{
						if (LC().line-1 === 0) return;
						const currentLine = LC().line-1, currLineChars = LC(currentLine).col,
						upperLine = currentLine - 1, upperLineChars = LC(upperLine).lineContent.length, upperLineStart =  editor().selectionEnd - currLineChars - upperLineChars,
						remainChars = upperLineChars < currLineChars ? upperLineChars : currLineChars -1 ,
						finalIndex = upperLineStart + remainChars;
						editor().selectionEnd = upperLine > 0 ?  finalIndex : finalIndex < 0 && remainChars === 0 ? 0 : currLineChars < upperLineChars ? remainChars-1 : remainChars;	
				},
				down:()=>{
						if (LC().line === LC().lines.length) return;
						const currentLine = LC().line-1, currLineChars = LC(currentLine).col, maxChars = LC().characters.length,
						lowerLine = currentLine <  -1 ?  currentLine + 1 : currentLine, lowerLineChars = LC(lowerLine).lineContent.length, lowerLineStart =  (editor().selectionStart - currLineChars) + LC().lines[currentLine].length+1,
						remainChars = lowerLineChars < currLineChars ? lowerLineChars : currLineChars , 
						finalIndex = lowerLineStart + remainChars;
						editor().selectionStart = lowerLine < maxChars ?	finalIndex : finalIndex > maxChars && remainChars === maxChars ? 	maxChars : currLineChars < lowerLineChars ? remainChars-1 : remainChars;
				},
		}
	}
	create(){
		let tools = document.createElement('div'),
		template = ``;
		tools.classList.add('tools');
		(this.id) && tools.setAttribute('id',this.id)
		tools.setAttribute('data-draggin','off')
		this.parent.appendChild(tools)
		this.tools.map(tool => template += `<picture class="${tool} uiBtn"></picture>`)
		tools.innerHTML = template;
		this.tools.map ( tool => $(`.${tool}`).addEventListener('click',this.action[tool]))
		//addDrag(tools)
	}
}
//////// UP /////////
			// - first ask if current line index equals to zero 'cause it means we're in the first line on the top, so we can't go up any further, so we'll return
		// - if we still here, get the current line index by substracting 1 to the line length property
		// -  let's define the upper line by (obviously) substracting 1 to the current line ('cause we came from the bottom)
	// and lets go up!
		// - get the current line amount of charcters from current line column index
		// - get the upper line amount of characters from l_content string returned by lines_and_cols function.
	// basically is a string with all characters from the line index passed to it as parameter..
		// - (we go up one line from current to upper) moving to the position of upper line start point: how?? going back from 
	// (current caret position) minus (characters from current potition to the begining of current line) minus (upper line characters)
		// - now we get the actual colum index at this line (ex-upper line). we'll go for it by asking if the amount of characters from the 
		// - if upper line characters length (now currrent) are less than the currentline caracters length (now previous) then the amount we must add will be the minor
	// otherwise, we'll return the current line characters length minus 1 (to make count of linebreaks). that way when user press the up arrow button	the cursor will be exactlly above the current position
	// only if the upper line content is equal or greater than the current line, and if it's not then the curos we'll be at the end of upper line
		// - now we most perform the operation that will give us the actual number of characters we must go back to go up	adding to the upper line 
	// start the result from the previos operation(addedChars). so we capture this value as finalIndex.
	// and finally we move the cursor to the disired position. but we must clamp

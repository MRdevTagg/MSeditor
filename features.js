////AUTOCOMPLETE////
// function that reurns an object with width and height values of a single character
function letterSize(element) {
  // first create a span and copy element font-size and font-family
  // then set psition to absolute and visibility to hidden
  const span = document.createElement('span');
  span.style.fontFamily = window.getComputedStyle(element).fontFamily;
  span.style.fontSize = window.getComputedStyle(element).fontSize;
  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  // add a a single character to span content
  span.innerHTML = 'A';
  //append span to the body
  document.body.appendChild(span);
  // get the width and height of the span it must be the same width and height of the single letter
  const width = span.offsetWidth;
  const height = span.offsetHeight;
  // remove the span
  document.body.removeChild(span);

  return { width, height };
}
const ta_rect = () => $(`#${view}edit`).getBoundingClientRect()
const current_line =()=> codePos($(`#${view}edit`)).line
const current_col =()=> codePos($(`#${view}edit`)).col
const line_h = ()=> {
  const lineheight = getComputedStyle($(`#${view}edit`)).lineHeight
  const newLh = lineheight.replace('px', "")
  return Number(newLh)
}

const char_w = ()=>letterSize($(`#${view}edit`)).width
const char_h = ()=>letterSize($(`#${view}edit`)).height

let caret_left = ()=>{
  if ((ta_rect().right - 225) > (current_col() * char_w() - $(`#${view}edit`).scrollLeft - 20)) {
    return current_col() * char_w() -$(`#${view}edit`).scrollLeft - 20
  } else return ta_rect().right - 225
}
let caret_top = ()=>{
if((ta_rect().bottom - 300 ) > (current_line() * line_h() - $(`#${view}edit`).scrollTop)){
 return current_line() * line_h() - $(`#${view}edit`).scrollTop}
 else return ta_rect().bottom - 300
}


// let to store currentword
let current_word = ''
const css_props_keys = ()=>{
//get all css properties key value as string
		const styles = document.body.style;
		const styleKeys = Object.keys(styles);
// crate array with keys in snakeCase
		const snakeCaseProperties = styleKeys.map(property => toSnakeCase(property));
// return array with each snakecased css-property-keys 
		return snakeCaseProperties; // muestra todas las propiedades CSS del elemento en snake-case
}
const html_snippets_keys = ()=>{
	const keys =  [
    "!DOCTYPE",
    "a",
    "abbr",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "svg",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr"
];
	return keys
}
const js_snippets_keys = ()=>{
	const windowProps = Object.getOwnPropertyNames(window)
	const documentProps = Object.getOwnPropertyNames(Document.prototype)
	const Arraymethods = Object.getOwnPropertyNames(Array.prototype)
	const Allprops = [windowProps,documentProps,Arraymethods]
	let jskeys = [];
	Allprops.forEach(prop =>{
		prop.forEach(p => jskeys.push(p))
	})
	return jskeys
}
//function that returns an objrct with keys based in view and values that 
//returns a filtered array containing props or snippets that matches current word
const props_filtered = {
	html:()=>html_snippets_keys().filter(prop=>prop.startsWith(current_word)),
	css: ()=>css_props_keys().filter(prop=>prop.startsWith(current_word)),
	js: ()=>js_snippets_keys().filter(prop =>prop.startsWith(current_word))
}
function createCurrentWord(e) {
// we make a sub-string from last character before selectionstart to the current cursor position
// that way capture the last letter typed
	let key = e.target.value.substr(e.target.selectionStart -1,e.target.selectionStart).charAt(0);
// create or update current_word by concatenate key value only if is single a letter or '-'
	if(/[a-zA-Z-]/.test(key)){
	current_word += key
	console.log(current_word)

	// remove autocomplete_list to prevent duplication of options
	$('.autocomplete_list')?.remove()
	//then display autocomplete options
	
	autoComplete()

} 
// if it's not we reset the current word
	else{
	current_word = ''
	$('.autocomplete_list')?.remove()
	}
	// if there's no match remove the autocompletelist
	if(props_filtered[view]().length == 0){
		$('.autocomplete_list')?.remove()
	}
}

function autoComplete(){
	// create autocomplete ul element
	const autocomplete_list = document.createElement('ul')
	// then add a class to referece and style it
	autocomplete_list.classList.add('autocomplete_list')
	
	let top = ta_rect().top + caret_top() +2
	let left = ta_rect().left + caret_left();

	autocomplete_list.style.top = top+'px'
	autocomplete_list.style.left = left+'px'

	// create a empty string let to generate a template literal with li elements in the future
	let list_template = ''
	/// for each filtered css property we create a child and concatenate it to the list_template we've declared before
	props_filtered[view]().forEach(prop=>{
		list_template += `<li class="autocomplete_list_item" data-autocompletion="${prop}">${prop}</li>`
	})
	// then add the template to the autocomplete_list
	autocomplete_list.innerHTML = list_template
	// append the autocomplete_list to main
	$(`main`).appendChild(autocomplete_list)
	// then add a click event to each autocomplete_list_item (if exist)
	arrayFrom('.autocomplete_list_item')?.forEach(li =>{
	li.addEventListener('click', (e)=>{
		///prepare the snippet with dataset value
		let completion = e.target.dataset.autocompletion
		let autocompletion = {
			html:`<${completion}></${completion}>`,
			css:completion + ': ;',
		js:completion += ' '}
		/// hash the current editor based on view
		let input_ = $(`#${view}edit`)
		// get selection from selection start minus currentword length to avoid duplication of characters
		input_.setSelectionRange(input_.selectionStart - current_word.length,input_.selectionStart)
		// then insert the autocompletion
		input_.setRangeText(
			autocompletion[view], input_.selectionStart, input_.selectionEnd,"end");
			// then get focus on editor again
			 input_.focus();
			 //now put the cursor before ';'
			 input_.selectionEnd -= 1
			 //update the preview
			 updatePreviewDocument()
			 //finally remove autocomplete ul element
		$('.autocomplete_list').remove()
	})
})
}

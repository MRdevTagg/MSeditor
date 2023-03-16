////AUTOCOMPLETE////
// returns an object with width and height values of a single character
function char_size(element) {
  // first create a span and set font-size and font-family properties cloned from element
  // then set span's position to absolute and visibility to hidden
  // add a a single character to span content
  // append span to the body
  // store the offsetwidth and offsetheight of the span (it's the same width and height of a single character)
  // remove the span
  // return the object with width and height
  const span = document.createElement('span');
  span.style.fontFamily = window.getComputedStyle(element).fontFamily;
  span.style.fontSize = window.getComputedStyle(element).fontSize;
  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  span.innerHTML = 'A';
  document.body.appendChild(span);
  const width = span.offsetWidth;
  const height = span.offsetHeight;
  document.body.removeChild(span);

  return { width, height };
}
// width of a single character
const char_w = ()=>char_size($(`#${view}edit`)).width
// height of a single character
const char_h = ()=>char_size($(`#${view}edit`)).height
// return current editor bounding rects
const editor_rect = () => $(`#${view}edit`).getBoundingClientRect()
// return the current line index at caret position
const line_index =()=> lines_and_cols($(`#${view}edit`)).line
// return the current colum index at caret position
const col_index =()=> lines_and_cols($(`#${view}edit`)).col
// return the current editor lineheight value as a number
const line_height = ()=> {
  // get lineheight property computed  style
  // replace px from the string
  // return the single number
  const lineheight = getComputedStyle($(`#${view}edit`)).lineHeight
  const newLh = lineheight.replace('px', "")
  return Number(newLh)
}

let fixed_caret_left = ()=>{
  if ((editor_rect().right - 225) > (col_index() * char_w() - $(`#${view}edit`).scrollLeft - 20)) {
    return col_index() * char_w() -$(`#${view}edit`).scrollLeft - 20
  } else return editor_rect().right - 225
}
let fixed_caret_top = ()=>{
if((editor_rect().bottom - 300 ) > (line_index() * line_height() - $(`#${view}edit`).scrollTop)){
 return line_index() * line_height() - $(`#${view}edit`).scrollTop}
 else return editor_rect().bottom - 300
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
const css_props_keys = ()=>{
//get all css properties key value as string
		const styles = document.body.style;
		const styleKeys = Object.keys(styles);
// crate array with keys in snakeCase
		const snakeCaseProperties = styleKeys.map(property => toSnakeCase(property));
// return array with each snakecased css-property-keys 
		return snakeCaseProperties; // muestra todas las propiedades CSS del elemento en snake-case
}
const js_snippets_keys = ()=>{
  // store all properties and methods from window object and document & array protoypes
  // getting an array per object
  // then store them in a array of arrays
  // then create a new array and push to it all properties and methods names
  // then return the new array
	const windowProps = Object.getOwnPropertyNames(window)
	const documentProps = Object.getOwnPropertyNames(Document.prototype)
	const Arraymethods = Object.getOwnPropertyNames(Array.prototype)
	const Allprops = [windowProps,documentProps,Arraymethods]
	let jskeys = [];
	Allprops.forEach(prop =>{
		prop.map(p => jskeys.push(p))
	})
	return jskeys
}
//function that returns an object with keys based in view 
//each prperty returns a filtered array containing props or snippets that matches current word
const word_match = {
	html:()=>html_snippets_keys().filter(prop=>prop.startsWith(current_word)),
	css: ()=>css_props_keys().filter(prop=>prop.startsWith(current_word)),
	js: ()=>js_snippets_keys().filter(prop =>prop.startsWith(current_word))
}
// let to store currentword
let current_word = ''
let selection =''
function createCurrentWordforAutocomplete(e) {
  // remove autocomplete_list to prevent duplication of options
 
  // if last character was a letter or '-' 
  //////  build current_word by adding the last character to it	
  //////  if word_match array is not empty means that there is at least one match
  ///////// so then display autocomplete list
  // else we reset the current word
  $('.autocomplete_list')?.remove()
  if(/[a-zA-Z-]/.test(lastChar(e))){
    current_word += lastChar(e);
    (word_match[view]().length > 0) && createAutocompleteList();
  } else  current_word = ''
  }
  function lastChar(e) {
    // capture the last character typed creating a sub-string from last position before selectionstart 
    // to the current cursor position and select the first character
    let last_char = e.target.value.substr(e.target.selectionStart -1,e.target.selectionStart).charAt(0);
    return  last_char
    }

const completeAndWrite = (e) => {
  ///structure the complete snippet with data-autocompletion attribute value
  let completion = e.target.dataset.autocompletion;
  let autocompletion = {
    html: `<${completion}></${completion}>`,
    css: completion + ': ;',
    js: completion += ' '
  };
  // hash the current editor based on view
  // get selection from selection start minus currentword length to avoid duplication of characters
  // then insert the autocompletion
  // then get focus on editor again
  // now put the cursor before ';'
  // update the preview
  // finally remove autocomplete list
  let input_ = $(`#${view}edit`);
  input_.setSelectionRange(input_.selectionStart - current_word.length, input_.selectionStart);
  input_.setRangeText(
                  autocompletion[view], 
                  input_.selectionStart, 
                  input_.selectionEnd, "end");
  input_.focus();
  input_.selectionEnd -= 1;
  updatePreviewDocument();
  $('.autocomplete_list').remove();
};
function createAutocompleteList(){
	// create autocomplete ul element
  // then add autocomplete_list class to referece and style it
  // then set the top and left properties based on caret's exact position and current editors top and left
	const autocomplete_list = document.createElement('ul');
	autocomplete_list.classList.add('autocomplete_list');
	let top = editor_rect().top + fixed_caret_top() + 2;
	let left = editor_rect().left + fixed_caret_left();
	autocomplete_list.style.top = top+'px';
	autocomplete_list.style.left = left+'px';
	// create a empty string to store options in a template literal with li elements in the future
	// map view based filtered properties and add tthem the list_template string a li element 
  /////// with data-autocompletion attribute to store each propety value
  // fill autocomplete list with the list items template
  // append the autocomplete_list to main tag element
  // then add a click event to each autocomplete_list_item (if exist) to write autocompletion
	let list_items = '';
	word_match[view]().map(prop=>{
		list_items += `<li class="autocomplete_list_item" data-autocompletion="${prop}">${prop}</li>`})
	autocomplete_list.innerHTML = list_items
	$(`main`).appendChild(autocomplete_list)
	arrayFrom('.autocomplete_list_item')?.map(li =>{
	li.addEventListener('click', completeAndWrite)
})
}

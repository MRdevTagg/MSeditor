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
const char_w = ()=>char_size(editor()).width
// height of a single character
const char_h = ()=>char_size(editor()).height
// return current editor bounding rects
const editor_rect = () => editor().getBoundingClientRect()
// return the current line index at caret position
const line_index =()=> lines_and_cols(editor()).line
// return the current colum index at caret position
const col_index =()=> lines_and_cols(editor()).col
// return the current editor lineheight value as a number
const line_height = ()=> {
  // get lineheight property computed style
  // replace px from the string
  // return the single number
  const lineheight = getComputedStyle(editor()).lineHeight
  const newLh = lineheight.replace('px', "")
  return Number(newLh)
}

const fixed_caret_left = ()=>{
  if ((editor_rect().right ) > (col_index() * char_w() - editor().scrollLeft )+180) {
    return col_index() * char_w() - editor().scrollLeft +20
  } else return editor_rect().right - 180
}
let fixed_caret_top = ()=>{
if((editor_rect().bottom - 150 ) > (line_index() * line_height() - editor().scrollTop)){
 return line_index() * line_height() - editor().scrollTop}
 else return editor_rect().bottom - 150
}

function lastChar(e) {
    // capture the last character typed creating a sub-string from last position before selectionstart 
    // to the current cursor position and select the first character
   
    return e.target.value.substr(editor().selectionStart -1,editor().selectionStart).charAt(0);
}


//function that returns an object with keys based in KEY
//each prperty returns a filtered array containing props or snippets that matches current word
const word_match = {
	html:()=>html_snippets_keys().filter(prop=>prop.startsWith(current_word)),
	css: ()=>css_props_keys().filter(prop=>prop.startsWith(current_word)),
	js: ()=>js_snippets_keys().filter(prop =>prop.startsWith(current_word))
}
// let to store currentword
let current_word = ''

function createCurrentWordforAutocomplete(e) {
  // 1 - remove autocomplete_list to prevent duplication of options
  // 2 - if last character was a letter or '-' :
  //      1 - build current_word by adding the last character to it	
  //      2 - if word_match length is not empty means that there is at least one match
  //      3 - so let's display autocomplete list
  // 3 - else, then reset the current word
  $('.autocomplete_list')?.remove()
  if(/[a-zA-Z-]/.test(lastChar(e))){
    current_word += lastChar(e);
    (word_match[KEY]().length > 0) && createAutocompleteList();
  } else  current_word = ''
}
const completeAndWrite = (e) => {
  // 1 - structure the complete snippet with data-autocompletion attribute 
  // 2 - then create a KEY based object to cover each case
  // 4 - get selection from selection start minus currentword length to avoid duplication of characters
  // 5 - then complete the word, get focus on editor, put the cursor before ';'
  // and update the preview with writeText method
  // 6 - finally remove autocomplete list
  let completion = e.target.dataset.autocompletion;
  let autocompletion = {
    html: `<${completion}></${completion}>`,
    css: completion + ': ;',
    js: completion += ' '
  };
 
  editor().setSelectionRange(editor().selectionStart - current_word.length, editor().selectionStart);
  writeText(autocompletion[KEY], -1);

  $('.autocomplete_list').remove();
};
function createAutocompleteList(){
	// create autocomplete ul element
  // then add autocomplete_list class to referece and style it
  // then set the top and left properties based on caret's exact position and current editors top and left
	const autocomplete_list = document.createElement('ul');
	autocomplete_list.classList.add('autocomplete_list');
	let top = editor_rect().top + fixed_caret_top() + 4;
	let left = fixed_caret_left();
	autocomplete_list.style.top = top+'px';
	autocomplete_list.style.left = left+'px';
  
	// create a empty string to store options in a template literal with li elements in the future
	// map KEY based filtered-by-match properties array, and then add each item to the the list_template string as a li element 
  // (with data-autocompletion attribute, to store each word value)
  // fill autocomplete list with the list items template
  // append the autocomplete_list to main tag element
  // then add a click event to each autocomplete_list_item (if exist) to write autocompletion
	let list_items = '';
	word_match[KEY]().map(prop=>{
		list_items += `<li class="autocomplete_list_item" data-autocompletion="${prop}">${prop}</li>`})
	autocomplete_list.innerHTML = list_items
	$(`main`).appendChild(autocomplete_list)
	arrayFrom('.autocomplete_list_item')?.map(li =>{
	li.addEventListener('click', completeAndWrite)
})
}

function highlightLine(){
  // get the current line
  let editor_paddingTop = Number(window.getComputedStyle($(`.pre${KEY}`))['padding-top'].replace('px',''))
  $('.line')?.remove()
  const top = (line_index() -1) * line_height() 
  const fixedTop = top + editor_paddingTop 
  const line = document.createElement('span');
  line.classList.add('line');
  line.style.background = KEYColors[KEY]+'2a';
  line.style.top = fixedTop-1+'px';
  line.style.right = -$(`.pre${KEY}`).scrollLeft + 'px';
  $(`.pre${KEY}`).appendChild(line);
}
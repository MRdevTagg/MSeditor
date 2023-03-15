window.addEventListener('load',updateEditor)

let dialog_visible = false
/// this three vars wilL contain the source of html,css an js code retrieved from user input or loaded files from localStorage or user file upload
/// i declare them as vars 'cause in the future we will access them taking advantage of view state string by using window[view]
var html = `<div>
  <h1>COMIENZA A ESCRIBIR CODIGO</h1>
</div>
<p>HTML</p>
<p>CSS</p>
<p>JAVASCRIPT</p>`;
var css = `body{
  color:#4c6892;
  background:white;
}`;
var js = `const h1 = document.querySelector('h1')
h1.addEventListener('click',()=> alert('funcionando'))`;
//FUNCTION THAT RETURNS THE SRCDOC FOR('.PREVIEW') IFRAME
const content = () => `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Output</title>
	<style>${css}</style>
</head>
<body>
${html}
	<script>${js}</script>
</body>
</html>
`;
/// object that will contain the data from 'html','css','js','fileID','fileName'
let data;
/// String that represents the action state.
let action = 'save';
/// selected file
let selected = null;
/// String that represents the current view state. it changes when function switchEditor() is called 
/// it's value will be retrived from editors[*] data-editor atrribute
let view = 'html'
// returns an object that contains current line and column indexes of current caret position
const codePos = (textarea)=>{
	if(textarea !== undefined){
     let textLines = textarea.value.substr(0, textarea.selectionStart).split("\n");
     let currentLineNumber = textLines.length;
     let currentColumnIndex = textLines[textLines.length-1].length+1;
     return{ line:currentLineNumber,
     col:currentColumnIndex }}
  }
// Returns an array that contains all lines number
const lines = ()=> $(`#${view}edit`).value.split('\n')
const show_lines_and_cols = ()=>`<span>LINE :</span>  ${codePos($(`#${view}edit`)).line}  &#9|&#9   <span>COL :</span>  ${codePos($(`#${view}edit`)).col}`;
///// EDITOR ////

/// now we create an object with it's keys based on view state and values are strings with color hex
/// that way we will change colors based on view state (using view as object key eg.: viewBasedColors[view] )
const viewBasedColors ={html: '#ea9364',css:'#62a9d1fc',js:'#fed55a',preview:'#424242'}
/// updates the line numbers and displays into $('#lineNumbers') <pre> tag
 function updateLines() {
// if we are not in the preview iframe('cause it has no lines)
		if(view !== 'preview'){
// Clear all previous line numbers to prevent duplication of the entire lines array 
 			$('#lineNumbers').innerHTML = ''
// iterates lines array and display each line index (plus 1 to avoid zero value)
// then displays it on $('#lineNumbers') <pre> tag
 			lines().forEach((line,i)=>{
		  $('#lineNumbers').innerHTML += i+1+'</br>'
  		})
	$('#linesandcols').innerHTML = show_lines_and_cols();
	}
 }
/// Updates entire document based on user's input
function updatePreviewDocument(){
/// updates the strings based on each editors value (not pre-view yet)
	html = document.querySelector('#htmledit').value
	js = document.querySelector('#jsedit').value
	css = document.querySelector('#cssedit').value

  view !== 'preview' && lastLineFix();
  updateLines();
	// update pre/code #highlighting-* tags
	updateCodeTags();
/// updates pre-view iframe
	$('#viewedit').srcdoc = content()

}
function updateCodeTags() {
	// adapt text using regular expressions to visualize '<' and '>' characters and fill code tags with it 
	$('#highlighting-css').innerHTML = css.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
	$('#highlighting-js').innerHTML = js.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
	$('#highlighting-html').innerHTML = html.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
	// apply highlight to all pre/code using Prims.js
	Prism.highlightAll();
}
// fixes bug that avoid enter a new line in 
function lastLineFix() {
	/// access to html,css and js strings vars throught window object and hash them on a let called wv
	let wv = window[view]
		if (wv[wv.length - 1] == "\n") {
		wv += " ";

	}
}
/// syncronize top an left of textarea and pre tags
function scrollSync() {
	$(`.pre${view}`) &&	($(`.pre${view}`).scrollTop = $(`#${view}edit`).scrollTop)
	$(`.pre${view}`) &&	($(`.pre${view}`).scrollLeft = $(`#${view}edit`).scrollLeft)
	$(`#lineNumbers`).scrollTop = $(`#${view}edit`).scrollTop
}
function KeydownHandler(e){
 	textarea = e.target
 	let rangeText = ''
 	if(e.key == "Tab") {
 		 rangeText = '  '
 	e.preventDefault();
}
 	else if (e.keyCode == 13){
 	  rangeText = ' '
 	}
 		 setTimeout(()=>{
			textarea.setRangeText( rangeText,
       textarea.selectionStart,
       textarea.selectionStart,
       'end'
     )
		updatePreviewDocument()	 
 		 },10)
		createCurrentWord(e)

}
/// update textareas editors if there are changes on html,css,js strings. on load or delete, filoOpen,etc
function updateEditor() {
	$('#htmledit').value = html;
 	$('#cssedit').value = css;
	$('#jsedit').value = js;
	updatePreviewDocument()
 }


 //// 	editor ui ////

function switchEditor(btn, i, allbtns) {
/// first we create an array that contains all editor windows
	let editors = [$('.html'), $('.css'), $('.js'), $('.preview')]
/// then we add a listener to the button to change editor's view after user clicks on it	
		btn.addEventListener('click', () => {
/// remove '.selected' class from all btns
		allbtns.forEach( b => b.classList.remove('selected'))
/// then add '.selected' class to current clicked btn	
		btn.classList.add('selected')
/// quit focus over current editor(textareas only) if exist or in this case if is not the iframe
	  $(`#${view}edit`)?.blur()
/// iterate over all editors(textareas and iframe) and then remove them from sight
		editors.map((ed) => ed.style.display = 'none');
/// then we make visible only the current editor (based on current btn index)
		editors[i].style.display = 'flex';
/// now we declare a let that contains the actual value of view (before we change it)		
		let past_view = view;
/// now we change view value retriveing it from current editor's data-editor attribute (based on current btn index)
		view = editors[i].dataset.editor;
/// finally we change all UI inside editor based on current view value
			changeUiAfterEditorChanges(past_view);
	})
	;
}
function changeUiAfterEditorChanges(past_view) {
	// if autocomplete list is displayed then remve it
  $('.autocomplete_list')?.remove()
	/// we create a constant that holds time for transitions and timeouts globaly
 const gTime = 0;
	/// we change the mime type that #fileopen file input accepts throught the filetypes Object setting it's key by current view
		$('#file-open').setAttribute('accept', filetypes[view]);

	if (past_view !== view) {
	/// now we change the colors on all ui items that need it with the following function
		changePreviewColor(viewBasedColors);
	/// if we're not on preview iframe remove editor options, linenumbers and col numbers
		if (view === 'preview') {
			download_btn.remove$();
			fileopen_btn.remove$();
			$('.editing').innerHTML = 'VIEW';
			$('#lineNumbers').style.display = 'none';
			$('#linesandcols').style.display = 'none';
		}
		else {
			updateLines();
			$('#lineNumbers').style.display = 'block';
			$('#linesandcols').style.display = 'block';
			$('.editing').innerHTML = view.toUpperCase();
		}
		snippets_btn_container.remove$();

			if (view !== 'preview') {
				download_btn.show(gTime);
				fileopen_btn.show(gTime);
			}
			snippets[view] && createSnippets(snippets[view]);

	}
}
function changePreviewColor(colors) {
	$('.editing').style.border ='2px solid'+ colors[view];
	$('#lineNumbers').style['color'] = colors[view]
	view !== 'preview' ?
	$('.editing').style.color = colors[view]:
	$('.editing').style.color = 'white';

}
///// end EDITOR ////


////// DATA MANAGMENT /////

function save(){

	data = JSON.parse(window.localStorage.getItem('data')) || []
	fileName = String($('#name').value) || 'Nuevo'
	fileId = selected ? selected.dataset.id : data.length
	let dateyear = formatDate(new Date()).year
	let datehours = formatDate(new Date()).hours
	
	newdata = {html,css,js,fileName,fileId,dateyear,datehours}
	selected ?
	data.splice(fileId,1,newdata) :
	data.unshift(newdata)
	updateDataIndex()
  window.localStorage.setItem('data',JSON.stringify(data))
  	
}
function load(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	id = selected.dataset.id
	
	html = data[id].html
	css = data[id].css
	js = data[id].js

}
function removeAlldata(){
  window.localStorage.removeItem('data')
  data = JSON.parse(window.localStorage.getItem('data')) || []

}
function removeItem(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	id = selected.dataset.id
	
		data.splice(id,1)
		updateDataIndex();
	(selected) && (selected = null);
}
function reset(){
	html = ''
	css = ''
	js = ''
  updateEditor()

}
function updateDataIndex() {
	data.forEach((file, i) => file.fileId = i);
	window.localStorage.setItem('data', JSON.stringify(data));
}
//// DOWNLOAD HANDLER ////

function download(src, filename,type){
  var blob = new Blob([src], {type: type});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url)
}
const downloadFile = { 
	html:()=> download(html,'index','text/html'),
	css:()=> download(css,'style','text/css'),
	js:()=> download(js,'code','text/javascript'),
	preview:()=>{return}
}
const filetypes = {
	html:'text/html',
	css:'text/css',
	js:'text/javascript',
}
const fileUpload = () =>{
		return{
			html:(content)=> {html = content},
			css:(content)=> {css = content},
			js:(content)=> {js = content},
		}
}
function openFile(e) {

		let loaded_file = e.target.files[0];
		if (loaded_file) {
			let reader = new FileReader();
			reader.onload = (e)=> {
				let contents = e.target.result;
				fileUpload()[view](contents)
				updateEditor()
				create_action_log(`<p>El Archivo: <span style="color:blue;font-weight:700">${loaded_file.name}</span> ha sido Cargado con éxito</p>`)
			}
			reader.readAsText(loaded_file);
		} else {create_action_log('<p>Error abriendo el archivo</p>')}
}
////// end DATA MANAGMENT /////

////// UI/VIEW //////

function showMenu(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	actionSelect();
	updateFiles();
	(!dialog_visible) && showHideMenu()
}
function updateFiles() {
	$('#files').innerHTML = ``;
	data.forEach((file) => {
		if (file) {	
			newFile = document.createElement('div');
			newFile.classList.add('file');
			newFile.setAttribute('data-name',file.fileName)
			newFile.setAttribute('data-id',file.fileId)
			newFile.setAttribute('data-dateyear',file.dateyear)
			newFile.setAttribute('data-datehours',file.datehours)
			newFile.innerHTML = addFileContent(file);			
			$('#files').appendChild(newFile);
		}
	});

	SelectFileHandler();

}
function SelectFileHandler() {
	arrayFrom('.file').forEach((file) => {
		file.addEventListener('click', () => {
			all_btns.state.added && all_btns.remove$();
			if (selected !== null) {
				selected.classList.remove('selected');
			}
			file.classList.add('selected');
			selected = file;
			all_btns.state.visible = true;
			all_btns.create(file);
			
		(dialog_message.state.added) &&	(dialog_message.$.innerHTML = onAction().ask[action])
			$('#name') && ($('#name').value = file.dataset.name);
			$('#name') && ($('#name').focus());
		});
	});
}
function addFileContent(file) {
			return `
			<div class="file-id-representation">
			<p>${Number(file.fileId) + 1}</p>
			</div>
			<div class="file-name-representation">
			<p>${file.fileName}</p>
			</div>
			<div class="file-date-representation"><p>${
				file.dateyear ? file.dateyear:''}<br>${file.datehours ? file.datehours : ''}</p>
			<div>
			`;
}
function showHideMenu(ms = 500) {
	$('#dialog').style.transition = `all ${ms}ms`

	if(!dialog_visible){ 
		$('#dialog').style.display = 'flex'
			setTimeout(()=>{
				$('#dialog').style.opacity = 1
  			dialog_visible = true
			},10)}
	else{
		$('#dialog').style.opacity = 0
			setTimeout(()=>{
			$('#dialog').style.display = 'none'
			dialog_visible = false
		},ms)

	}
}

//// ACTION HANDLING ////

function actionSelect() {
confirm_dialog.childs.forEach(child => child.addCalls())

}
function actionPerform(){
	create_action_log()
	onAction().perform[action]()
	actionFinish();
	(selected && !action.includes('delete')) && 
	($('#filename').textContent = `Archivo:  ${selected?.dataset.name}`)
	
}
function actionFinish() {

	updateFiles()
	updateEditor()
	confirm_dialog.hide(700);
	showHideMenu();
	
}
////// end UI/VIEW //////

///// MAIN APP ///////
changePreviewColor(viewBasedColors);
$('.editing').innerHTML = view.toUpperCase()
$('main').style['height'] = window.innerHeight + 'px';
$('#dialog').style['height'] = window.innerHeight + 'px';
$('#fullEditor').style.marginTop = $('header').clientHeight + 'px';


/////  ///////

////// EVENT Listeners ///////

window.addEventListener('resize',HandleSizes())

arrayFrom('textarea').forEach((txt,i)=> {
	txt.addEventListener('input',(e)=>{
	  updatePreviewDocument();
	  scrollSync()
	}
	);
	txt.addEventListener('keyup',	e=>KeydownHandler(e,i))
	txt.addEventListener('scroll',	e=>scrollSync(e,i))
	txt.addEventListener('click',		e=>	{
	$('.autocomplete_list')?.remove()
	current_word = ''
		$('#linesandcols').innerHTML = show_lines_and_cols();}
	)
})
$('#fullEditor').addEventListener('click',()=>(dialog_visible) && showHideMenu())

const btn_selectEditor = [$('#htmldwn'), $('#cssdwn'), $('#jsdwn'), $('#previewdwn')]
btn_selectEditor.forEach((btn, i, all) => {
	btn.style.transition = 'all .5s'
	switchEditor(btn, i, all);
})
$('#file-open').addEventListener('change', openFile, false);
$('#new').addEventListener('click',()=>{ 
	selected = null
	action ='save';
 	actionSelect() ; 
	confirm_dialog.show(700); 
	input_name.show(700,{opacity:1,transform:'scale(.9)'})
 })
$('#remove').addEventListener('click',()=>{ 
	action ='delete-all';
 	actionSelect();	
 	confirm_dialog.show(700)
 })
$('#filemenu').addEventListener('click',()=> showMenu())
$('#close').addEventListener('click',()=>(dialog_visible) && showHideMenu())

function HandleSizes() {
	return () => {
		$('main').style['height'] = window.innerHeight + 'px';
		$('#dialog').style['height'] = window.innerHeight + 'px';
		$('#fullEditor').style.marginTop = $('header').clientHeight + 'px';
		[snippets_btn_container,download_btn,fileopen_btn].forEach(uielm => uielm.addCalls())

	};
}
////AUTOCOMPLETE////
function obtenerTamanoLetra(elemento) {
  const span = document.createElement('span');
  span.style.fontFamily = window.getComputedStyle(elemento).fontFamily;
  span.style.fontSize = window.getComputedStyle(elemento).fontSize;
  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  span.innerHTML = 'A';

  document.body.appendChild(span);

  const ancho = span.offsetWidth;
  const alto = span.offsetHeight;

  document.body.removeChild(span);

  return { ancho, alto };
}
const anchoFuente = obtenerTamanoLetra($(`#${view}edit`)).ancho
const altoFuente = obtenerTamanoLetra($(`#${view}edit`)).alto

console.log(anchoFuente)
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
//function that returns a filtered array containing props or snippets that matches current word 
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
	let leftLine = ()=>{
		if (($(`#${view}edit`).getBoundingClientRect().right - 225) > (codePos($(`#${view}edit`)).col * anchoFuente -$(`#${view}edit`).scrollLeft - 20)) {
			return codePos($(`#${view}edit`)).col * anchoFuente -$(`#${view}edit`).scrollLeft - 20
		} else {
			return $(`#${view}edit`).getBoundingClientRect().right - 225
		}
	}
	let topline = ()=>{
	if(($(`#${view}edit`).getBoundingClientRect().bottom - 300 ) > (codePos($(`#${view}edit`)).line * 15 -$(`#${view}edit`).scrollTop)){
	 return codePos($(`#${view}edit`)).line * 15 -$(`#${view}edit`).scrollTop}
	 else return $(`#${view}edit`).getBoundingClientRect().bottom - 300}
	let top = $(`#${view}edit`).getBoundingClientRect().top + topline() 
	let left = $(`#${view}edit`).getBoundingClientRect().left + leftLine();
	console.log(`${top} -- ${left}`)
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



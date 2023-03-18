window.addEventListener('load',updateEditor)

let dialog_visible = false
/// this three vars wilL contain the source of html,css an js code retrieved from user input or loaded files from localStorage or user file upload
/// i declare them as vars 'cause in the future we will access them taking advantage of view state string by using window[view]
var html = `<div>
  <h1>CODE</h1>
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
const lines_and_cols = (textarea = $(`#${view}edit`))=>{
	if(textarea !== undefined){
     let textLines = textarea.value.substr(0, textarea.selectionStart).split("\n");
     let currentLineNumber = textLines.length;
     let currentColumnIndex = textLines[textLines.length-1].length+1;
     return{ line:currentLineNumber,
     col:currentColumnIndex }}
  }
// Returns an array that contains all lines number
const lines = ()=> $(`#${view}edit`).value.split('\n')
/// returns a template string with a span showing current line and column at caret position
const show_lines_and_cols = ()=>`<span>LINE :</span>  ${lines_and_cols($(`#${view}edit`)).line}&#9|&#9<span>COL :</span>  ${lines_and_cols($(`#${view}edit`)).col}`;
///// EDITOR ////

/// Object with it's keys based on view state and values are strings with color hex
/// that way we will change colors based on view state (using view as object key eg.: viewBasedColors[view] )
const viewBasedColors ={html: '#ea9364',css:'#62a9d1fc',js:'#fed55a',preview:'#424242'}
/// updates the line numbers and displays into $('#lineNumbers') <pre> tag
 function updateLines() {
// if we are not in the preview iframe('cause it has no lines)
// Clear all previous line numbers to prevent duplication of the entire lines array 
// now iterate lines array and display each line index (plus 1 to avoid zero value)
// then displays it on $('#lineNumbers') <pre> tag
// finally display in linesandcols element current caret line and colum index
		if(view !== 'preview'){
 			$('#lineNumbers').innerHTML = ''
 			lines().forEach((line,i)=>{
		  $('#lineNumbers').innerHTML += i+1+'</br>'})
	$('#linesandcols').innerHTML = show_lines_and_cols();
	}
 }
/// Updates entire document based on user's input
function updatePreviewDocument(){
/// updates the strings based on each editors value (not pre-view yet)
/// fix the last line problem
/// update lines display
/// update pre/code #highlighting-* tags
/// update pre-view iframe
	html = document.querySelector('#htmledit').value
	js = document.querySelector('#jsedit').value
	css = document.querySelector('#cssedit').value
  view !== 'preview' && lastLineFix();
  updateLines();
	updateCodeTags();
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
// fixes bug that avoid display a new line in pre tag adding a space character
// to give body to the text, that way new lines will be displayed in both (eitor and pre tag)
function lastLineFix() {
	/// access to html,css and js strings vars throught window object and hash them on a let
	/// then if last character equals a line break
	/// then add a space character
	let wv = window[view]
		if (wv && wv[wv.length - 1] == "\n") {
		window[view] += " ";
	}
}
/// syncronize top an left of textarea and pre tags
function scrollSync() {
	$(`.pre${view}`).scrollTop = $(`#${view}edit`).scrollTop
	$(`.pre${view}`).scrollLeft = $(`#${view}edit`).scrollLeft
	$(`#lineNumbers`).scrollTop = $(`#${view}edit`).scrollTop
}
// a let to store current colum index to compare in keydown and keyup events
let keydown_col_index;
function KeyDown(e){
	/// store current column index to compare in the future with colum index at keyup event
	/// store the selection 
	/// if key is tab we write a space twice to simulate identation 
	keydown_col_index = lines_and_cols().col;
	selection = e.target.value.slice(e.target.selectionStart, e.target.selectionEnd)

	if(e.key == "Tab"){
		e.preventDefault()
		writeText('  ')
	} 	
}
function KeyUp(e){
	// 1 - create an array containing all e.keycodes that we want to deny called denied_keys.  
	//   then filter this array to get a new one with only the value that matches the e.keycode
	// 2 - now we ask if the filtered array length is equal to zero,
	//   cause' it means that the current e.keycode is not in the denied_keys list
	//   and also check if colum index at keyup (now) is greater than colum index at keydown,
	//   that way we ensure that the last key was not left arrow key or backspace
	// 3 - if that's true, we hash the last character typed
	// 4 - then we create an object that will contain {last_character : character_to_complete}, 
	//   so we can handle all cases working with these key/value pairs instead of using a switch statement
	// 5 - then we loop over the object using for in 
	// 6 - if the last character matches a key from the object we write it's corresponding value 
	//   and position the caret 1 before end using writeText() method
	// 7 - finally we create current_word for autocomplete_list
	const denied_keys = [16,17,18,37,38,39,40].filter(key => key == e.keyCode)
	if(denied_keys.length == 0 && keydown_col_index < lines_and_cols().col){
		const last = lastChar(e)
		const completechars = {'{':'}' , '(':')' , '[':']' , '"':'"' , '`':'`' , "'":"'" }
		for (const key in completechars) {
		(last == key) && writeText(completechars[key],-1)
	}
	createCurrentWordforAutocomplete(e)
}
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
/// 1 - first we create an array that contains all editor windows
/// 2 - then we add a listener to the button to change editor's view after user clicks on it	
/// remove '.selected' class from all btns
/// then add '.selected' class to current clicked btn	
/// quit focus over current editor(textareas only) if exist or in this case if is not the iframe
/// iterate over all editors(textareas and iframe) and then remove them from sight
/// then we make visible only the current editor (based on current btn index)
/// now we declare a let that contains the actual value of view (before we change it)		
/// now we change view value retriveing it from current editor's data-editor attribute (based on current btn index)
/// we change all UI inside editor based on current view value
/// and finally if view is not preview we focus on editor to
let editors = [$('.html'), $('.css'), $('.js'), $('.preview')]
btn.addEventListener('click', () => {
allbtns.forEach( b => b.classList.remove('selected'))
btn.classList.add('selected')
$(`#${view}edit`)?.blur()
editors.map((ed) => ed.style.display = 'none');
editors[i].style.display = 'flex';
let past_view = view;
view = editors[i].dataset.editor;
			changeUiAfterEditorChanges(past_view);
			(view !== 'preview' ) && $(`#${view}edit`)?.focus()
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
			$('.tools').style.display = 'none'
			$('#lineNumbers').style.display = 'none';
			$('#linesandcols').style.display = 'none';
		}
		else {
			updateLines();

			$('#lineNumbers').style.display = 'block';
			$('#linesandcols').style.display = 'block';
			$('.tools').style.display = 'flex'
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
setTimeout(() => {
	['html','css','js'].map(v=>history.add(v))
}, 50);
////// EVENT Listeners ///////
window.addEventListener('resize',HandleSizes())

arrayFrom('textarea').forEach((txt,i)=> {
	txt.addEventListener('input',(e)=>{
		updatePreviewDocument();
	  scrollSync()
		history.add(view)
	}
	);
	txt.addEventListener('keydown',	e=>KeyDown(e))
	txt.addEventListener('keyup',	e=>KeyUp(e,i))
	txt.addEventListener('scroll',	e=>scrollSync(e,i))
	txt.addEventListener('focus',	e=>scrollSync(e,i))
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

$('#undo').addEventListener('click',(e)=>{

	history.undo(view)
})
$('#redo').addEventListener('click',(e)=>{

	history.redo(view)
})


function HandleSizes() {
	return () => {
		$('main').style['height'] = window.innerHeight + 'px';
		$('#dialog').style['height'] = window.innerHeight + 'px';
		$('#fullEditor').style.marginTop = $('header').clientHeight + 'px';
		[snippets_btn_container,download_btn,fileopen_btn].forEach(uielm => uielm.addCalls())

	};
}




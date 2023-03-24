window.addEventListener('load',updateEditor)
///  the KEY: it's value will be retrived from editors[*] data-editor atrribute
let KEY = 'html'
let dialog_visible = false
// object to store the html, css, and js sources used to build content for preview iframe's srcdoc
const source = {html : `<div>
  <h1>CODE</h1>
</div>
<p>HTML</p>
<p>CSS</p>
<p>JAVASCRIPT</p>`,
css : `body{
  color:#4c6892;
  background:white;
}`,
js : `const h1 = document.querySelector('h1')
h1.addEventListener('click',()=> alert('funcionando'))`,
}
const editor = ()=>$(`#${KEY}edit`);
//FUNCTION THAT RETURNS THE SRCDOC FOR('.PREVIEW') IFRAME
const content = () => `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Output</title>
	<style>${source.css}</style>
</head>
<body>
${source.html}
	<script>${source.js}</script>
</body>
</html>
`;
/// objects Array that will contain the data from 'html','css','js','fileID','fileName'
let data;
const saveData = (data)=>{window.localStorage.setItem('data', JSON.stringify(data))}
const getData = (dataname)=>JSON.parse(window.localStorage.getItem(dataname)) || [];
/// String that represents the action key.
let act_KEY = 'save';
/// selected file
let selected = null;
/// String that represents the current view state. it changes when function switchEditor() is called 

/// all view editor keys
const keys = ['html','css','js']
/// History object
const history_log = new HistoryRecord()
// returns an object that contains current line and column indexes of current caret position
const lines_and_cols = ()=>{
	if(editor()){
     let textLines = editor().value.substr(0, editor().selectionStart).split("\n");
     let currentLineNumber = textLines.length;
     let currentColumnIndex = textLines[textLines.length-1].length+1;
     return{ line:currentLineNumber,
     col:currentColumnIndex }}
  }
// Returns an array that contains all lines number
const lines = ()=> editor().value.split('\n')
/// returns a template string with a span showing current line and column at caret position
const show_lines_and_cols = ()=>`<span>LINE :</span>  ${lines_and_cols().line}<span>COL :</span>  ${lines_and_cols().col}`;
///// EDITOR ////

/// Object with it's keys based on view state and values are strings with color hex
/// that way we will change colors based on view state (using view as object key eg.: viewBasedColors[view] )
const KEYColors ={html: '#ea9364',css:'#62a9d1',js:'#fed55a',preview:'#424242'}
/// updates the line numbers and displays into $('#lineNumbers') <pre> tag
 function updateLines() {
// if we are not in the preview iframe('cause it has no lines)
// Clear all previous line numbers to prevent duplication of the entire lines array 
// now iterate lines array and display each line index (plus 1 to avoid zero value)
// then displays it on $('#lineNumbers') <pre> tag
// finally display in linesandcols element current caret line and colum index
		if(KEY !== 'preview'){
 			$('#lineNumbers').innerHTML = ''
 			lines().forEach((line,i)=>{
		  $('#lineNumbers').innerHTML += `<span width="35px">${i+1}</span></br>`})
			$('#linesandcols').innerHTML = show_lines_and_cols();
	}
 }
/// Updates entire document based on user's input
function updateSource(){
/// update sources
/// fix the last line problem
/// update lines display
/// update pre/code #highlighting-* tags
/// adapt sources using regular expressions to visualize '<' and '>' characters and fill code tags with it 
/// apply highlight to all pre/code using Prims.js
/// update VIEW iframe
	keys.map(key => source[key] = $(`#${key}edit`).value)
  KEY !== 'preview' && lastLineFix();
  updateLines();
	keys.map(key => $(`#highlighting-${key}`).innerHTML = source[key].replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;"))
	Prism.highlightAll();
	$('#viewedit').srcdoc = content()
}
function onInput(){
	updateSource();
	scrollSync();
	highlightLine()
	history_log.add(KEY);
}
// fixes bug that avoid display a new line in pre tag adding a space character
// to give body to the text, that way new lines will be displayed in both (eitor and pre tag)
function lastLineFix() {
	/// last character in current source equals a line break
	/// then add a space character
		if ( source[KEY][source[KEY].length - 1] == "\n") {
		source[KEY] += " ";
	}
}
/// syncronize top an left of textarea and pre tags
function scrollSync() {
	$(`.pre${KEY}`).scrollTop = editor().scrollTop
	$(`.pre${KEY}`).scrollLeft = editor().scrollLeft
	$(`#lineNumbers`).scrollTop = editor().scrollTop
	highlightLine()
}
function onClick() {
	$('.autocomplete_list')?.remove();
	current_word = '';
	$('#linesandcols').innerHTML = show_lines_and_cols();
	highlightLine()
}
// a let to store current colum index to compare in keydown and keyup events
let keydown_col_index;
// let to store selection
let selection = ''
function KeyDown(e){
	/// store current column index to compare in the future with colum index at keyup event
	/// store the selection 
	/// if e.key is tab we write a space twice to simulate identation 
	keydown_col_index = lines_and_cols().col;
	selection = editor().value.slice(e.target.selectionStart, e.target.selectionEnd)
	if(e.key == "Tab"){
		e.preventDefault()
		writeText('  ')
	} 	
}
function KeyPress(e){
	e.keyCode == 13 && e.stopPropagation()
}
function KeyUp(e){
	// 1 - create an array containing all e.keycodes that we want to deny called denied_keys.  
	//   then filter this array to get a new one with only the value that matches the e.keycode
	// 2 - now we check if the filtered array length is equal to zero,
	//   cause' it means that the current e.keycode is not in the denied_keys list
	//   and also check if column index at keyup (now) is greater than colum index at keydown,
	//   that way we ensure that the last key was not left arrow key or backspace
	// 3 - if that's true, we store the last character typed
	// 4 - then we create an object that will contain {last_character : character_to_complete}, 
	//   so we can handle all cases working with these key/value pairs instead of using a switch statement
	// 5 - then we loop over the object key and value pairs using for in 
	// 6 - if the last character matches a key from the object we write it's corresponding value 
	//   and position the caret before end using writeText() method
	// 7 - finally we create current_word for autocomplete_list
	highlightLine()
	scrollSync
	const denied_keys = [16,17,18,37,38,39,40].filter(key => key == e.keyCode)
	 if(denied_keys.length == 0 && keydown_col_index < lines_and_cols().col){
		const last = lastChar(e)
		const completechars = {'{':'}' , '(':')' , '[':']' , '"':'"' , "`":"`" , "\'":"\'" }
		for (const key in completechars) {
		(last == key) && writeText(completechars[key],-1)
	}
	createCurrentWordforAutocomplete(e)
} 
}


/// update textareas editors if there are changes on html,css,js strings. on load or delete, filoOpen,etc
function updateEditor() {
	keys.map(key => $(`#${key}edit`).value = source[key])
	updateSource()
	history_log.clear()
 }


 //// 	editor ui ////

function switchEditor(btn, i, allbtns) {
/// 1 - first we create an array that contains all editor windows
/// 2 - then we add a listener to the button and remove '.selected' class from all btns
/// 3 - then add '.selected' class to current clicked btn	
/// 4 - quit focus over current editor(textareas only) if exist or in this case if is not the iframe
/// 5 - iterate over all editor's tab(textareas and iframe) and then remove them from sight
/// 6 - then we make visible only the current editor tab (based on current btn index)
/// 7 - now we declare a let 'past_view' to store the actual value of KEY (before we change it)		
/// 8 - now we change KEY value retriveing it from current editor's data-editor attribute (based on current btn index)
/// 9 - Finally we change all UI inside editor based on current view value

btn.addEventListener('click', () => {
allbtns.map( b => b.classList.remove('selected'))
btn.classList.add('selected')

editor()?.blur()
const codeTabs = [$('.html'), $('.css'), $('.js'), $('.preview')]
codeTabs.map((ed) => ed.style.display = 'none');
codeTabs[i].style.display = 'flex';
let past_KEY = KEY;
KEY = codeTabs[i].dataset.editor;

UpdateUI(past_KEY);
});
}


function UpdateUI(past_KEY) {
	// if autocomplete list is displayed then remve it
  $('.autocomplete_list')?.remove()

	if (past_KEY !== KEY) {
	/// now we change the colors on all ui items that need it with the following function
	  AddOrRemoveListeners(past_KEY);
		changeColors(KEYColors);
	/// if we're on preview iframe remove editor options, linenumbers and col numbers
		if (KEY === 'preview') {
			download_btn.remove$();
			fileopen_btn.remove$();
			$('.editing').innerHTML = 'VIEW';
			$('.tools').style.display = 'none'
			$('#lineNumbers').style.display = 'none';
			$('.current-file').style.display = 'none';
			$('#linesandcols').style.display = 'none';
		}
	/// else 	
		else {
			updateLines();
			download_btn.show(0);
			fileopen_btn.show(0);
			$('#file-open').setAttribute('accept', `${KEY == 'js' ? 'text/javascript' :`text/${KEY}`}`);
		  $('.current-file').style.display = 'flex';
			$('#lineNumbers').style.display = 'block';
			$('#linesandcols').style.display = 'block';
			$('.tools').style.display = 'flex'
			$('.editing').innerHTML = KEY.toUpperCase();
			editor()?.focus()
		}		
	}
}
function AddOrRemoveListeners(past_KEY) {
	if (past_KEY !== 'preview') {
		const pastEditor = $(`#${past_KEY}edit`);
		pastEditor.removeEventListener('input', onInput);
		pastEditor.removeEventListener('keydown', KeyDown);
		pastEditor.removeEventListener('keypress', KeyPress);
		pastEditor.removeEventListener('keyup', KeyUp);
		pastEditor.removeEventListener('scroll', scrollSync);
		pastEditor.removeEventListener('focus', scrollSync);
		pastEditor.removeEventListener('blur', HandleSizes);
		pastEditor.removeEventListener('click', onClick);
	if (KEY !== 'preview'){
		editor().addEventListener('input', onInput);
		editor().addEventListener('keydown', KeyDown);
		editor().addEventListener('keypress', KeyPress);
		editor().addEventListener('keyup', KeyUp);
		editor().addEventListener('scroll', scrollSync);
		editor().addEventListener('focus', scrollSync);
		editor().addEventListener('blur', HandleSizes);
		editor().addEventListener('click', onClick);
	}
	}
}
function changeColors(colors) {
	$('#lineNumbers').style['color'] = colors[KEY]
	KEY !== 'preview' ?
	$('.editing').style.color = colors[KEY]:
	$('.editing').style.color = 'white';
	$('.editing').style.textShadow = '0 0 3px ' + colors[KEY];
}
///// end EDITOR ////


////// DATA MANAGMENT /////
/// let to store current edited file reference
let current_file = {};
function save(){
/// get the data or create it
/// set the file name retirieving it from #name input (if exists) or default value
/// get the file id
/// get and store formatted current time
	data = getData('data')
	fileName = String($('#name')?.value) || 'Nuevo'
	fileId = selected ? selected.dataset.id : data.length
	let dateyear = formatDate(new Date()).year
	let datehours = formatDate(new Date()).hours
	
	newdata = {html: source.html,
						css: source.css,
						js: source.js,
						fileName,fileId,dateyear,datehours}
	selected ?
	data.splice(fileId,1,newdata) :
	data.unshift(newdata)
	data.forEach((file, i) => file.fileId = i);
	current_file = {name:fileName,id:fileId}
  saveData(data)
  	
}
function load(){
  data = getData('data')
	id = selected.dataset.id
	keys.map( key => source[key] = data[id][key] )
	current_file = {name:selected.dataset.name,id:id}
}
function removeAlldata(){
  window.localStorage.removeItem('data')
}
function removeItem(){
  data = getData('data')
	id = selected.dataset.id
	data.splice(id,1)
	data.forEach((file, i) => file.fileId = i);
  saveData(data);
	selected = null;
}
function reset(){
	keys.map( key => source[key] = '' )
  updateEditor()

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
function openFile(e) {
		let loaded_file = e.target.files[0];
		if (loaded_file) {
			let reader = new FileReader();
			reader.onload = (e)=> {
				source[KEY] = e.target.result
				updateEditor()
				create_action_log(`<p>El Archivo: <span style="color:blue;font-weight:700">${loaded_file.name}</span> ha sido Cargado con éxito</p>`)
			}
			reader.readAsText(loaded_file);
		} else {create_action_log('<p>Error abriendo el archivo</p>')}
}
////// end DATA MANAGMENT /////

////// UI/VIEW //////

function showFiles(){
  data = getData('data')
	createFiles();
	(!dialog_visible) && showHideFiles()
}
function addFileContent(file) {
			return `
			<div class="file-id">
			<p>${Number(file.fileId) + 1}</p>
			</div>
			<div class="file-name">
			<p>${file.fileName}</p>
			</div>
			<div class="file-date"><p>${
				file.dateyear ? file.dateyear:''}<br>${file.datehours ? file.datehours : ''}</p>
			<div>
			`;
}
function fileListener() {
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
		});
	});
}
function createFiles() {
	$('#files').innerHTML = ``;
	getData('data').forEach((file) => {
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

	fileListener();
}
function showHideFiles(ms = 500) {
	$('#files-container').style.transition = `all ${ms}ms`

	if(!dialog_visible){ 
		$('#files-container').style.display = 'flex'
			setTimeout(()=>{
				$('#files-container').style.opacity = 1
  			dialog_visible = true
			},10)}
	else{
		$('#files-container').style.opacity = 0
			setTimeout(()=>{
			$('#files-container').style.display = 'none'
			dialog_visible = false
		},ms)

	}
}

//// ACTION HANDLING ////


function actionPerform(){
	
	Action()[act_KEY]()
	actionFinish();
	(!act_KEY.includes('delete')) && 
	($('.filename').innerHTML = `"${current_file?.name}"` || 'Nuevo Archivo')
	create_action_log()
}
function actionFinish() {

	createFiles()
	updateEditor()
	modal_confirm_hide()
	//showHideFiles();
	
}
////// end UI/VIEW //////

///// First Update ///////
changeColors(KEYColors);
$('.editing').innerHTML = KEY.toUpperCase()
HandleSizes()
/////  ///////



////// EVENT Listeners ///////

  //////////////
 /// EDITOR ///
//////////////
const btn_selectEditor = [$('#htmldwn'), $('#cssdwn'), $('#jsdwn'), $('#previewdwn')]
btn_selectEditor.forEach((btn, i, all) => { switchEditor(btn, i, all); })
editor().addEventListener('input', onInput);
editor().addEventListener('keydown', KeyDown)
editor().addEventListener('keyup', KeyUp)
editor().addEventListener('scroll', scrollSync)
editor().addEventListener('focus', scrollSync)
editor().addEventListener('blur', HandleSizes)
editor().addEventListener('click', onClick)
 
  ////////////////////
 /// EDITOR TOOLS ///
////////////////////
$('#undo').addEventListener('click',(e)=>{
	history_log.undo(KEY)
})
$('#redo').addEventListener('click',(e)=>{
	history_log.redo(KEY)
})

  //////////////////////
 /// DATA'S RELATED ///
//////////////////////

$('#file-open').addEventListener('change', openFile, false);
$('#new').addEventListener('click',()=>{ 
	selected = null
	act_KEY ='save';
 	modal_confirm()
 })
$('#remove').addEventListener('click',()=>{ 
	act_KEY ='delete-all';
 	modal_confirm()
 })
$('#filemenu').addEventListener('click',()=> showFiles())
$('#close').addEventListener('click',()=>(dialog_visible) && showHideFiles())

  /////////////////////////
 /// HANDLE APPEARENCE ///
/////////////////////////
window.addEventListener('resize',HandleSizes())
const handlePositions =()=>{
	$('.tools').style.top = visualViewport.height - $('.tools').offsetHeight  + document.body.offsetTop - 5 + 'px';
}
function HandleSizes() {
	return () => {
		$('#files-container').style['height'] = visualViewport.height + 'px';
		($('.modal-parent'))&&($('.modal-parent').style.height =visualViewport.height + 'px');
		[download_btn,fileopen_btn].map(btn=>btn.addCalls())
		$('#fullEditor').style.height = visualViewport.height -45 +'px'
		handlePositions()
	};
}


// $('body').addEventListener('touchmove',(e)=>{
	
// })
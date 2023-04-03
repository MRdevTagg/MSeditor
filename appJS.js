window.addEventListener('load',updateEditor)
const scrolled = (input_)=> {
  const { scrollHeight, scrollTop, clientHeight } = input_;
  let reachEnd;
  Math.abs(scrollHeight - clientHeight - scrollTop) < 1 ? reachEnd = true : reachEnd = false;
  return reachEnd
}
///  the KEY: it's value will be retrived from editors[*] data-editor atrribute

let isVisible = false
// object to store the html, css, and js sources used to build content for preview iframe's srcdoc
const source = {
html : `<div>
<h1>CODE</h1>
</div>
<p class="demo-paragraph">HTML</p>
<p class="demo-paragraph">CSS</p>
<p class="demo-paragraph">JAVASCRIPT</p>
<button>button</button>
<input type="text"/>
<div id="box"></div>
`,
css : `body{
  font-family: sans;
  color:#4c6892;
  background:white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
div{
  text-align: center;
  font-family: monospace;
  display: flex;
  align-items: center;
  justify-content: center;
}
#box{
	display: none;
  position: absolute;
  padding: 10px;
  background: #033587;
  color: white;
  width: fit-content;
  height: fit-content;
  margin: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px #00000088;
}`,
js : `/* DEMO hover on any Element to see it's tag name, class and/or id */
/**  
    1 - get all the elements on the DOM inside an array
    2 - get the #box element where we are going to display the info
    3 - map allTags array, then add a pointerenter litener to each element
    4 - stop propagation of event to avoid extra calls
    5 - destructure the needed properties from event target
    6 - if the element under pointer is the #box go back
    7 - create a function that will return the template with the info
        7-1 - create an empty string as a let
        7-2 - create const that contains an object storing the attributes we want to display
        7-3 - iterate over the object using a for in loop  
        7-4 - if the attribute exist for e.target and it has a value, then add the template to 
          the str variable we declared earlier
        7-5 - finally return the resulted string
    8 - style the #box based on element's position, width and height
    9 - render the template containing the resulted info into the #box
		That's All!! you can add any atrribute you want to monitor
**/
const allTags = Array.from(document.querySelectorAll('*')),
      box = document.querySelector('#box')  
allTags.map( tag =>{
  tag.addEventListener('pointerenter',(e)=>{
    e.stopPropagation()
    const { tagName, className, id , type , offsetTop, offsetLeft, offsetWidth } = e.target
    if(id =='box') return
    const idClass = () =>{
        let str = '';
        const attributes = {className,id,type}
        for(const key in attributes){
          (attributes[key] && attributes[key].length >=1) && (str += ${'` ${key}= "${attributes[key]}"`'})
				}
        return str     
    }
    box.style.display = 'flex'
    box.style.top = offsetTop +'px'
    box.style.left = offsetLeft + offsetWidth / 2 - box.offsetWidth /2 +'px'
    box.innerHTML = ${"`&lt${tagName.toLowerCase()}${idClass()!=='' ? ' '+idClass():''}>`"};
    return false
  })
  tag.addEventListener('pointerleave',(e)=>{ 
		box.style.display = 'none'
	})
})`,
}

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

/// all editor keys
const keys = ['html','css','js']
/// History object
const history_log = new HistoryRecord()
// returns an object that contains current line and column indexes of current caret position
const LC = (index = null)=>{
	if(editor()){
	
		const currentLine = editor().value.substr(0, editor().selectionStart).split("\n");
		const currentLineNumber = currentLine.length;
		const currentColumnIndex = currentLine[currentLine.length-1].length+1;
     return{
			lines:editor().value.split("\n"),
			characters:editor().value.split(""), 
			line:currentLineNumber,
     	col:currentColumnIndex,
			lineContent:editor().value.split("\n")[index || currentLineNumber -1]
		}
		}
  }
/// returns a template string with a span showing current line and column at caret position
const show_lines_and_cols = ()=>`<span>LINE :</span>  ${LC().line}<span>COL :</span>  ${LC().col}`;


///// EDITOR ////

/// KEY based object with strings with color hex
/// we will change colors based on KEY state (using KEY as object key eg.: KEYColors[KEY] )
const KEYColors ={html: '#ea9364',css:'#62a9d1',js:'#fed55a',preview:'#424242'}
/// updates the line numbers and displays into $('#lineNumbers') <pre> tag as a span element
 function linesDisplay() {
// if we are not in the preview iframe('cause it has no lines)
// Clear all previous line numbers to prevent duplication of the entire lines array 
// now iterate lines array and display each line index (plus 1 to avoid zero value)
// then displays it on $('#lineNumbers') <pre> tag
// finally display in linesandcols element current caret line and colum index
		if(KEY !== 'preview'){
 			$('#lineNumbers').innerHTML = ''
 			LC().lines.forEach((line,i)=>{
		  $('#lineNumbers').innerHTML += `<span width="35px">${i+1}</span>`})
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
  linesDisplay();
	keys.map(key => $(`#highlighting-${key}`).innerHTML = source[key].replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;"))
	KEY !== 'preview' && Prism.highlightElement($(`#highlighting-${KEY}`));
}
function onInput(e){
	updateSource();
	scrollSync();
	(e.keycode!== 13) &&	highlightLine()
	history_log.add(KEY);
}
// fixes bug that avoid display a new line in pre tag adding a space character
// to give body to the text, that way new lines will be displayed in both (eitor and pre tag)
function lastLineFix() {
	/// if thevlast character in current source equals a line break
	/// then add a space character into source to create the line in the code tag after updateEditor
	
		if ( source[KEY][source[KEY].length - 1] == "\n") {
		source[KEY] += " ";
	}
}
/// syncronize top an left of textarea and pre tags
function scrollSync(e) {
	$(`.pre${KEY}`).scrollTop = editor().scrollTop
	$(`.pre${KEY}`).scrollLeft = editor().scrollLeft
	$(`#lineNumbers`).scrollTop = editor().scrollTop
	highlightLine()
	
	      
	// added this line to handle mobile issue that occurs when the virtual keyboard is displayed the problem is that when user reaches the end of scroll, if he keeps scrolling, the entire page will scroll, displaying undesired empty content and scroll allong with it all fixed positioned elements, so the layout remains totally broken. To fix this, i'll first detect when current editor reaches the end of it's inner content (end of scroll). then i will gonna set scrolled bool i crated earlier to true or false to detect that situation. later on window touchmove event i will use this value to avoid this issue.

	        
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
	keydown_col_index = LC().col;
	selection = editor().value.slice(e.target.selectionStart, e.target.selectionEnd)
	if(e.key == "Tab"){
		e.preventDefault()
		writeText('  ')
	} 	
}

function KeyUp(e){
	// 1 - create an array containing all e.keycodes that we want to deny called denied_keys.  
	//   then filter this array to get a new one with only the value that matches the e.keycode
	// 2 - now we check if the filtered array length is equal to zero,
	//   cause' it means that the current e.keycode is not in the denied_keys list
	//   and also check if column index at keyup (now) is greater than colum index at keydown,
	//   that way we ensure that the last key was not left arrow key or backspace and
	//   that user's are actually typing a word
	// 3 - if that's true, we store the last character typed
	// 4 - then we create an object that will contain {last_character : character_to_complete}, 
	//   so we can handle all cases working with these key/value pairs instead of using a switch statement or something like that
	// 5 - then we loop over the object key and value pairs using for in 
	// 6 - if the last character matches a key from the object we write it's corresponding value 
	//   and position the caret before end using writeText() method
	// 7 - finally we create current_word for autocomplete_list
	highlightLine()
	scrollSync()
	const denied_keys = [16,17,18,37,38,39,40].filter(key => key == e.keyCode)
	 if(denied_keys.length == 0 && keydown_col_index < LC().col){
		const last = lastChar(e)
		const completechars = {'{':'}' , '(':')' , '[':']' , '"':'"' , "`":"`" , "\'":"\'" }
		for (const key in completechars) {
		(last == key) && writeText(completechars[key],-1)
	}
	createCurrentWordforAutocomplete(e)
} 
}


/// update textareas editors if there are changes on html,css,js sources that didn't come from user sirect typing. on load or delete, filoOpen,etc
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
const past_KEY = KEY;
KEY = codeTabs[i].dataset.editor;

UpdateUI(past_KEY);
updateSource()
});
}
function UpdateUI(past_KEY) {
	// if autocomplete list is displayed then remove it
  $('.autocomplete_list')?.remove()

	if (past_KEY !== KEY) {
	/// now we change the colors on all ui items that need it with the following function
	/// if we're on preview iframe remove editor options, linenumbers and col numbers
		changeColors(KEYColors);
		if (KEY === 'preview') {
			$('#viewedit').srcdoc = content()
			download_btn.remove$();
			fileopen_btn.remove$();
			$('.editing').innerHTML = 'VIEW';
		  ['.current-file', '#lineNumbers', '#linesandcols', '#editing-tools', '#arrows-tools',].map( el => $(el).style.display = 'none')

		}
	/// else 	
		else {			
			linesDisplay();
			download_btn.show(0);
			fileopen_btn.show(0);
			$('#file-open').setAttribute('accept', `${KEY == 'js' ? 'text/javascript' :`text/${KEY}`}`);
		  ['.current-file', '#lineNumbers', '#linesandcols', '#editing-tools', '#arrows-tools',].map( el => $(el).style.display = 'flex')
			$('.editing').innerHTML = KEY.toUpperCase();
			editor()?.focus()
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

function showMenu(){
  data = getData('data')
	createFiles();
	(!isVisible) && showHideMenu()
}
function addFileContent(file) {
			return `<div class="file-id">
			<p>${Number(file.fileId) + 1}</p>
			</div>
			<div class="file-name">
			<p>${file.fileName}</p>
			</div>
			<div class="file-date"><p>${
				file.dateyear ? file.dateyear:''}<br>${file.datehours ? file.datehours : ''}</p>
			<div>`;
}
function fileListener() {
	arr('.file').forEach((file) => {
		file.addEventListener('mousemove', () => {
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
function showHideMenu(ms = 800) {
	$('#menu-container').style.transition = `all ${ms}ms`
	$('.file-manage').style.transition = `all ${ms}ms`


	if(!isVisible){ 
		$('#menu-container').style.display = 'flex'
			setTimeout(()=>{
				$('#menu-container').style.opacity = 1
				$('.file-manage').style.transform = 'translateX(0)'
  			isVisible = true
			},10)}
	else{
		$('.file-manage').style.transform = 'translateX(-100%)'


		$('#menu-container').style.opacity = 0
			setTimeout(()=>{
			$('#menu-container').style.display = 'none'
			isVisible = false
		},ms)

	}
}

//// ACTION HANDLING ////


function actionPerform(){
	
	Action()[act_KEY]();
	(!act_KEY.includes('delete')) && 
	($('.filename').innerHTML = `"${current_file?.name}"` || 'Nuevo Archivo')
	create_action_log()
	actionFinish();

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
keys.map(key =>{
	const edtr = $(`#${key}edit`);
edtr.addEventListener('input', onInput);
edtr.addEventListener('keydown', KeyDown)
edtr.addEventListener('keyup', KeyUp)
edtr.addEventListener('scroll', scrollSync)
edtr.addEventListener('focus', scrollSync)
edtr.addEventListener('blur', HandleSizes)
edtr.addEventListener('click', onClick)
edtr.addEventListener('touchmove', scrollSync)
}) 

  ////////////////////
 /// EDITOR TOOLS ///
////////////////////

$('#undo').addEventListener('click',(e)=>{
	history_log.undo(KEY)
	
	highlightLine()
})
$('#redo').addEventListener('click',(e)=>{
	history_log.redo(KEY)
		
highlightLine()
})



  //////////////////////
 /// DATA'S RELATED ///
//////////////////////

$('#file-open').addEventListener('change', openFile, false);
$('#createnew').addEventListener('click',()=>{ 
	selected = null
	act_KEY ='save';
 	modal_confirm()
 })
$('#removeall').addEventListener('click',()=>{ 
	act_KEY ='delete-all';
 	modal_confirm()
 })
$('#filemenu').addEventListener('click',()=> showMenu())
$('#close').addEventListener('click',()=>(isVisible) && showHideMenu())

  /////////////////////////
 /// HANDLE APPEARENCE ///
/////////////////////////
window.addEventListener('resize',HandleSizes())
const handlePositions =()=>{
	$('.tools').style.top = visualViewport.height - $('.tools').offsetHeight - $('#fullEditor').offsetTop - 5 + 'px';
}
function HandleSizes() {
	return () => {
		$('#menu-container').style['height'] = visualViewport.height + 'px';
		($('.modal-parent'))&&($('.modal-parent').style.height =visualViewport.height + 'px');
		[download_btn,fileopen_btn].map(btn=>btn.addCalls())
		
		$('main').style.height = window.innerHeight +'px'
		$('#fullEditor').style.height = visualViewport.height -45 +'px'
		
	handlePositions()
	};
}



$('#fullEditor').addEventListener('click',(e)=>editor().focus())
let start;
window.addEventListener('touchstart',(e)=>{
  start = e.touches[0].pageY
  })
	///PRevent scrolling while virtual keyboard shows up
window.addEventListener('touchmove',(e)=>{
  if ((!scrolled(editor()) && document.activeElement === $(`#${KEY}edit`)) || 
	( e.target.className === 'autocomplete_list_item' && !scrolled($('.autocomplete_list')) ) ){

// 		 arr('pre > *').map( (el,) =>{
// 			const { tagName, className} = el;

// 			if (top + 100 > 0 && top < visualViewport.height){
// 				const {top,height} =  el.getBoundingClientRect()
// 			el.style.display = 'inline-block'
// 			console.log(`element:${tagName}
// class:${className}
// scrollTop:${top}
// state: out`)
// 			}else{ el.style.display = 'none' 
// 			console.log(`element:${tagName}
// class:${className}
// scrollTop:${top}
// state: in`)}
// 		})
    return true
  }
 else{
  currentTouches = e.changedTouches[0].pageY
  if (start > currentTouches) {
     e.preventDefault()
     e.stopPropagation()
   }
    return false

  }
},{passive:false})
window.onbeforeunload = confirmExit;
function confirmExit() {
		return "Esta seguro?";
}
function changeFontSize(target){
	const value = Number(target.value)
	document.documentElement.style.setProperty('--editorFZ',`${value}px`);
	document.documentElement.style.setProperty('--editorLH',`${(value) + (value /2.5)}px`)
}
const tools = new Tools({parent:$('#fullEditor'), id:'arrows-tools'})
tools.create()

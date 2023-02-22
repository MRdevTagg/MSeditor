window.addEventListener('load',updateView)

let dialog_visible = false

let html = `<div>
  <h1>COMIENZA A ESCRIBIR CODIGO</h1>
</div>
<p>HTML</p>
<p>CSS</p>
<p>JAVASCRIPT</p>
`;
let css = `body{
  color:#4c6892;
  background:white;
}`;
let js = `const h1 = document.querySelector('h1')
h1.addEventListener('click',()=> alert('funcionando'))
`;
const content = () => `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Output</title>
	<style>body{background:white}</style>

	<style>${css}</style>
</head>
<body>
${html}
	<script>${js}</script>
</body>
</html>
`;
let data;
let action = 'save';
let selected = null;



///// EDITOR ////

let btn_selectEditor = [$('#htmldwn'), $('#cssdwn'), $('#jsdwn'), $('#preview')]
let editors = [$('.html'), $('.css'), $('.js'), $('.preview')]
let view = 'html'
const editorColors ={html: '#ea9364',css:'#62a9d1fc',js:'#fed55a',preview:'#424242'}



function updatePreviewDocument(){

	html = document.querySelector('#htmledit').value
	js = document.querySelector('#jsedit').value
	css = document.querySelector('#cssedit').value
	
	mergeTextareaAndCodeTag();
  newLineFix([html,css,js]);
	$('#html').srcdoc = content()


}
function mergeTextareaAndCodeTag() {
	$('#highlighting-css').innerHTML = css.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
	$('#highlighting-js').innerHTML = js.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
	$('#highlighting-html').innerHTML = html.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
	Prism.highlightElement($('#highlighting-html'));
	Prism.highlightElement($('#highlighting-css'));
	Prism.highlightElement($('#highlighting-js'));
}
function newLineFix(languages) {
	languages.forEach((language)=>{
		if (language[language.length - 1] == "\n") {
		language += " ";
	}
	})

}


function scrollSync(e,i) {
	  
		let preCode = arrayFrom('pre')
		
		preCode[i].scrollTop = e.target.scrollTop;
		//preCode[i].scrollLeft = e.target.scrollLeft;
}
function tabHandler(e){
 	textarea = e.target

 	if(e.key == "Tab" || e.keyCode == 13) {
 		 
 		e.key == "Tab" && e.preventDefault();
 		 setTimeout(()=>{
			textarea.setRangeText( '  ',
       textarea.selectionStart,
       textarea.selectionStart,
       'end'
     )
		 updatePreviewDocument()},10)

   }
	
}
function updateView() {
  updateEditor()
  updatePreviewDocument()
}
function updateEditor() {
	$('#htmledit').value = html;
 	$('#cssedit').value = css;
	$('#jsedit').value = js;
 }


 //// 	editor ui ////

function switchEditor(btn, i) {
	btn.addEventListener('click', () => {
		editors.forEach((ed) => ed.style.display = 'none');
		editors[i].style.display = 'flex';
		let past_view = view;
		view = editors[i].dataset.editor;
		$('#file-open').setAttribute('accept',filetypes[view])
		if(past_view !== view){
			view !== 'preview'?
			$('.editing').innerHTML = view.toUpperCase():
			$('.editing').innerHTML = 'VIEW'

			changePreviewColor();
			if(view === 'preview'){
				download_btn.hide(200, { opacity: 0 }, false);
				fileopen_btn.hide(200, { opacity: 0 }, false);
			}
			snippets_btn_container.hide(200, { opacity: 0 }) ;
			setTimeout(()=>{
	  		if (view !== 'preview') {
					 download_btn.show(200);
					 fileopen_btn.show(200);
				}
	  		snippets[view] && createSnippets(snippets[view])
			},200)
}
	})
	;
}
function changePreviewColor(colors = editorColors) {
	for (const editr in colors) {
	let color = colors[editr]
		if (view == editr) {
		$('.editing').style.border ='2px solid'+ color;

		view !== 'preview' ?
		$('.editing').style.color = color:
		$('.editing').style.color = 'white';
		}
	}


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
	data.push(newdata)
	
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
	updateView()
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
			console.log(loaded_file.type)		
		if (loaded_file) {
			let reader = new FileReader();
			reader.onload = (e)=> {
				let contents = e.target.result;
				fileUpload()[view](contents)
				updateView()
				create_action_log(`<p>El Archivo: <span style="color:blue;font-weight:700">${loaded_file.name}</span> ha sido Cargado con éxito</p>`)
			}
			reader.readAsText(loaded_file);
		} else {create_action_log('<p>Error abriendo el archivo</p>')}
			}
					
	document.getElementById('file-open').addEventListener('change', openFile, false);

////// end DATA MANAGMENT /////





////// UI/VIEW //////


function showDialog(){
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
				file.dateyear ? file.dateyear:''}<br>${file.datehours ? file.datehours:''}</p>
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
	($('#filename').textContent = `Editando: ----- ${selected?.dataset.name}`)
	
}
function actionFinish() {

	updateFiles()
	updateView()
	confirm_dialog.hide(700);
	selected && showHideMenu();
	
}








	
	

////// end UI/VIEW //////


///// MAIN APP ///////
changePreviewColor();
$('.editing').innerHTML = view.toUpperCase()
$('main').style['height'] = window.innerHeight + 'px';
$('#dialog').style['height'] = window.innerHeight + 'px';
$('#editor').style.marginTop = $('header').clientHeight + 'px';
window.addEventListener('resize',HandleSizes())
// $('header').style['width'] = window.innerWidth-15+'px'


///// end MAIN APP ///////

	


////// EVENTS ///////
		////  Editor EVS
arrayFrom('textarea').forEach((txt,i)=> {
	txt.addEventListener('input',updatePreviewDocument);
	txt.addEventListener('keydown',	e=>tabHandler(e,i))
	txt.addEventListener('scroll',	e=>scrollSync(e,i))
})
$('#editor').addEventListener('click',()=>(dialog_visible) && showHideMenu())
		////  Header EVS
btn_selectEditor.forEach((btn,i) => {
	switchEditor(btn, i);})

	//// Menu EVS
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
$('#filemenu').addEventListener('click',()=> showDialog())
$('#close').addEventListener('click',()=>(dialog_visible) && showHideMenu())








function HandleSizes() {
	return () => {
		$('main').style['height'] = window.innerHeight + 'px';
		$('#dialog').style['height'] = window.innerHeight + 'px';
		$('#editor').style.marginTop = $('header').clientHeight + 'px';
		snippets_btn_container.$.setAttribute('style',`top : ${$('.lang').offsetTop += 5}px; left:${$('.lang').offsetLeft += 5}px;`)
download_btn.addCalls()
fileopen_btn.addCalls()
	};
}


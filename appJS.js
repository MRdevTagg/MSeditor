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
let data;
let action;
let selected = null;
let content = () => `
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


///// EDITOR ////

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

function updateEditor() {
	$('#htmledit').value = html
 	$('#cssedit').value = css
$('#jsedit').value = js
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
  	updateConfirmMessage(newdata)
}
function load(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	id = selected.dataset.id
	
	html = data[id].html
	css = data[id].css
	js = data[id].js

	
	updateConfirmMessage(data[id])
}


function removeAlldata(){
  window.localStorage.removeItem('data')
  data = JSON.parse(window.localStorage.getItem('data')) || []

	updateFiles()
  message_confirm('Todos los archivos han sido Eliminados')


}
function removeItem(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	id = selected.dataset.id
	
		data.splice(id,1)
		updateDataIndex();

		
	  updateConfirmMessage(selected.dataset);
	  (selected) && (selected = null);
}
function updateDataIndex() {
	data.forEach((file, i) => file.fileId = i);
	window.localStorage.setItem('data', JSON.stringify(data));
}
function download(src, filename,type){
  var blob = new Blob([src], {type: type});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url)
}

////// end DATA MANAGMENT /////





////// UI/VIEW //////

let btn_selectEditor = [$('#htmldwn'), $('#cssdwn'), $('#jsdwn'), $('#preview')]
let editors = [$('.html'), $('.css'), $('.js'), $('.preview')]
let editorSelected = 'html'
const editorColors ={'html': '#ea9364','css':'#62a9d1fc','js':'#fed55a','preview':'#222222'}
const action_ = {
	'save':{
		content :'GUARDAR',
		message : ''
		},
	'load':{
		content:'ABRIR'
	},
	'delete':{
		content:'ELIMINAR'
	},
	'delete-all':{
		content:'ELIMINAR TODO'
	}
}

function showDialog(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	updateViewAfterActionChanges();
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
	//// ADD LISTENER TO FILE OnSelect //////
	arrayFrom('.file').forEach((file)=> {
		file.addEventListener('click',()=>{
			all_btns.state.added && all_btns.remove$()
			if (selected !== null) {
				selected.classList.remove('selected');
				
			}
			file.classList.add('selected');
			selected = file;
			all_btns.state.visible = true
			all_btns.create(file)
		
			dialog_message.callbacks[0]();
		
			$('#name') && ($('#name').value = file.dataset.name);
		})
	})

}
function updateViewAfterActionChanges() {
confirm_dialog.childs.forEach(child => child.addCalls())
addTextinCaseOf(action_,$('#dialog h1'));
}

function addTextinCaseOf(cases = action_,affectedElement = $('#dialog h1')) {
	for (const case_ in cases) { 
		let change = cases[case_]
			if (action == case_) {
				affectedElement.textContent = change.content;
			}
		}

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
				file.dateyear !== undefined ? file.dateyear:''}<br>${file.datehours !== undefined ? file.datehours:''}</p>
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

function updateConfirmMessage(file){
	$('#filename').textContent = `Editando:  ${file.fileName}`
	switch (action) {
	  case 'save' :
	    selected ?
	    message_confirm(`
	    	El Archivo con el nombre: ”${file.fileName}”
	    	Actualizado con éxito el día ${file.dateyear} a las ${file.datehours}`) :
	    message_confirm(`
	    		El Archivo con el nombre: ”${file.fileName}”
	    		Creado con éxito el día ${file.dateyear} a las ${file.datehours}`)
	    break;
    case 'load':
      selected?
      message_confirm(`
      	El Archivo: ”${file.fileName}”
      	Cargado con éxito el ${file.dateyear} a las ${file.datehours}`):
      message_confirm(`Elige un archivo para Abrir`)
      break;
    case 'delete':
      selected?
      message_confirm(`
      	El Archivo: ”${file.name}”
      	ha sido eliminado el ${file.dateyear} a las ${file.datehours}`):
      	'Elige un archivo para Eliminar'
      break;
			case 'delete-all':
				message_confirm(`
					Se han eliminado todos los archivos`)
				break;
	}
	
}
function actionPerform(){

	switch (action) {
		case 'save': save(); break;
		case 'load': selected && load(); break;
		case 'delete': selected && removeItem(); break;
		case 'delete-all': removeAlldata(); break;
		default: break;
	}
	updateView()
	actionCancel();
	
}
function actionCancel() {
	confirm_dialog.showOrHide(700);
	updateFiles();
	(action !== 'save') && (selected = null);
	selected && showHideMenu();
}

function returnFileAndDownload() {
	
	switch (editorSelected) {
		case "html":
				download(html,'index','text/html')
				message_confirm('El archivo .html ha sido descargado')

			break;
			case "css":
				download(css,'style','text/css')
			message_confirm('El archivo .css ha sido descargado')

			break;
			case "js":
				download(js,'code','text/javascript')
				message_confirm('El archivo .js ha sido descargado')
			break;
		
		default:message_confirm('Elige un Archivo para descargar')
			break;
	}
	
}
function switchEditorView(btn, i) {
	btn.addEventListener('click', () => {
		editors.forEach((ed) => ed.style.display = 'none');
		editors[i].style.display = 'flex';
		editorSelected = editors[i].dataset.editor
		$('.editing').innerHTML = editorSelected.toUpperCase();
		onEditorChange();
	});
}
function onEditorChange(colors = editorColors) {
	for (const editr in colors) {
	let color = colors[editr]
		if (editorSelected == editr) {
		$('.editing').style.background = color;
		}
	}


	}
	
	

////// end UI/VIEW //////


///// MAIN APP ///////
onEditorChange();
$('main').style['height'] = window.innerHeight+'px'
$('#dialog').style['height'] = window.innerHeight+'px'
$('#editor').style.marginTop = $('header').clientHeight+'px'
$('.editing').innerHTML = editorSelected.toUpperCase()
$('header').style['width'] = window.innerWidth-15+'px'


///// end MAIN APP ///////

	


////// EVENTS ///////

arrayFrom('textarea').forEach((txt,i)=> {
	txt.addEventListener('input',updatePreviewDocument);
	txt.addEventListener('keydown',	e=>tabHandler(e,i))
	txt.addEventListener('scroll',	e=>scrollSync(e,i))
})


$('#new').addEventListener('click',()=>{ 
	selected = null
	action ='save';
 	updateViewAfterActionChanges() ; 
	confirm_dialog.show(700); 
	input_name.show(700,{opacity:1,transform:'scale(.9)'})
 })
// $('#load').addEventListener('click',()=>{ 
// 	action ='load';
// 	updateViewAfterActionChanges();	
// 	confirm_dialog.show(700)
// })
// $('#removeItem').addEventListener('click',()=>{ 
// 	action ='delete';
// 	updateViewAfterActionChanges();
// 	 confirm_dialog.show(700)
// })

 $('#remove').addEventListener('click',()=>{ 
		action ='delete-all';
 	updateViewAfterActionChanges();	
 	confirm_dialog.show(700)
 })

$('#filemenu').addEventListener('click',()=> showDialog())
$('#close').addEventListener('click',()=>(dialog_visible) && showHideMenu())
$('#download').addEventListener('click',()=> returnFileAndDownload())



$('#editor').addEventListener('click',()=>(dialog_visible) && showHideMenu())

btn_selectEditor.forEach((btn,i) => {
	switchEditorView(btn, i);})



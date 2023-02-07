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

///// end EDITOR ////


////// DATA MANAGMENT /////

function save(){

	data = JSON.parse(window.localStorage.getItem('data')) || []
	fileName = String($('#name').value) || 'sin-nombre'
	fileId = selected ? selected.dataset.id : data.length
	let dateyear = formatDate(new Date()).year
	let datehours = formatDate(new Date()).hours
	
	newdata = {html,css,js,fileName,fileId,dateyear,datehours}
	selected ?
	data.splice(fileId,1,newdata) :
	data.push(newdata)
	
  window.localStorage.setItem('data',JSON.stringify(data))
	
	after_action_dialog.show(1000)
	after_action_dialog.$.innerHTML =  `
	El Archivo: ”${fileName}” 
	Guardado con éxito el día ${dateyear} a las ${datehours}`
}
function load(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	id = selected.dataset.id
	
	html = data[id].html
	css = data[id].css
	js = data[id].js

	
	updateView()
	
	$('#filename').textContent = `Editando:  ${data[id].fileName}`
	after_action_dialog.show(1000)
	after_action_dialog.$.innerHTML =  `
	El Archivo con el nombre: ”${data[id].fileName}” 
	Cargado con éxito el día ${data[id].dateyear} a las ${data[id].datehours}`
	
}
function removeAlldata(){
  window.localStorage.removeItem('data')
  data = JSON.parse(window.localStorage.getItem('data')) || []

	updateFiles()
}
function removeItem(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	id = selected.dataset.id
	
		after_action_dialog.show(1000)
		after_action_dialog.$.innerHTML =  `
		El Archivo: ”${data[id].fileName}” 
		Eliminado con éxito el día ${data[id].dateyear} a las ${data[id].datehours}`

		data.splice(id,1)
		updateDataIndex();
		showDialog()
	
	
	
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
const dialogHeaders = {save:'GUARDAR',load:'ABRIR',delete:'ELIMINAR',}

function showDialog(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	updateViewAfterActionChanges();
	updateFiles();
	(!dialog_visible) && showHide()
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
			if (selected !== null) {
				selected.classList.remove('selected');
			}
			file.classList.add('selected');
			selected = file;
			dialog_message.callbacks[0]();
		
			$('#name')
				&& ($('#name').value = file.dataset.name);
		})
	})

}
function updateViewAfterActionChanges() {
input_name.addCalls()
dialog_header.addCalls()
dialog_message.addCalls()
dialogHeadUpdateView();
}
function dialogHeadUpdateView() {
	for (const headers in dialogHeaders) {
		let content = dialogHeaders[headers]
			if (action == headers) {
				$('#dialog h1').textContent =` Elige el archivo que deseas ${content}`;
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

function showHide(ms = 500) {
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


function actionPerform(){

	switch (action) {
		case 'save': save(); break;
		case 'load': selected && load(); break;
		case 'delete':  removeItem(); break;
		default: break;
	}
	dialog.showOrHide(700);
	
	updateFiles()
	selected=null
	selected &&
	showHide()
	
}
function returnFileAndDownload() {
	
	switch (editorSelected) {
		case "html":
				download(html,'index','text/html')
			break;
			case "css":
				download(css,'style','text/css')
			break;
			case "js":
				download(js,'code','text/javascript')
			break;
		
		default:alert('Elige un Archivo para descargar')
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

function updateView(){
	updateEditor()
	updatePreviewDocument()
}
///// end MAIN APP ///////

	


////// EVENTS ///////

arrayFrom('textarea').forEach((txt,i)=> {
	txt.addEventListener('input',updatePreviewDocument);
	txt.addEventListener('keydown',	e=>tabHandler(e,i))
	txt.addEventListener('scroll',	e=>scrollSync(e,i))
})


$('#save').addEventListener('click',()=>{ 
	action ='save';updateViewAfterActionChanges() ; 
	dialog.show(700); 
	input_name.show(700,{opacity:1,transform:'scale(.9)'})
})
$('#load').addEventListener('click',()=>{ 
	action ='load';
	updateViewAfterActionChanges();	
	dialog.show(700)
})
$('#removeItem').addEventListener('click',()=>{ 
	action ='delete';
	updateViewAfterActionChanges();
	 dialog.show(700)
})

$('#remove').addEventListener('click',removeAlldata)

$('#new').addEventListener('click',()=> showDialog())
$('#close').addEventListener('click',()=>(dialog_visible) && showHide())
$('#download').addEventListener('click',()=> returnFileAndDownload())



$('#editor').addEventListener('click',()=>(dialog_visible) && showHide())

btn_selectEditor.forEach((btn,i) => {
	switchEditorView(btn, i);})



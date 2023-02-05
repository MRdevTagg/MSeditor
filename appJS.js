window.addEventListener('load',App)

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
let action = 'save';
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
	if(html[html.length-1] == "\n") {
    html += " ";
  }
	if(css[css.length-1] == "\n") {
    css += " ";
  }
	if(js[js.length-1] == "\n") {
    js += " ";
  }

	
	$('#highlighting-css').innerHTML = css.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
	$('#highlighting-js').innerHTML = js.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");	
	$('#highlighting-html').innerHTML = html.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
	Prism.highlightElement($('#highlighting-html'))
	Prism.highlightElement($('#highlighting-css'))
	Prism.highlightElement($('#highlighting-js'))


	$('#html').srcdoc = content()


}
function updateEditor() {
	$('#htmledit').value = html
	$('#cssedit').value = css
	$('#jsedit').value = js
}
function scrollSync(e,i) {
	  
		let preCode = a$('pre')
		
		preCode[i].scrollTop = e.target.scrollTop;
		//preCode[i].scrollLeft = e.target.scrollLeft;
}
function tabHandler(e){
 	textarea = e.target

 	if(e.key == "Tab" || e.keyCode == 13) {
 		 
 		e.key == "Tab" && e.preventDefault();
 		 setTimeout(()=>{textarea.setRangeText(
       '  ',
       textarea.selectionStart,
       textarea.selectionStart,
       'end'
     )},10)

   }
}

///// end EDITOR ////


////// DATA MANAGMENT /////

function save(){

	data = JSON.parse(window.localStorage.getItem('data')) || []
	fileName = String($('#name').value) || 'sin-nombre'
	fileId = selected !== null? selected.dataset.id : data.length
	let date = formatDate(new Date());
	newdata = {html,css,js,fileName,fileId,date}

	data.splice(fileId,1,newdata) 
	
  window.localStorage.setItem('data',JSON.stringify(data))
	console.table(data)
	console.log(`data name: ${fileName} id: ${fileId} saved on date ${date.year}`)
	showDialog()

}
function load(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	id = selected.dataset.id
	
	html = data[id].html
	css = data[id].css
	js = data[id].js

	
	App()
	console.table(data)
	
	//$('#name').value = data[item].itemKeys.itemName
	$('#filename').textContent = `Editando:  ${data[id].fileName}`

	showDialog()
	
}
function removeAlldata(){
  window.localStorage.removeItem('data')
  data = JSON.parse(window.localStorage.getItem('data')) || []

	renderFiles()
}
function removeItem(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	id = selected.dataset.id
	
		data.splice(id,1)
		updateDataIndex();
	
	
	console.log(id)
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

function showDialog(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	renderFilesHeader();
	renderFiles();
	(!dialog_visible) && showHide()
}
function renderFilesHeader() {
	dialog_message.callbacks[0]()
	switch (action) {
		case "save":
			$('#dialog h1').textContent = 'Elige el archivo que deseas GUARDAR';
			$('#name').style.display = 'flex';
			break;
		case "load":
			$('#dialog h1').textContent = 'Elige el archivo que deseas CARGAR';
			$('#name').style.display = 'none';
			break;
		case "delete":
			$('#dialog h1').textContent = 'Elige el archivo que deseas ELIMINAR';
			$('#name').style.display = 'none';
			break;
		default:
			$('#dialog h1').textContent = 'ARCHIVOS';
			break;
	}
}
function renderFiles() {
	$('#files').innerHTML = ``;
	data.forEach((file) => {
		if (file !== undefined) {
		
			itemSaved = document.createElement('div');
			itemSaved.classList.add('file');
			itemSaved.setAttribute('data-name',file.fileName)
			itemSaved.setAttribute('data-id',file.fileId)
			data.date !== undefined &&
			itemSaved.setAttribute('data-date',file.date)

			itemSaved.innerHTML = renderFileContent(file);
			
			
			$('#files').appendChild(itemSaved);
		
		}
	});
	//// ADD LISTENER TO FILE REPRESENTATION //////
	a$('.file').forEach((doc)=> {
	
		doc.addEventListener('click',()=>{ 
			if(selected!==null){
				selected.classList.remove('selected')
			}
			doc.classList.add('selected')
			selected = doc;
			$('#name').value = doc.dataset.name
			})
	})

}
function renderFileContent(file) {
			return `
			<div class="file-id-representation">
			<p>${Number(file.fileId) + 1}</p>
			</div>
			<div class="file-name-representation">
			<p>${file.fileName}</p>
			</div>
			<div class="file-date-representation"><p>${
				file.date!== undefined ? file.date.year:''}<br>${file.date !== undefined ? file.date.hours:''}</p>
			<div>
			`;
}

function showHide(element,ms = 500) {
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


function actionBtn(){

	switch (action) {
		case 'save':
			save()
			break;
			case 'load':
			(selected !== null) && load()
			break;
			case 'delete':
			(selected !== null) && removeItem()
			break;
		default:
			break;
	}
	renderFiles()
	selected=null
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
		editorSelectedUpdateView();
	});
}
function editorSelectedUpdateView() {
	if (editorSelected == 'html') {
		$('.editor-controls').style.background = '#ea9364';
		$('body').style.background = '#ea9364';

	}
	else if (editorSelected == 'css') {
		$('.editor-controls').style.background = '#62a9d1fc';
		$('body').style.background = '#62a9d1fc';

	}
	else if (editorSelected === 'preview') {
		$('.editor-controls').style.background = '#222222';
		$('body').style.background = '#222222';
	}
	else if (editorSelected === 'js') {
		$('.editor-controls').style.background = '#fed55a';
		$('body').style.background = '#fed55a';
	}
}

////// end UI/VIEW //////


///// MAIN APP ///////
editorSelectedUpdateView();
function App(){
	$('#editor').style.marginTop = $('header').clientHeight +10+'px'
	$('.editing').innerHTML = editorSelected.toUpperCase()
	updateEditor()
	updatePreviewDocument()

}
///// end MAIN APP ///////

	



////// EVENTS ///////

a$('textarea').forEach((txt,i)=> {
	txt.addEventListener('input',updatePreviewDocument);
	txt.addEventListener('keydown',	e=>tabHandler(e,i))
	txt.addEventListener('scroll',	e=>scrollSync(e,i))
})


$('#save').addEventListener('click',()=>{ action ='save';renderFilesHeader() })
$('#load').addEventListener('click',()=>{ action ='load';renderFilesHeader() })
$('#removeItem').addEventListener('click',()=>{ action ='delete';renderFilesHeader() })
$('#new').addEventListener('click',()=> showDialog())
$('#close').addEventListener('click',()=>(dialog_visible) && showHide())
$('#download').addEventListener('click',()=> returnFileAndDownload())


$('#remove').addEventListener('click',removeAlldata)
//$('#ok').addEventListener('click',actionBtn)
$('#editor').addEventListener('click',()=>(dialog_visible) && showHide())

btn_selectEditor.forEach((btn,i) => {
	switchEditorView(btn, i);})



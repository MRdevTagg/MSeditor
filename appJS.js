window.addEventListener('load',App)

let dialog_visible = false

let html = ``;
let css = ``;
let js = ``;
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


function updateEditor() {
	$('#htmledit').value = html
	$('#cssedit').value = css
	$('#jsedit').value = js

}

function newLineProblemFix(src) {
	if(src[src.length-1] == "\n") {
    src += " ";
  }
}

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

////DATA MANAGMENT/////




function save(){

	data = JSON.parse(window.localStorage.getItem('data')) || []
	fileName = String($('#name').value) || 'sin-nombre'
	fileId = selected !== null? selected.dataset.id : data.length
	
	newdata = {html,css,js,fileName,fileId}

	data.splice(fileId,1,newdata) 
	
  window.localStorage.setItem('data',JSON.stringify(data))
	console.table(data)
	console.log(`data name: ${fileName} id: ${fileId} saved`)
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

	createOptionsFromData()
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

function showDialog(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
switch (action) {
	case "save":
			$('#dialog h1').textContent = 'Elige el archivo que deseas GUARDAR'
			$('#name').style.display= 'flex'
		break;
	case "load":
			$('#dialog h1').textContent = 'Elige el archivo que deseas CARGAR'
			$('#name').style.display= 'none'
		break;
	case "delete":
			$('#dialog h1').textContent = 'Elige el archivo que deseas ELIMINAR'
			$('#name').style.display= 'none'	
		break;
	default:
			$('#dialog h1').textContent = 'ARCHIVOS'
		break;
}
	

	
	createOptionsFromData();

	(!dialog_visible) && showHide()
}

function createOptionsFromData() {
	$('#files').innerHTML = ``;
	data.forEach((file) => {
		if (file.fileId !== undefined) {
		
			itemSaved = document.createElement('div');
			itemSaved.classList.add('file');
			itemSaved.setAttribute('data-name',file.fileName)
			itemSaved.setAttribute('data-id',file.fileId)
			displayID = Number(file.fileId) +1
			itemSaved.innerHTML = `
			<div class="file-id-representation">
			<p>${displayID}</p>
			</div>
			<div class="file-name-representation">
			<p>${file.fileName}</p>
			</div>`

			$('#files').appendChild(itemSaved);
		}

	});
	a$('.file').forEach((doc)=> {
	
		doc.addEventListener('click',()=>{ 
			if(selected!==null){
				selected.classList.remove('selected')
			}
			doc.classList.add('selected')
			selected = doc;
			
			})
	})

}



function showHide(element,ms = 500) {
	$('#dialog').style.transition = `all ${ms}ms`

	if(!dialog_visible){ 
		
	$('#dialog').style.display = 'flex'
	setTimeout(()=>{
	$('#dialog').style.opacity = 1
dialog_visible = true
},100)}
	else{
		
		$('#dialog').style.opacity = 0
	setTimeout(()=>{
	$('#dialog').style.display = 'none'
dialog_visible = false
},ms)

	}
}




function scrollSync(e,i) {
	  
		let preCode = a$('pre')
		
		preCode[i].scrollTop = e.target.scrollTop;
		//preCode[i].scrollLeft = e.target.scrollLeft;
}
 function tabHandler(e,i){
 	textarea = e.target
	 let preCode = a$('pre')
 	if(e.key == "Tab") {
 		 e.preventDefault();
 		 textarea.setRangeText(
       '  ',
       textarea.selectionStart,
       textarea.selectionStart,
       'end'
     )
		 preCode[i].setRangeText(
			'   ',
			preCode[i].selectionStart,
			preCode[i].selectionStart,
			'end'
		)
		 
   }
 }
/*function tabHandler(e){
	let element = e.target
	let code = element.value
	if(e.key == "Tab") {
		e.preventDefault(); // stop normal
   let before_tab = code.slice(0, element.selectionStart); // text before tab
    let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
    let cursor_pos = element.selectionStart + 1; // where cursor moves after tab - moving forward by 1 char to after tab
   element.value = before_tab + "\t" + after_tab; // add tab char

   element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
     App()
  } }*/

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
	createOptionsFromData()
	selected=null
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
let windows = [$('#htmldwn'), $('#cssdwn'), $('#jsdwn'), $('#preview')]
let editors = [$('.html'), $('.css'), $('.js'), $('.preview')]
let editorSelected = 'html'
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

$('.editing').innerHTML = `<span>Editando:</span><br>${editorSelected.toUpperCase()}`
function App(){
	
	updateEditor()
	updatePreviewDocument()

}

	
a$('textarea').forEach((txt,i)=> {
	txt.addEventListener('input',updatePreviewDocument);
	txt.addEventListener('keydown',	e=>tabHandler(e,i))
	txt.addEventListener('scroll',	e=>scrollSync(e,i))

})

function switchEditor(i) {
	editors[i].style.display = 'flex'
}


console.log($('header').clientHeight)
$('#editor').style.marginTop = $('header').clientHeight +10+'px'

$('#save').addEventListener('click',()=>{ action ='save'; showDialog()})
$('#load').addEventListener('click',()=>{ action ='load'; showDialog()})
$('#removeItem').addEventListener('click',()=>{ action ='delete'; showDialog()})
$('#new').addEventListener('click',()=> showDialog())
$('#close').addEventListener('click',()=>(dialog_visible) && showHide())
$('#download').addEventListener('click',()=> returnFileAndDownload())


$('#remove').addEventListener('click',removeAlldata)
$('#ok').addEventListener('click',actionBtn)
$('#editor').addEventListener('click',()=>(dialog_visible) && showHide())




windows.forEach((w,i) => {
	
	w.addEventListener('click',()=>{
		editors.forEach((ed) => ed.style.display = 'none')
		switchEditor(i)
		editorSelected = String(editors[i].className).replace('lang ','')
		$('.editing').innerHTML = `<span>Vista:</span><br>${editorSelected.toUpperCase()}`
	})})

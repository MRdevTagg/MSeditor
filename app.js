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

function updatePreviewDocument(){
	
	html = document.querySelector('#htmledit').value
	js = document.querySelector('#jsedit').value
	css = document.querySelector('#cssedit').value
	$('#highlighting-css').innerHTML = css
	$('#highlighting-js').innerHTML = js	
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

	updateEditor()
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
			$('#dialog h1').textContent = 'Accion : GUARDAR'
			$('#name').style.display= 'flex'
		break;
	case "load":
			$('#dialog h1').textContent = 'Accion : CARGAR'
			$('#name').style.display= 'none'
		break;
	case "delete":
			$('#dialog h1').textContent = 'Accion : ELIMINAR'
			$('#name').style.display= 'none'	
		break;
	default:
			$('#dialog h1').textContent = 'Accion : ARCHIVOS'
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
			itemSaved.innerHTML = `<p>${displayID} -   ${file.fileName}</p>`

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
function keydown(e){
	textarea = e.target
	if(e.key == "Tab") {
		 e.preventDefault();
		 textarea.setRangeText(
      '  ',
      textarea.selectionStart,
      textarea.selectionStart,
      'end'
    )
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
	createOptionsFromData()
	selected=null
}
function download(text, filename,type){
  var blob = new Blob([text], {type: type});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url)
}
let windows = [$('#htmldwn'), $('#cssdwn'), $('#jsdwn'), $('#preview')]
let editors = [$('.html'), $('.css'), $('.js'), $('.if')]
let editorSelected = null

function App(){
updatePreviewDocument()}
a$('textarea').forEach((txt)=> {
	txt.addEventListener('input',updatePreviewDocument);
	txt.addEventListener('keydown',	e=>keydown(e))
})

function switchEditor(i) {
	editors[i].style.display = 'flex'
}


console.log($('header').clientHeight)
$('#editor').style.marginTop = $('header').clientHeight +10+'px'

$('#save').addEventListener('click',()=>{ action ='save'; showDialog()})
$('#load').addEventListener('click',()=>{ action ='load'; showDialog()})
$('#removeItem').addEventListener('click',()=>{ action ='delete'; showDialog()})
$('#new').addEventListener('click',()=> download(js,'index','text/javascript'))
$('#close').addEventListener('click',()=>(dialog_visible) && showHide())


$('#remove').addEventListener('click',removeAlldata)
$('#ok').addEventListener('click',actionBtn)
$('#editor').addEventListener('click',()=>(dialog_visible) && showHide())


// $('#htmldwn').addEventListener('click',()=> download(js,'index','text/html'))
// $('#cssdwn').addEventListener('click',()=> download(js,'style','text/css'))
// $('#jsdwn').addEventListener('click',()=> download(js,'code','text/javascript'))

windows.forEach((w,i) => {
	
	w.addEventListener('click',()=>{
		editors.forEach((ed) => ed.style.display = 'none')
		switchEditor(i)
	
	})})

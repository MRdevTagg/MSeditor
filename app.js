window.addEventListener('load',App)

let dialog_visible = false

let html = ``;
let css = ``;
let js = ``;
let data;
let action;
let selected = null;
let renderedFiles = []
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
	$('#html').srcdoc = content()

}

////DATA MANAGMENT/////




function save(){

	data = JSON.parse(window.localStorage.getItem('data')) || []
	fileName = String($('#name').value) || 'sin-nombre'
	fileId = selected !==null? selected.dataset.id : data.length
	
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
	$('#filename').textContent = data[id].fileName

	showDialog()
	
}
function removeAlldata(){
  window.localStorage.removeItem('data')
	console.table(data)
	console.log('all data removed')
	showDialog()
	
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
			$('#dialog h1').textContent = 'GUARDAR'
		break;
	case "load":
			$('#dialog h1').textContent = 'CARGAR'
		break;
	case "delete":
			$('#dialog h1').textContent = 'ELIMINAR'	
		break;
	default:
			$('#dialog h1').textContent = 'ARCHIVOS'
		break;
}
	$('#files').innerHTML = ``;

	
	createOptionsFromData();

	(!dialog_visible) && showHide()
}

function createOptionsFromData() {
	data.forEach((file) => {
		if (file.fileId !== undefined) {
		
			itemSaved = document.createElement('div');
			itemSaved.classList.add('file');
			itemSaved.setAttribute('data-name',file.fileName)
			itemSaved.setAttribute('data-id',file.fileId)
			itemSaved.textContent = file.fileName
			$('#files').appendChild(itemSaved);
		}

	});
	a$('#files .file').forEach((doc)=> {
	//	renderedFiles.push(doc)
		//doc.dataset.id = renderedFiles.length-1
		doc.addEventListener('click',()=>{ selected = doc ;console.log('file')})
	})
}

// RENDER FILE with select tag
// function createOptionsFromData() {
// 	data.forEach((file) => {
// 		if (file.itemKeys !== undefined) {
// 			itemSaved = document.createElement('option');
// 			itemSaved.textContent = file.itemKeys.itemName;
// 			itemSaved.value = file.itemKeys.item;
// 			$('#select').appendChild(itemSaved);
// 		}

// 	});
// }

// function removeEmptyOptionforSelectTag() {
// 	a$('option').forEach((op) => {
// 		(!op.value) && (op.style.display = 'none');
// 	});
// 	console.table(data);
// }


function showHide(ms = 500) {
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
	showHide()
	selected=null
}


function App(){
updatePreviewDocument()}
a$('textarea').forEach((txt)=> {
	txt.addEventListener('input',updatePreviewDocument);
	txt.addEventListener('keydown',	e=>keydown(e))
})



console.log($('header').clientHeight)
$('#editor').style.marginTop = $('header').clientHeight +10+'px'

$('#save').addEventListener('click',()=>{ action ='save'; showDialog()})
$('#load').addEventListener('click',()=>{ action ='load'; showDialog()})
$('#removeItem').addEventListener('click',()=>{ action ='delete'; showDialog()})
$('#new').addEventListener('click',()=>location.reload())
$('#close').addEventListener('click',()=>(dialog_visible) && showHide())

// $('#remove').addEventListener('click',)
$('#ok').addEventListener('click',actionBtn)
$('#editor').addEventListener('click',()=>(dialog_visible) && showHide())




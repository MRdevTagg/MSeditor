window.addEventListener('load',App)

let dialog_visible = false

let html = ``;
let css = ``;
let js = ``;

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
let data

function updateEditor() {
	$('#htmledit').value = html
	$('#cssedit').value = css
	$('#jsedit').value = js
}

function update(){
	
	html = document.querySelector('#htmledit').value
	js = document.querySelector('#jsedit').value
	css = document.querySelector('#cssedit').value
	$('#html').srcdoc = content()

}

////DATA MANAGMENT/////



let action;
function save(){

	data = JSON.parse(window.localStorage.getItem('data')) || []
	itemName = String($('#name').value) || 'sin-nombre'
	item = $('#select').value === '+' ? data.length : $('#select').value
	itemKeys = {item,itemName}
	console.log(itemKeys)
	newdata = {html,css,js,itemKeys}

	
	data.splice(item,1,newdata) 
	
  window.localStorage.setItem('data',JSON.stringify(data))
	console.table(data)
	console.log(`data name: ${itemName} id: ${item} saved`)
	showDialog()

}
function load(){
	item = Number($('#dialog select').value)
	
  data = JSON.parse(window.localStorage.getItem('data')) || []
	
	html = data[item].html
	css = data[item].css
	js = data[item].js
	updateEditor()
	App()
	console.table(data)
	console.log('data loaded')
	$('#name').value = data[item].itemKeys.itemName
	$('#filename').textContent = data[item].itemKeys.itemName

	showDialog()
	
}
function removeAlldata(){
  window.localStorage.removeItem('data')
	load()
	console.table(data)
	console.log('all data removed')
	showDialog()
	
}

function removeItem(){
  data = JSON.parse(window.localStorage.getItem('data')) || []
	item = $('#select').value
	if(item !== '+') {
		data.splice(item,1)
		window.localStorage.setItem('data',JSON.stringify(data))
	}
	console.log(item)
	showDialog()
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
	$('#select').innerHTML = `
	<option value="+">+<option/>`

	
	createOptionsFromData();
	removeEmptyOptionforSelectTag();
	(!dialog_visible) && showHide()
}
function createOptionsFromData() {
	data.forEach((file) => {
		if (file.itemKeys !== undefined) {
			itemSaved = document.createElement('option');
			itemSaved.textContent = file.itemKeys.itemName;
			itemSaved.value = file.itemKeys.item;
			$('#select').appendChild(itemSaved);
		}

	});
}

function removeEmptyOptionforSelectTag() {
	a$('option').forEach((op) => {
		(!op.value) && (op.style.display = 'none');
	});
	console.table(data);
}


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
			load()
			break;
			case 'delete':
			removeItem()
			break;
		default:action = 'archivos'
			break;
	}
	showHide()
}


function App(){
update()
a$('textarea').forEach((txt)=> {
	txt.addEventListener('input',update);
	txt.addEventListener('keydown',	e=>keydown(e))
})



console.log($('header').clientHeight)
$('#editor').style.marginTop = $('header').clientHeight +10+'px'

$('#save').addEventListener('click',()=>{ action ='save'; showDialog()})
$('#load').addEventListener('click',()=>{ action ='load'; showDialog()})
$('#removeItem').addEventListener('click',()=>{ action ='delete'; showDialog()})
$('#new').addEventListener('click',()=>location.reload())
$('#close').addEventListener('click',()=>(dialog_visible) && showHide())

// $('#remove').addEventListener('click',removeAlldata)
$('#ok').addEventListener('click',actionBtn)
$('#editor').addEventListener('click',()=>(dialog_visible) && showHide())



}
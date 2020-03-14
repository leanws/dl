
var modalCSS = (function() {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));// WebKit hack :(
    document.head.appendChild(style);
    return style.sheet})();
// modalCSS.disabled=true;
modalCSS.insertRule("body>*:not(.clear),caption{filter:blur(2px) grayscale(50%)}",0); // blur it!

// пусть для начала будет размытость

function IDget(id){// часто используемая функция
    var r=document.getElementById(id);
    if(r===null)console.log('IDget did not find #'+id);
    return r}

function html(id,v){
    var DOM=IDget(id);
    return DOM? Boolean(DOM.innerHTML=v):false}
// the most common functions used EVERYWHERE that do not require ES6/end

var loads,onLoad=[],forEach1,map1;
window.onload = function(){onLoad.forEach(function(f){f()})}

function whenReady(IDs,f){
    if(IDs.map(function(x){return Boolean(IDget(x))}).reduce(function(x,y){return x&&y})){f()}
    else{onLoad.push(f)}}

var capability={"to":(function(){
    "use strict";
    if(typeof Symbol == "undefined") return false;
    try{ eval("var bar = (x) => x+1");
    }catch(e){return false}
    return true})()};


capability.promises=typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1;

const CDN='https://cdn.leanws.com/';
var Packages={'chat':{'name':'ochat.js', // used by load (see below) to store initialization data
		      'reqCapabilities':['SSE','WS'],
		      'preload':['KO','ochat.html','ochat.css']},
	      'LWS':{'name':'leanws.js','init':{'preloader':false}},
	      'WE':{'name':CDN+'fonts/we.css'},
	      'TimePicker':{'name':CDN+'jquery.timepicker.min.js'},
	      'validator':{'name':'https://cdnjs.cloudflare.com/ajax/libs/validator/11.1.0/validator.min.js'},
	      'md5':{'name':CDN+'md5.min.js'},
	      'cookie':{'name':'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.0/js.cookie.min.js'},
	      'AjaxMe':{'name':CDN+'ajaxme.js'},
// 'KO':{'name':'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.5.0/knockout-min.js'},
// 'KO':{'name':CDN+'knockout-latest.js'},
'KO':{'name':'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js'},
	      'MomentJS':{'name':CDN+'moment.min.js'},
	      // 'MomentRange':{'name':CDN+'moment-range.js'},
	      'DatePicker':{'name':CDN+'datepicker.js'},
	      'JQuery':{'name':CDN+'jquery.min.js'}};


if(!(capability.promises && capability["to"])){
    var el=IDget("message");
    el.innerHTML='Please use a newer browser for this website.';
    el.style.display='inline'}else{
	// the most common functions used EVERYWHERE that DO require ES6/begin
	// for compatibility with Android (v.7.1) browser:
	forEach1=(o,f)=>Array.from(o).forEach(x=>f(x));
	map1    =(o,f)=>Array.from(o).map(x=>f(x));
Packages.load=(function(){
    var loadedFiles={};
    function lowLevelLoad(fileName){
	if(fileName in loadedFiles)return loadedFiles[fileName];
	else return (loadedFiles[fileName]=new Promise(function(resolve,reject){
	    if(fileName.endsWith('.html')){
		var tagID=fileName.split('.html')[0];
		if(tagID)
		    Packages.load('AjaxMe').then(
			()=>window.AjaxMe.get(
			    {url:fileName,
			     success:r=>resolve(html(tagID,r.response)),
		       	     error:r=>reject(r)}));
		else reject(tagID)} // некуда вставлять этот html
	    else if(fileName.endsWith('.js')){
		var tag=document.createElement('script');
		tag.src=fileName; tag.async=true;
		tag.onload=()=>resolve(fileName); tag.onerror=()=>reject(fileName);
		var firstScriptTag=document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag,firstScriptTag)}
	    else if(fileName.endsWith('.css')){
		var tag=document.createElement('link');
		tag.type='text/css'; tag.rel='stylesheet'; tag.href=fileName;
		tag.onload=()=>resolve(fileName); tag.onerror=()=>reject(fileName);
		document.head.appendChild(tag)}
	    else{// some other file, e.g., JSON or TXT
		Packages.load('AjaxMe').then(
		    ()=>window.AjaxMe.get({url:fileName,
					  success:r=>resolve(r.response),
		       			  error:r=>reject(r)}))}}))}
    return function(){// main load function
	if(arguments.length>1) return Promise.all(Array.from(arguments).map(x=>Packages.load(x)));
	else{
	    var obj=arguments[0];
	    if(typeof obj=='string'){
		var PN=obj.endsWith('.js')? obj.split('.js')[0]: obj;
		if(PN in Packages){
		    var pobj=Packages[PN];
		    if(!('name' in pobj)) pobj.name=obj;
		    return Packages.load(pobj)}
		else return lowLevelLoad(obj)}
	    else if(typeof obj=='function') return new Promise(r=>r(obj()));// sometimes a function must be excecuted before or after loading a file.
	    else{// obj is either an array or an object {…}
		if(typeof obj=='object' && 0 in obj) // is an array, where every next element depends on previous ones
		    return obj.slice(1).reduce((x,y)=>x.then(()=>Packages.load(y)),Packages.load(obj[0]));
		else if('preload' in obj){
		    var dependences=obj.preload; delete obj.preload;
		    return Packages.load(dependences.concat(obj))}
		else if('postload' in obj){
		    var followers=obj.postload; delete obj.postload;
		    return Packages.load(obj).then(()=>load.apply(null,followers))}
		else if(obj.name in Packages){
		    var pobj=Packages[obj.name];
		    if(!pobj.init) pobj.init={};
		    pobj.init=Object.assign(pobj.init,obj.init); // копируем, не перезаписываем
		    return Packages.load(obj.name)}
		else return new Promise(function(resolve,reject){// we have an object
		    var PN=obj.name.split('.js')[0]; // напр., "login.js" → "login"
		    if('init' in obj){// параметры инициализации, которые передаются пакету
			if(!Packages[PN]) Packages[PN]={};
			if(!Packages[PN].init) Packages[PN].init={};
			Packages[PN].init=Object.assign(Packages[PN].init,obj.init)} // копируем, не перезаписываем (можно использовать занчения по умолчанию)
		    if(('reqCapabilities' in obj)
		       && !(obj.reqCapabilities.reduce((x,y)=>x && Boolean(capability[y]),true)))
			reject(obj.reqCapabilities);
		    lowLevelLoad(obj.name).then(a=>resolve(a),b=>reject(b))})}}}})();
// Примеры использования load:
// Packages.load("DatePicker","KO"); // паралельная загрузка
// Packages.load(["MomentJS","objects.js"]);  // последовательная загрузка
// Packages.load("KO",["MomentJS","objects.js"]);  // последовательная загрузка
// Пример: Packages.load("js-lib/validator.min.js", "js-lib/md5.min.js" ) .then(()=>{loaded=true});
	Packages.load('preloader.js').then(()=>Packages.preloader.show());// полезно даже на простых страницах в случае медленного соединения
	Packages.load('2.js');
	if(typeof localScripts!=='undefined') Packages.load.apply(null,localScripts)}


if(!('forms' in Packages)) Packages.forms={};
if(!('preload' in Packages.forms)) Packages.forms.preload=[];
Packages.forms.preload=Packages.forms.preload.concat(['footer.html','menu.html']);

Packages.load('WE','2.js','footer.html').then(()=>showClass("localFont"));

Packages.load('forms.js').then(()=>Packages.forms.subMenu());


SM=document.querySelectorAll("li.dropdown");

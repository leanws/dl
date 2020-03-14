// Time-stamp: <2019-07-18 20:21 EDT>

// Цель: поиск и активация форм (.form), в т.ч. для login.

// примеры загрузки:
// Packages.load({"name":"forms.js", "preload":["login.html","footer.html"]});
// Packages.load({"name":"forms.js", "preload":["login.html"],"init":{"onlyFor":["login"]}});
// "onlyFor" означает инициализацию (addEventListener) только для заданных ID.

// Но если не надо дожидаться загрузки внешних html, можно просто скомандовать Packages.load("forms.js");

if(!('forms' in Packages)) Packages.forms={};
Packages.forms.inputsEnabled=true;
if(!('inputs' in Packages.forms)) Packages.forms.inputs={};
if(!('enabled' in Packages.forms.inputs)) Packages.forms.inputs.enabled=true;

if(Packages.forms.init && Packages.forms.init.onlyFor)
    Packages.forms.DOM=
	'string'==typeof Packages.forms.init.onlyFor?
	document.getElementById(Packages.forms.init.onlyFor)
	:Packages.forms.init.onlyFor;
else Packages.forms.DOM=document;

// поиск и активация форм (.form), в т.ч. для login:
Packages.forms.inputs.all=Packages.forms.DOM.querySelectorAll('input');
Packages.forms.buttons   =Packages.forms.DOM.querySelectorAll('button');
Packages.forms.recentlySubmitted=false;

Packages.forms.inputs.enable=function(){
    if(!Packages.forms.inputs.enabled){
	Packages.forms.inputs.all.forEach(x=>x.disabled=false);
	Packages.forms.buttons   .forEach(x=>x.disabled=false);
    	Packages.forms.inputs.enabled=true}}
Packages.forms.inputs.disable=function(){
    if(Packages.forms.inputs.enabled){
	Packages.forms.inputs.all.forEach(x=>x.disabled=true);
	Packages.forms.buttons   .forEach(x=>x.disabled=true);
    	Packages.forms.inputs.enabled=false}}

// function latinOnly(inputString){return inputString.match(/^[a-zA-Z ]*$/)}// for validation
function ASCIIonly(inputString){return inputString.match(/^[\x33-\x7E]*$/)}// common validation

Packages.forms.submit=function(form){
    unhover([form.querySelector('button.submit')]);
    if(!Packages.forms.recentlySubmitted){
	Packages.forms.recentlySubmitted=true;
	setTimeout(()=>Packages.forms.recentlySubmitted=false,100);// to prevent double submition on ENTER
	var formData={},submit=true, success,
	inputs=form.querySelectorAll('input'), attrs={};
	['submitFun','cgi','rtype','extradata','onsuccess','onfailure','whendone'].forEach(x=>attrs[x]=form.getAttribute(x));
	inputs.forEach(function(reqInp){
	    var inpAttrs={};['name','preproc','test'].forEach(x=>inpAttrs[x]=reqInp.getAttribute(x));
	    formData[inpAttrs.name]=reqInp.value.trim();// I just cannot imagine a case when trimming would hurt
	    if(inpAttrs.preproc) reqInp.value=formData[inpAttrs.name]=eval(inpAttrs.preproc)(formData[inpAttrs.name]);
	    if(-1!=toArray(reqInp.classList).indexOf('required') && formData[inpAttrs.name]==''){
		submit=false; showInfo('Please specify<br>'+reqInp.getAttribute("descr").toUpperCase())}
	    else if(Boolean(inpAttrs.test) && !eval(inpAttrs.test)(formData[inpAttrs.name])){
		submit=false; showInfo('Invalid <br>'+reqInp.getAttribute("descr").toUpperCase()+'; please correct')}
	    if(inpAttrs.name=='password') Packages.load("md5").then(()=>formData[inpAttrs.name]=md5(formData[inpAttrs.name]))});
	if(submit){
	    closeModals(); Packages.preloader.show(); // ← важен порядок этих 2 команд
	    if(attrs.extradata) formData=Object.assign(formData,eval(attrs.extradata)(formData));
	    if(attrs.cgi){// таки можно отсылать данные на сервер
		function nachDem(response){
		    if(response['message'])showInfo(response['message']);
 		    if(response["success"]){
			inputs.forEach(x=>x.value=''); // в случае успеха очистить все input-поля
			if(attrs.onsuccess!==null)  eval(attrs.onsuccess)(response)}
		    else if(attrs.onfailure!==null) eval(attrs.onfailure)(response)}// использовать переменную response.errNo
		function endlich(){
		    if(attrs.whendone) eval(attrs.whendone)();
		    Packages.forms.inputs.enable()}
		Packages.forms.inputs.disable();
		Packages.load("AjaxMe").then(()=>{
		    if(attrs.rtype=="get") get1(attrs.cgi,formData).then(nachDem).finally(endlich);
		    else post(attrs.cgi,formData).then(nachDem).finally(endlich)})}
	    else if(attrs.submitFun)// call function instead of contacting the server
		eval(attrs.submitFun)(form)}}} // ← must call Packages.forms.inputs.enable(); и  Packages.preloader.hide();
// ← в случае успеха очистить все input-поля

Packages.forms.buttonsDone=[];
Packages.forms.buttonSetup=function(b){// 1. решить проблему с эмуляцией hover на планшетах
    Packages.forms.buttonsDone.push[b.id];// строки проще сравнивать
    b.onmouseenter = ()=>hover(b);// все кнопки формы, а не только submit
    b.onmouseleave = ()=>unhover([b]);
    b=>b.disabled=false};
    
Packages.forms.done=[];
Packages.forms.setup=function(DOM=Packages.forms.DOM){
    DOM.querySelectorAll('form.form,div.form').forEach(// можно сканировать законченный html на предмет форм
	function(form){
	    Packages.forms.done.push[form.id];// строки проще сравнивать
	    form.addEventListener("submit",e=>e.preventDefault());
	    var attrs={}; ['submitFun','cgi'].forEach(x=>attrs[x]=form.getAttribute(x));
	    if(Boolean(attrs.submitFun) || Boolean(attrs.cgi)){
		form.querySelector('button.submit') // such button must exist
		    .addEventListener('click', ()=> Packages.forms.submit(form));
		form.addEventListener("keydown",function(event){ // submit on enter
		    if(10==event.keyCode || 13==event.keyCode) Packages.forms.submit(form)})}
	    // forEach1(form.querySelectorAll("button"),Packages.forms.buttonSetup)})}
	    form.querySelectorAll('button').forEach(Packages.forms.buttonSetup)})}

// Packages.forms.HFdone=[];// внимание: возможно, hoverFix повторяет код из Packages.forms.setup !

Packages.forms.subMenu=(function(){// called on successfull login
    var SM=[];           // все эти извращения только из-за того, что Chrome
    return function(){  // вставляет hover на телефоне по тыканию пальцем
	SM=document.querySelectorAll("li.dropdown");
	SM.forEach(x=>x.addEventListener('mouseenter',()=>hover(x,200)));
	IDget("mainMenu").addEventListener('mouseleave',()=>unhover(SM,200))}})();

Packages.forms.setup();

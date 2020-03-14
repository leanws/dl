// Copyright (c) 2018 Lean Web Solutions https://leanws.com

// addr={'get':…,'webSocket':…,'SSE':…} ← не все поля обязательны
// onReceive={'webSocket':…,'SSE':…}
capability["WS"]="WebSocket" in window;
capability["SSE"]=Boolean(typeof(EventSource) !=="undefined");
capability['defaultArgs']=(function(){
"use strict";
try{eval("var bar=function(dayD={}){}")}catch(e){return false}
return true})();
capability.draganddrop='draggable' in document.body.querySelector('div');
function showInfo(mes,sec,bz){
if(sec===undefined)sec=5;
if(bz===undefined)bz=function(){};
html('message',mes);showID('message');
setTimeout(function(){hideID('message');bz()},sec*1000);
return mes}
function Achtung(mes){return showInfo(mes)}
var messageOnce=(function(){
var bm=[];
return function(mes){
if(-1==bm.indexOf(mes)){
bm.push(mes);
showInfo(mes)}}})();
var displayDB={};
function val(id,v){
if("undefined"==typeof v){return IDget(id).value}
else{IDget(id).value=v}}
function text(id,v){
if("undefined"==typeof v){return IDget(id).textContent}
else{IDget(id).textContent=v}}
function toArray(c){
if("undefined"===typeof c) return []
else return Array.from(c)}
function classText(className,v){
forEach1(document.getElementsByClassName(className),x=>x.textContent=v)}
function checked(id,v){IDget(id).checked=v}
function hideID(id){
var el=document.getElementById(id);
if(el){
var cur=el.style.display;
if(cur!='none' && !(id in displayDB)){displayDB[id]=cur}
el.style.display='none'}}
function showID(id,displayType='inline'){
var el=document.getElementById(id);
if(el){
if("undefined"!=typeof displayDB[id])
el.style.display=(id in displayDB)? displayDB[id]:displayType
else
el.style.display=displayType}}
function hideClass(cl){toArray(document.getElementsByClassName(cl)).forEach(function(el){el.style.display='none'})}
function showClass(cl,aa){
forEach1(document.getElementsByClassName(cl),
el=>el.style.display=
aa===undefined? 'inline':aa)}
function removeClasses(fSelector,classes){
toArray(document.querySelectorAll(fSelector)).forEach(
function(el){
classes.unshift(el);
classes.reduce((x,y)=>x.classList.remove(y))})}
var get=(function(){// test #1:z1=get('/zzz',3);test #2:z2=get('/cgi-bin/appt-hl',3)
const sleeps=[1,5,10,15,25,40,60];
return function(adres,nRetries=2){
var nthCall=0;
function sleep(){
let d=nthCall < sleeps.length ? sleeps[nthCall++]:sleeps[sleeps.length-1];
return new Promise(resolve=> setTimeout(resolve, 1000*d))}
function theGet(adres,nRetries){
return (new Promise(
(resolve,reject)=>Packages.load("AjaxMe").then(()=>
window.AjaxMe.get(
{url:adres,
success:r=>resolve(JSON.parse(r.response)),
error:function(r){
if(nRetries<=0) reject(r)
else
sleep().then(()=>thePost(adres,nRetries-1))}}))))}
return theGet(adres,nRetries)}})();
function get1(adres,params,nRetries=2){
let ps='';for(var c in params) ps+='&'+c+'='+params[c];
return get(adres + (ps==''? '':'?'+ps.slice(1)),nRetries)}
var post=(function(){// test #1:z1=post('/zzz',3);test #2:z2=post('/cgi-bin/appt-hl',3)
const sleeps=[1,5,10,15,25,40,60];
return function(adres,data,nRetries=2){
var nthCall=0;
function sleep(){
let d=nthCall < sleeps.length ? sleeps[nthCall++]:sleeps[sleeps.length-1];
return new Promise(resolve=> setTimeout(resolve, 1000*d))}
function thePost(adres,data,nRetries){
return (new Promise(
(resolve,reject)=>Packages.load("AjaxMe").then(
()=>window.AjaxMe.post(
{'url':adres, 'json':true, 'data':JSON.stringify(data),
'success':r=>resolve(JSON.parse(r.response)),
'error':function(r){
if(nRetries<=0) reject(r)
else
sleep().then(()=>thePost(adres,nRetries-1))}}))))}
return thePost(adres,data,nRetries)}})();
var recentlySwitched=false;

function hover(me,TO){
    if(!recentlySwitched){
	if(TO!==undefined && TO>0){
	    recentlySwitched=true;
	    setTimeout(function(){recentlySwitched=false},TO)}
	me.classList.add("hover");
	setTimeout(function(){unhover([me])},6000)}}

function unhover(mes,TO){
    if(mes instanceof HTMLCollection) mes=Array.from(mes);
    mes.forEach(me=>me.blur());
    if(!recentlySwitched){
	if(TO!==undefined&&TO>0){
	    recentlySwitched=true;
	    setTimeout(function(){recentlySwitched=false},TO)}
	mes.forEach(me=>me.classList.remove("hover"))}}

function switchHover(me){
if(me.firstElementChild) me.firstElementChild.blur();
var SMC=toArray(me.classList);
if(-1==SMC.indexOf('hover'))hover(me)
else unhover([me])}
function closeModals(){
unhover(toArray(document.getElementsByClassName("hover")));
toArray(document.getElementsByClassName("modal")).forEach(m=>m.style.display="none");
modalCSS.disabled=true}
function hideInfo(){hideID('message')}
function getURLParameter(name){
return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[null, ''])[1].replace(/\+/g, '%20'))||null;}
function last(arr){return arr[arr.length - 1]};

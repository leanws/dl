// Copyright (c) 2018 Lean Web Solutions https://leanws.com

(function(){
var preloaderWrapper=document.createElement('div');
preloaderWrapper.id='preloader';
preloaderWrapper.classList.add("clear");
document.body.insertBefore(preloaderWrapper, document.body.firstChild)})();
Packages.load('2.js').then(()=>displayDB.preloader='block');
Packages.load('2.js','WE','preloader.html','preloader.css').then(()=>showClass("localFont"));
if(!('preloader' in Packages)) Packages.preloader={};
Packages.preloader.show=function(){
modalCSS.disabled=false;
Packages.load('preloader.html').then(()=>showID('preloader'))};
Packages.preloader.hide=()=>Packages.load('preloader.html')
.then(()=>{
modalCSS.disabled=true;// hideID('message');
hideID('preloader')});

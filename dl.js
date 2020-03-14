
// if(!('forms' in Packages)) Packages.forms={};
// if(!('preload' in Packages.forms)) Packages.forms.preload=[];
// Packages.forms.preload=Packages.forms.preload.concat(['menu.html']);

Packages.load('WE','2.js').then(()=>showClass("localFont"));

Packages.load('menu.html').then(()=>{// called on successfull login
    var SM=[];
    SM=document.querySelectorAll("li.dropdown");
    SM.forEach(x=>x.addEventListener('mouseenter',()=>hover(x,200)));
    IDget("mainMenu").addEventListener('mouseleave',()=>unhover(SM,200))});

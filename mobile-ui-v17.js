/* v17: hide floating menu on downward scrolling or while typing, show on upward scrolling. */
(function(){
  'use strict';
  var lastY=window.scrollY||0;
  var ticking=false;
  function update(){
    ticking=false;
    if(window.innerWidth>719){document.body.classList.remove('rc17-scroll-down');return;}
    var y=window.scrollY||0,delta=y-lastY;
    if(y<90 || delta < -5) document.body.classList.remove('rc17-scroll-down');
    else if(y>135 && delta>6) document.body.classList.add('rc17-scroll-down');
    lastY=y;
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  document.addEventListener('focusin',function(e){
    if(e.target.matches('input,textarea,select,[contenteditable="true"]'))document.body.classList.add('rc17-keyboard-open');
  });
  document.addEventListener('focusout',function(e){
    if(e.target.matches('input,textarea,select,[contenteditable="true"]'))document.body.classList.remove('rc17-keyboard-open');
  });
  document.addEventListener('click',function(e){
    if(e.target.closest('#side .nv'))document.body.classList.remove('rc17-scroll-down');
  });
  window.addEventListener('hashchange',function(){document.body.classList.remove('rc17-scroll-down')});
})();

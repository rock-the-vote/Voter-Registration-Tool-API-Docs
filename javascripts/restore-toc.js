(function(){
  function slugify(text){
    return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-');
  }
  document.addEventListener('DOMContentLoaded',function(){
    var tocContainer=document.getElementById('toc');
    if(!tocContainer) return;
    // inject CSS to ensure sidebar links are visible on dark background
    var css = '.tocify-wrapper a, .tocify-wrapper .tocify-item>a, .tocify-wrapper .toc-footer a { color: #fff !important; text-decoration: none !important; } .tocify-wrapper a:visited { color: #fff !important; } .tocify-wrapper a:hover, .tocify-wrapper .tocify-item>a:hover, .tocify-wrapper .toc-footer a:hover { color: #fff !important; text-decoration: underline !important; }';
    try { var s = document.createElement('style'); s.appendChild(document.createTextNode(css)); document.head.appendChild(s); } catch(e) {}
    if(tocContainer.children.length>0) return;
    var content=document.querySelector('.content');
    if(!content) return;
    var headings=content.querySelectorAll('h1,h2');
    if(headings.length===0) return;

    var ul=document.createElement('ul'); ul.className='tocify';

    var currentLi=null;
    headings.forEach(function(h){
      var id=h.id || slugify(h.textContent);
      if(!h.id) h.id=id;
      var tag=h.tagName.toLowerCase();
      if(tag==='h1'){
        currentLi=document.createElement('li');
        currentLi.className='tocify-item tocify-h1';
        var a=document.createElement('a'); a.href='#'+id; a.textContent=h.textContent;
        a.addEventListener('click',function(){ var wrap=document.querySelector('.tocify-wrapper'); if(wrap) wrap.classList.remove('open'); var nb=document.getElementById('nav-button'); if(nb) nb.classList.remove('open'); });
        currentLi.appendChild(a);
        ul.appendChild(currentLi);
      } else if(tag==='h2'){
        if(!currentLi){
          currentLi=document.createElement('li');
          currentLi.className='tocify-item';
          ul.appendChild(currentLi);
        }
        var subUl=currentLi.querySelector('ul');
        if(!subUl){ subUl=document.createElement('ul'); subUl.className='tocify-subheader'; currentLi.appendChild(subUl); }
        var subLi=document.createElement('li'); subLi.className='tocify-item tocify-h2';
        var a=document.createElement('a'); a.href='#'+id; a.textContent=h.textContent;
        a.addEventListener('click',function(){ var wrap=document.querySelector('.tocify-wrapper'); if(wrap) wrap.classList.remove('open'); var nb=document.getElementById('nav-button'); if(nb) nb.classList.remove('open'); });
        subLi.appendChild(a);
        subUl.appendChild(subLi);
      }
    });

    tocContainer.appendChild(ul);

    // make h1 items toggle their sublists
    var topItems = tocContainer.querySelectorAll('.tocify-h1');
    topItems.forEach(function(li){
      var sub = li.querySelector('.tocify-subheader');
      if(sub){
        li.classList.add('has-sub');
        var a = li.querySelector('a');
        a.style.cursor='pointer';
        a.addEventListener('click', function(e){
          // only toggle when clicked on the label (prevent immediate navigate)
          // allow ctrl/cmd+click to open in new tab
          if (e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          var isOpen = li.classList.toggle('open');
          if(isOpen){ sub.style.display='block'; } else { sub.style.display='none'; }
        });
        // start closed
        sub.style.display='none';
      }
    });

    var navBtn=document.getElementById('nav-button');
    if(navBtn){ navBtn.addEventListener('click', function(e){ e.preventDefault(); var wrap=document.querySelector('.tocify-wrapper'); if(wrap) wrap.classList.toggle('open'); this.classList.toggle('open'); }); }
    var pageWrapper=document.querySelector('.page-wrapper');
    if(pageWrapper){ pageWrapper.addEventListener('click', function(){ var wrap=document.querySelector('.tocify-wrapper'); if(wrap) wrap.classList.remove('open'); if(navBtn) navBtn.classList.remove('open'); }); }
  });
})();

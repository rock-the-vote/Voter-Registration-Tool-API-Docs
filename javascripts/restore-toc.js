(function(){
  function slugify(text){
    return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-');
  }
  document.addEventListener('DOMContentLoaded',function(){
    var tocContainer=document.getElementById('toc');
    if(!tocContainer) return;
    if(tocContainer.children.length>0) return;
    var content=document.querySelector('.content');
    if(!content) return;
    var headings=content.querySelectorAll('h1,h2');
    if(headings.length===0) return;

    var ul=document.createElement('ul'); ul.className='tocify';
    headings.forEach(function(h){
      var id=h.id || slugify(h.textContent);
      if(!h.id) h.id=id;
      var li=document.createElement('li');
      li.className='tocify-item';
      // mark subheaders so styling aligns
      if(h.tagName.toLowerCase()==='h2') li.className += ' tocify-subheader';
      var a=document.createElement('a');
      a.href='#'+id;
      a.textContent = h.textContent;
      a.addEventListener('click', function(){ var wrap=document.querySelector('.tocify-wrapper'); if(wrap) wrap.classList.remove('open'); var nb=document.getElementById('nav-button'); if(nb) nb.classList.remove('open'); });
      li.appendChild(a);
      ul.appendChild(li);
    });

    tocContainer.appendChild(ul);

    var navBtn=document.getElementById('nav-button');
    if(navBtn){ navBtn.addEventListener('click', function(e){ e.preventDefault(); var wrap=document.querySelector('.tocify-wrapper'); if(wrap) wrap.classList.toggle('open'); this.classList.toggle('open'); }); }
    var pageWrapper=document.querySelector('.page-wrapper');
    if(pageWrapper){ pageWrapper.addEventListener('click', function(){ var wrap=document.querySelector('.tocify-wrapper'); if(wrap) wrap.classList.remove('open'); if(navBtn) navBtn.classList.remove('open'); }); }
  });
})();

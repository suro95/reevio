 /**
 * Created by aleksa on 2/19/16.
 */

 $("document").ready(function(){






$(".video-item:not(.loaded)").click(function(){
    var ytd=$(this).find('.load-youtube');
    var data=ytd.data('url');
    console.log($(this).width());
    $(this).addClass('loaded');
    ytd.replaceWith( create_youtube_frame(data,ytd.width(),ytd.height()) );
})






 })




function load_videojs(id,options,autoplay){
 if(!options)options={};
 videojs(id ,options, function(){
  if(autoplay)this.play()

 });




}




function create_youtube_frame(url,width,height){
    
    var div=document.createElement('div');
    div.setAttribute('class', 'embed-responsive embed-responsive-16by9');
    div.insertAdjacentHTML('afterbegin', '<iframe class="embed-responsive-item" src="'+url+'"></iframe>');
    
    
     return div;

}

/* new youtube player */

(function() {
    var v = document.getElementsByClassName("youtube-player");
    for (var n = 0; n < v.length; n++) {
        var p = document.createElement("div");
        p.setAttribute("class", "youtube-frame");
        p.innerHTML = labnolThumb(v[n].dataset.id);
        p.onclick = labnolIframe;
        v[n].appendChild(p);
    }
})();
 
function labnolThumb(id) {
                                                                                        // hq for 4by3 | mq for 16by9
    return '<img class="youtube-thumb img-responsive" src="//i.ytimg.com/vi/' + id + '/mqdefault.jpg"><div class="play-button"></div>';
}
 
function labnolIframe() {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", "//www.youtube.com/embed/" + this.parentNode.dataset.id + "?autoplay=1");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("class", "embed-responsive-item");
    iframe.setAttribute("id", "youtube-iframe");
    this.parentNode.replaceChild(iframe, this);
}



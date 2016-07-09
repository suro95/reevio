var imageEditor = Lollipop.setOptions({
   path: "..",
   appendTo: "body"
});
$("img").each(function() {
   $(this).css("cursor", "pointer");
   $(this).on("click", function(e) {
      imageEditor.open({
         image_url: e.target.src
      });
   });
});

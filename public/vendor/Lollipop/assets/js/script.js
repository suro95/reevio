/* RENDER FUNCTIONS BEGIN */

var canvasPos = function () {
    $("#new").css('max-height', $(window).height() - 192);
    $("#new").css('margin-top', -$("#new").height() / 2 - 4);
    $("#new").css('margin-left', -$("#new").width() / 2);
}

/* SHOW FUNCTIONS BEGIN */

function showFilters() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    saveCheckPoint();
    $(".setting").each(function () {
        $(this).hide();
    });
    $(".theme").each(function () {
        $(this).hide();
    });
    $("#filters").show();
    $('.setting').perfectScrollbar('update');
    $("#title").text("Filters");
    $("#new").swipe("enable");
    $('#undo').show();
    $("#check").hide();
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showPackage() {
    test = $("#package-icon").hasClass("active");
    if (test === false)
        saveCheckPoint();
    $("#package").toggle();
    $('.theme').perfectScrollbar('update');
    $("#title").text("Package");
    $(".list-item").on("mouseenter", function () {
        $(this).addClass("active");
    });
    $(".list-item").on("mouseleave", function () {
        $(this).removeClass("active");
    });
}

function showSettings() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    saveCheckPoint();
    $(".setting").each(function () {
        $(this).hide();
    });
    $(".theme").each(function () {
        $(this).hide();
    });
    $("#settings").show();
    $("#title").text("Settings");
    $("#back").hide();
    $('.setting').perfectScrollbar('update');
    $("#new").swipe("disable");
    initTempCanvas();
    $('#undo').show();
    $("#check").hide();
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showCSettings() {
    saveCheckPoint();
    $(".setting").each(function () {
        $(this).hide();
    });
    $(".theme").each(function () {
        $(this).hide();
    });
    $("#c-settings").show();
    $("#title").text("Camera");
    $("#c-back").hide();
    $('.setting').perfectScrollbar('update');
    $("#new").swipe("disable");
}

function showSaturation() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#saturation").show();
    $('.setting').perfectScrollbar('update');
    $("#title").text("Saturation");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showEffects() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#effects").show();
    $("#back").show();
    $('.setting').perfectScrollbar('update');
    $("#title").text("Effects");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showBrightness() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#brightness").show();
    $('.setting').perfectScrollbar('update');
    $("#title").text("Brightness");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);

}

function showContrast() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#contrast").show();
    $('.setting').perfectScrollbar('update');
    $("#title").text("Contrast");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showVignette() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#vignette").show();
    $("#title").text("Vignette");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showBlur() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#blur").show();
    $("#title").text("Blur");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showFlip() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#flip").show();
    $("#title").text("Flip");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showRotation() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#rotation").show();
    $("#title").text("Rotation");
    $('#undo').hide();
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showCrop() {
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#crop").show();
    $("#back").show();
    $('.setting').perfectScrollbar('update');
    $('#undo').hide();
    $("#title").text("Crop");
}

function showSharpen() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#sharpen").show();
    $("#title").text("Sharpen");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showFrames() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#frames").show();
    $('.setting').perfectScrollbar('update');
    $("#title").text("Frames");
    $("#back").show();
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showSpecial() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#special").show();
    $('.setting').perfectScrollbar('update');
    $("#title").text("Special");
    $("#back").show();
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showFrameBlur() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#frame-blur").show();
    $("#title").text("Frame Blur");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showRgb() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#rgb").show();
    $(".tab-footer a").css({
        "width": "20%",
        "display": "table-cell",
        "text-align": "center"
    });
    $("#check").show();
    $("#title").text("RGB");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}


function showNoise() {
    $('body').append('<div id="loader-wrapper" style="opacity: 0.8;z-index: 999999;"><div id="loader" style="" class="loader"></div><p style="visibility: visible; animation-duration: 2s; animation-iteration-count: 1000; animation-name: flash;" data-wow-duration="2s" data-wow-iteration="1000" class="wow flash strong animated">Loading...</p></div>');
    $(".setting").each(function () {
        $(this).hide();
    });
    $("#noise").show();
    $("#title").text("Noise");
    setTimeout(function(){
        $('#loader-wrapper').remove();
    },100);
}

function showEditor() {
    $(".interaction").show();
    $("#undo").show();
    $("#check").show();
    $("#export-btn").show();
    $("#refresh-btn").show();
    $("#camera-btn").show();
    $("#gallery-btn").show();
    $("#take").hide();
    $(".back").show();
    $("#c-back").hide();
    $("#back").hide();
    $("#filters").removeClass("toright");
    $("#filters-icon").trigger("click");
}

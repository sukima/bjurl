var Site = { data: [ ], size: 0, running: false, timmer: null, error_msg: "" };
Site.show_error = function() {
    if (Site.error_msg != "") {
        $("#error").html("<span class='error_msg'>"+Site.error_msg+"</span>").show();
    } else {
        $("#error").hide();
    }
    Site.error_msg = "";
};
Site.populate = function()  {
    var evenodd;
    var populated = false;
    if (!Site.running || Site.data.length < Site.size) {
        Site.clear();
    }
    Site.update = new Date();
    for (var i=Site.size; i < Site.data.length; i++)  {
        populated = true;
        evenodd = (i%2==0) ? "even" : "odd";
        $("<div class=\"url-item "+ evenodd +"\">"+
            "<div class=\"time\">"+ Site.data[i].time +"</div>"+
            "<span class=\"nick\">"+ Site.data[i].nick +":</span> "+
            "<span class=\"message\">"+ Site.data[i].message +"</span></div>")
            .hide()
            .css('opacity',0.0)
            .prependTo('#url-list')
            .slideDown('slow')
            .animate({opacity: 1.0});
    }
    if (populated) { $("#nodata").hide(); }
    Site.running = true;
    Site.size = Site.data.length;
    $("#update-time").text(new Date().toLocaleString());
    Site.show_error();
};
Site.continueCycle = function() {
    Site.timmer = setTimeout(Site.fetch, 30000); /* 30 seconds */
};
Site.success = function(d) {
    Site.data = d;
    Site.populate();
    Site.continueCycle();
};
Site.error = function(jqXHR, textStatus, errorThrown) {
    Site.error_msg = "There was an error loading update. Try again by refreshing the entire page. "+ errorThrown;
    Site.populate();
    Site.continueCycle();
};
Site.clear = function() {
    $(".url-item").remove();
    $("#nodata").css('opacity',0.0)
        .slideDown('slow')
        .animate({opacity: 1.0});
    return false;
};
Site.fetch = function()  {
    if (Site.timmer !== null) {
        clearTimeout(Site.timmer);
        Site.timmer = null;
    }
    $.ajax({
        url: "urls.json",
        dataType: 'json',
        cache: false,
        success: Site.success,
        error: Site.error
    });
    return false;
};

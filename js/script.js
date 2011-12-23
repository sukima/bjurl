var Site = { refresh: 30000, data: [ ], size: 0, running: false, timer: null, error_msg: "" };
Site.weblink = "http://sukima.github.com/bjurl/weblink.gif";
Site.show_error = function() {
    if (Site.error_msg != "") {
        $("#error").html("<span class='error_msg'>"+Site.error_msg+"</span>").show();
    } else {
        $("#error").hide();
    }
    Site.error_msg = "";
};
Site.notify = function(item) {
    if (!window.webkitNotifications) { return; }
    if (window.webkitNotifications.checkPermission() > 0) {
        window.webkitNotifications.requestPermission(Site.notify);
    } else {
        var popup = window.webkitNotifications.createNotification(Site.weblink, item.nick+" says:", item.message);
        popup.show();

        window.setTimeout(popup.cancel, 15000);
    }
}
Site.populate = function()  {
    var evenodd, item;
    var populated = false;
    if (!Site.running || Site.data.length < Site.size) {
        Site.clear();
    }
    Site.update = new Date();
    for (var i=Site.size; i < Site.data.length; i++)  {
        populated = true;
        evenodd = (i%2==0) ? "even" : "odd";
        item = $("<div class=\"url-item "+ evenodd +"\">"+
            "<div class=\"time\">"+ Site.data[i].time +"</div>"+
            "<span class=\"nick\">"+ Site.data[i].nick +":</span> "+
            "<span class=\"message\">"+ Site.data[i].message +"</span></div>")
            .hide()
            .css('opacity',0.0)
            .prependTo('#url-list')
            .slideDown('slow')
            .animate({opacity: 1.0});
        if (Site.running) { Site.notify(Site.data[i]); }
    }
    if (populated) { $("#nodata").hide(); }
    Site.running = true;
    Site.size = Site.data.length;
    $("#update-time").text(new Date().toLocaleString());
    Site.show_error();
};
Site.continueCycle = function() {
    Site.timer = setTimeout(Site.fetch, Site.refresh);
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
    if (Site.timer !== null) {
        clearTimeout(Site.timer);
        Site.timer = null;
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

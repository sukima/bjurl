var bjurlTest = { permsCheckReturn: 0 };
// Helper function buildData() {{{1
bjurlTest.buildData= function(textarray) {
    var d = [ ];
    if (!$.isArray(textarray)) { textarray = [ textarray ]; }
    for (var i=0; i < textarray.length; i++) {
        d.push({ time: "timestamp", nick: "nickname", message: textarray[i] });
    }
    return d;
};

// Mock for desktop notifications {{{1
bjurlTest.notifyObj = {
    show: function() { ok(true, "notification show called"); },
    cancel: function() { return; }
};

// Will not restore webkitNotifications. No need in test environment.
// bjurlTest.notify = window.webkitNotifications;
window.webkitNotifications = { };
window.webkitNotifications.prototype = {
    requestPermission: function(cb) { ok(true, "requestPermission called"); cb(); },
    checkPermission: function() { ok(true, "checkPermission called"); return bjurlTest.permsCheckReturn; },
    createNotification: function() { ok(true, "createNotification called"); return bjurlTest.notifyObj; },
    createHTMLNotification: function() { ok(true, "createHTMLNotification called"); return bjurlTest.notifyObj; }
};
// }}}1


$(document).ready(function(){
    var missing_libs = [ ];
    if (Site) {
        // Check that the main script is loaded
        // If so we no longer need the warning
        $("#testwarning").remove();
    } else { return; }
    if (typeof jQuery == 'undefined') { missing_libs.push({lib:"jQuery",url:"http://code.jquery.com/jquery-latest.js"}); }
    if (typeof QUnit == 'undefined') { missing_libs.push({lib:"Qunit",url:"http://code.jquery.com/qunit/git/qunit.js"}); }
    if (typeof sinon == 'undefined') { missing_libs.push({lib:"Sinon",url:"http://sinonjs.org/release/sinon-1.2.0.js"}); }
    if (missing_libs.length == 0) { $("#libwarning").remove(); }
    else {
        for (var i=0; i<missing_libs.length; i++) {
            $("#libs-list").append("<p><b>"+missing_libs[i].lib+"</b> - <span class=\"script-location\">"+missing_libs[i].url+"</span></p>");
        }
        return;
    }


    // Module show_error {{{1
    module("show_error", {
        setup: function() {
            this.err = $("<div/>",{id:"error"}).appendTo("#qunit-fixture");
        }
    });
    test("hides #error when error_msg is empty", function() {
        Site.error_msg = "";
        Site.show_error();
        ok(!this.err.is(":visible"), "#error is not visible");
    });
    test("Displays #error when error_msg is not empty", function() {
        Site.error_msg = "error_msg_test_string";
        Site.show_error();
        ok(this.err.is(":visible"), "#error is visible");
        equal(this.err.text(), "error_msg_test_string", "#error equals 'error_msg_test_string'");
        equal(Site.error_msg, "", "Site.error_msg was reset");
    });


    // Module populate {{{1
    module("populate", {
        setup: function() {
            this.update_time = $("<div/>",{id:"update-time"}).appendTo("#qunit-fixture");
            this.nodata = $("<div/>",{id:"nodata"}).appendTo("#qunit-fixture");
            this.url_list = $("<div/>",{id:"url-list"}).appendTo("#qunit-fixture");
            $.extend(Site, { data: [ ], size: 0, running: false, timer: null, error_msg: "" });
        },
        teardown: function() {
            $.extend(Site, { data: [ ], size: 0, running: false, timer: null, error_msg: "" });
        }
    });
    test("First time without data", function() {
        this.stub(Site,"show_error");
        this.stub(Site, "notify");
        Site.data = [ ];
        Site.populate();
        ok(Site.running, "Application is in running state");
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(this.nodata.is(":visible"), "#nodata is not hidden");
        ok($(".url-item").length == 0, "#url-list not populated");
        ok(Site.show_error.called, "show_error() called");
        ok(!Site.notify.called, "notify() not called");
    });
    test("First time with data", function() {
        this.stub(Site,"show_error");
        this.stub(Site, "notify");
        Site.data = bjurlTest.buildData("test");
        Site.populate();
        ok(Site.running, "Application is in running state");
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(!this.nodata.is(":visible"), "#nodata is hidden");
        ok($(".url-item").length == 1, "#url-list populated");
        ok(Site.show_error.called, "show_error() called");
        ok(!Site.notify.called, "notify() not called");
    });
    test("Running state without new data", function() {
        this.stub(Site,"show_error");
        this.stub(Site, "notify");
        Site.running = true;
        Site.populate();
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(this.nodata.is(":visible"), "#nodata is not hidden");
        ok($(".url-item").length == 0, "#url-list not populated");
        ok(Site.show_error.called, "show_error() called");
        ok(!Site.notify.called, "notify() not called");
    });
    test("Running state with new data", function() {
        this.stub(Site,"show_error");
        this.stub(Site, "notify");
        Site.data.push(bjurlTest.buildData("test"));
        Site.size = 0;
        Site.running = true;
        Site.populate();
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(!this.nodata.is(":visible"), "#nodata is hidden");
        ok($(".url-item").length == 1, "#url-list populated");
        ok(Site.show_error.called, "show_error() called");
        ok(Site.notify.called, "notify() called");
    });


    // Module timeout functions {{{1
    module("Timeout functions", {
        setup: function() {
            Site.refresh = 1;
        },
        teardown: function() {
            clearTimeout(Site.timer);
            Site.timer = null;
            Site.refresh = 30000;
        }
    });
    test("continueCycle", function() {
        this.stub(jQuery, "ajax", Site.success);
        this.stub(Site, "populate");
        Site.continueCycle();
        ok(Site.timer !== undefined, "Site.timer is not undefined");
        ok(Site.timer !== null, "Site.timer is not null");
        this.clock.tick(10);
        ok(jQuery.ajax.called, "ajax() called");
        ok(Site.populate.called, "populate() called");
    });
    test("success", function() {
        this.stub(Site, "populate");
        Site.success(bjurlTest.buildData(["test","test2"])); // Calls populate, continueCycle->fetch
        equal(Site.data.length, 2, "Site.data updated");
        ok(Site.populate.called, "populate() called");
    });
    test("error", function() {
        this.stub(Site, "populate");
        Site.error(null, null, "test error"); // Calls populate, continueCycle->fetch
        ok(Site.error_msg != "", "Site.error_msg populated");
        ok(Site.populate.called, "populate() called");
    });


    // Module clear {{{1
    module("clear", {
        setup: function() {
            this.item = $("<div/>", {class:"url-item"}).appendTo("#qunit-fixture");
            this.nodata = $("<div/>", {id:"nodata"}).appendTo("#qunit-fixture");
            this.nodata.hide();
        }
    });
    test("Clears the list of data", function() {
        var ret = Site.clear();
        ok(!ret, "Function returns false");
        ok($(".url-item").length == 0, "Item removed");
        ok(this.nodata.is(":visible"), "#nodata is visible");
    });


    // Module fetch
    module("fetch", {
        setup: function() {
            $.extend(Site, { data: [ ], size: 0, running:true, timer: "test_value", error_msg: "" });
        },
        teardown: function() {
            $.extend(Site, { data: [ ], size: 0, running: false, timer: null, error_msg: "" });
        }
    });
    test("Prepare and run AJAX fetch", function() {
        this.stub(jQuery, "ajax");
        var ret = Site.fetch();
        ok(Site.timer === null, "Resets Site.timer");
        ok(!ret, "Returns false");
        ok(jQuery.ajax.called, "$.ajax() called");
    });


    // Module desktop notifications {{{1
    module("Desktop Notifications", {
        setup: function() {
            this.data = bjurlTest.buildData("test");
        }
    });
    test("Without permission", function() {
        var notifyObj = { show: this.stub(), cancel: this.stub() };
        this.stub(window.webkitNotifications, "requestPermission");
        this.stub(window.webkitNotifications, "checkPermission");
        this.stub(window.webkitNotifications, "createNotification");
        this.stub(window.webkitNotifications, "createHTMLNotification");
        window.webkitNotifications.createNotification.returns(notifyObj);
        window.webkitNotifications.createHTMLNotification.returns(notifyObj);
        window.webkitNotifications.checkPermission.returns(1);
        Site.notify(this.data[0]);
        ok(window.webkitNotifications.checkPermission.called, "checkPermission called");
        ok(window.webkitNotifications.requestPermission.called, "requestPermission called");
        ok(window.webkitNotifications.checkPermission.calledBefore(window.webkitNotifications.requestPermission), "checkPermission called before requestPermission");
    });
    test("With permission", function() {
        var notifyObj = { show: this.stub(), cancel: this.stub() };
        this.stub(window.webkitNotifications, "requestPermission");
        this.stub(window.webkitNotifications, "checkPermission");
        this.stub(window.webkitNotifications, "createNotification");
        this.stub(window.webkitNotifications, "createHTMLNotification");
        window.webkitNotifications.createNotification.returns(notifyObj);
        window.webkitNotifications.createHTMLNotification.returns(notifyObj);
        window.webkitNotifications.checkPermission.returns(0);
        Site.notify(this.data[0]);
        ok(window.webkitNotifications.checkPermission.called, "checkPermission called");
        ok(!window.webkitNotifications.requestPermission.called, "requestPermission not called");
        ok(window.webkitNotifications.checkPermission.calledBefore(window.webkitNotifications.requestPermission), "checkPermission called before requestPermission");
        ok(window.webkitNotifications.createNotification.called, "createNotification called");
        ok(notifyObj.show.called, "notification start called");
        ok(!notifyObj.cancel.called, "notification cancel not called before timer");
        this.clock.tick(15000);
        ok(notifyObj.cancel.called, "notification cancel called after timer");
        ok(notifyObj.show.calledBefore(notifyObj.cancel), "show() called before cancel()");
    });


// }}}1
});
/* vim:set fdm=marker: */

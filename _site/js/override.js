/*
 * This overrides the fetch function to mock real ajax calls.
 */

Site.postings = [
    {nick:"AwesomeNick",message:"my steller home page: <a href=\"#\">http://stelerhomepage.com</a>"},
    {nick:"foobar",message:"test3"},
    {nick:"bar",message:"test2"}
];

Site.random_posting = function() {
    var index = Math.floor(Math.random() * Site.postings.length);
    var post = Site.postings[index];
    post.time = new Date();
    return post;
}

Site.init_demo = function() {
    Site.populate();
    Site.continueCycle();
};

Site.fetch = null;
Site.fetch = function() {
    var d;
    var rnd = Math.random()*101;
    if (Site.timmer !== null) {
        clearTimeout(Site.timmer);
        Site.timmer = null;
    }
    if (Site.running) {
        d = Site.data;
        if (rnd > 15) {
            d.push(Site.random_posting());
            Site.success(d);
        } else if (rnd > 10) {
            Site.data = [ ];
            Site.success(d);
        } else {
            Site.error(null, "", "(This is a fake error for demonstration)");
        }
    } else {
        // populate initial three.
        d = [ ];
        d.unshift(Site.random_posting());
        d.unshift(Site.random_posting());
        d.unshift(Site.random_posting());
        Site.data = d;
        setTimeout(Site.init_demo, 3000);
    }
    return false;
};

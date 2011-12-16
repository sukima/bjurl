/*
 * This overrides the fetch function to mock real ajax calls.
 */

Site.postings = [
    /*
    {nick:"Arlene",
    {nick:"Bret",
    {nick:"Cindy",
    {nick:"Don",
    {nick:"Emily",
    {nick:"Franklin",
    {nick:"Gert",
    {nick:"Harvey",
    {nick:"Irene",
    {nick:"Jose",
    {nick:"Katia",
    {nick:"Lee",
    {nick:"Maria",
    {nick:"Nate",
    {nick:"Ophelia",
    {nick:"Philippe",
    {nick:"Rina",
    {nick:"Sean",
    {nick:"Tammy",
    {nick:"Vince",
    {nick:"Whitney",
    {nick:"Alberto",
    {nick:"Beryl",
    {nick:"Chris",
    {nick:"Debby",
    {nick:"Ernesto",
    {nick:"Florence",
    {nick:"Gordon",
    {nick:"Helene",
    {nick:"Isaac",
    {nick:"Joyce",
    {nick:"Kirk",
    {nick:"Leslie",
    {nick:"Michael",
    {nick:"Nadine",
    {nick:"Oscar",
    {nick:"Patty",
    {nick:"Rafael",
    {nick:"Sandy",
    {nick:"Tony",
    {nick:"Valerie",
    {nick:"William",
    {nick:"Andrea",
    {nick:"Barry",
    {nick:"Chantal",
    {nick:"Dorian",
    {nick:"Erin",
    {nick:"Fernand",
    {nick:"Gabrielle",
    {nick:"Humberto",
    {nick:"Ingrid",
    {nick:"Jerry",
    {nick:"Karen",
    {nick:"Lorenzo",
    {nick:"Melissa",
    {nick:"Nestor",
    {nick:"Olga",
    {nick:"Pablo",
    {nick:"Rebekah",
    {nick:"Sebastien",
    {nick:"Tanya",
    {nick:"Van",
    {nick:"Wendy",
    {nick:"Arthur",
    {nick:"Bertha",
    {nick:"Cristobal",
    {nick:"Dolly",
    {nick:"Edouard",
    {nick:"Fay",
    {nick:"Gonzalo",
    {nick:"Hanna",
    {nick:"Isaias",
    {nick:"Josephine",
    {nick:"Kyle",
    {nick:"Laura",
    {nick:"Marco",
    {nick:"Nana",
    {nick:"Omar",
    {nick:"Paulette",
    {nick:"Rene",
    {nick:"Sally",
    {nick:"Teddy",
    {nick:"Vicky",
    {nick:"Wilfred",
    {nick:"Ana",
    {nick:"Bill",
    {nick:"Claudette",
    {nick:"Danny",
    {nick:"Erika",
    {nick:"Fred",
    {nick:"Grace",
    {nick:"Henri",
    {nick:"Ida",
    {nick:"Joaquin",
    {nick:"Kate",
    {nick:"Larry",
    {nick:"Mindy",
    {nick:"Nicholas",
    {nick:"Odette",
    {nick:"Peter",
    {nick:"Rose",
    {nick:"Sam",
    {nick:"Teresa",
    {nick:"Victor",
    {nick:"Wanda",
    {nick:"Alex",
    {nick:"Bonnie",
    {nick:"Colin",
    {nick:"Danielle",
    {nick:"Earl",
    {nick:"Fiona",
    {nick:"Gaston",
    {nick:"Hermine",
    {nick:"Ian",
    {nick:"Julia",
    {nick:"Karl",
    {nick:"Lisa",
    {nick:"Matthew",
    {nick:"Nicole",
    {nick:"Otto",
    {nick:"Paula",
    {nick:"Richard",
    {nick:"Shary",
    {nick:"Tobias",
    {nick:"Virginie",
    {nick:"Walter",
    */
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

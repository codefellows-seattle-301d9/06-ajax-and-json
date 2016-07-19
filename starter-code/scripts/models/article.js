function Article (opts) {
  for (keys in opts) {
    this[keys] = opts[keys];
  }
}

/* TODO - DONE: Instead of a global `articles = []` array, let's track this list of all
 articles directly on the constructor function. Note: it is NOT on the prototype.
 In JavaScript, functions are themselves objects, which means we can add
 properties/values to them at any time. In this case, we have a key:value pair
 to track, that relates to ALL of the Article objects, so it does not belong on
 the prototype, as that would only be relevant to a single instantiated Article.
 */

Article.all = [];

Article.prototype.toHtml = function(scriptTemplateId) {
  var template = Handlebars.compile($(scriptTemplateId).text());
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);
  return template(this);
};

/* NOTE: There are some other functions that also relate to all articles,
 rather than just single instances. Object-oriented programming would
 call these "class-level" functions, that are relevant to the entire "class"
 of objects that are Articles, rather than just one instance. */

/* TODO - DONE: Refactor this code into a function for greater control.
    It will take in our data, and process it via the Article constructor: */

Article.loadAll = function(dataWePassIn) {
  dataWePassIn.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  }).forEach(function(ele) {
    Article.all.push(new Article(ele));
  });
};

/* This function below will retrieve the data from either a local or remote
 source, process it, then hand off control to the View: */

Article.fetchAll = function() {
  if (localStorage.hackerIpsum) {
    // $.ajax('/data/hackerIpsum.json', {
    //   ifModified : 
    // })
    /* When our data is already in localStorage:
    1. We can process it (sort and instantiate),
    2. Then we can render the index page. */
    // Article.loadAll(// TODO: Invoke with our localStorage! Should we parse or stringify this?);
    // TODO: Now let's render the index page
    // var tempDataStore = JSON.parse(data);
    // console.log('processed data ' + tempDataStore);
    Article.loadAll(JSON.parse(localStorage.hackerIpsum));
    articleView.renderIndexPage();
  } else {
    /* TODO: Otherwise, without our localStorage data, we need to:
    - Retrive our JSON file asynchronously
     (which jQuery method method is best for this?).
     Within this method, we should:
     1. Load our json data,
     2. Store that data in localStorage so we can skip the server call next time.
     3. And then render the index page. */
    $.getJSON('/data/hackerIpsum.json', function(data) {
      localStorage.hackerIpsum = JSON.stringify(data);
      Article.loadAll(data);
      articleView.renderIndexPage();
    });
  }
};






/* Great work so far! STRETCH GOAL TIME!? Refactor your fetchAll above, or
   get some additional typing practice here. Our main goal in this part of the
   lab will be saving the eTag located in Headers, to see if it's been updated!

  Article.fetchAll = function() {
    if (localStorage.hackerIpsum) {
      // Let's make a request to get the eTag (hint: you may need to use a different
      // jQuery method for this more explicit request).
    } else {}
  }
*/
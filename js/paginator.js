const Paginator = function(links, index, limit) {
  this.links = links;
  this.index = 0;
  this.limit = limit <= links.length && limit > 0 ? limit : links.length;

  this.html = document.createElement("div");
  this.html.setAttribute("class", "paginator");
  this.html.innerHTML =
    '<div class = "paginator-content "></div><div class = " pagination justify-content-center"><a class = "paginator-button page-link">back</a><div class = "paginator-index page-link"></div><a class = "paginator-button page-link ">next</a></div>';

  var buttons = this.html.querySelectorAll("a");
  for (let index = buttons.length - 1; index > -1; --index) {
    let button = buttons[index];

    button.addEventListener("click", Paginator.click);
    button.paginator = this;
  }
};
Paginator.prototype = {
  constructor: Paginator,
  changeIndex: function(new_index) {
    var content_div, content_strings, limit, loaded;
    this.index = new_index;
    this.html.querySelector(".paginator-index").innerHTML =
      new_index / this.limit +
      1 +
      " of " +
      Math.ceil(this.links.length / this.limit);
    content_div = this.html.querySelector(".paginator-content");
    content_div.scrollTop = 0;
    content_strings = [];

    limit =
      new_index + this.limit <= this.links.length
        ? this.limit
        : this.links.length - new_index;
    loaded = 0;
    paginator = this;
    for (let index = 0; index < limit; index++) {
      Paginator.requestContent(this.links[this.index + index], function(
        request
      ) {
        loaded++;
        content_strings[index] = "<br>" + request.responseText + "<br>";
        if (loaded >= limit) {
          content_div.innerHTML = "";

          for (let index = 0; index < limit; index++) {
            content_div.innerHTML += content_strings[index];
          }
        }
      });
    }
  }
};
Paginator.click = function(event) {
  var shift;
  switch (this.innerHTML) {
    case "back":
      shift = this.paginator.index - this.paginator.limit;
      if (shift < 0) return;
      break;
    case "next":
      shift = this.paginator.index + this.paginator.limit;
      if (shift >= this.paginator.links.length) return;
      break;
  }
  this.paginator.changeIndex(shift);
};

Paginator.create = function(links, index, limit) {
  var paginator, script;
  script = document.currentScript;
  paginator = new Paginator(links, 0, limit);
  paginator.changeIndex(index);
  script.parentNode.replaceChild(paginator.html, script);
};

Paginator.requestContent = function(url, callback) {
  var request;
  request = new XMLHttpRequest();
  request.addEventListener("load", function(event) {
    callback(this);
  });
  request.open("GET", url);
  request.send(null);
};

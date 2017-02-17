var output, searchArticle;

output = '';

searchArticle = function() {
  var inputVal;
  inputVal = search.value;
  inputVal = inputVal.replace(/\s+/g, '%20');
  if (inputVal === "") {
    return $('.search-container').after("<p class='error'>Please enter a search query</p>");
  } else {
    $('p.error').hide();
    return $.ajax({
      type: "GET",
      url: "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=0&gsrsearch=" + inputVal + "&gsrlimit=5&callback=?",
      contentType: "application/json; charset=utf-8",
      async: false,
      dataType: "json",
      success: function(data, textStatus, jqXHR) {
        var i, j, len, pages, results, title;
        console.log(data);
        title = data.query.title;
        pages = data.query.pages;
        $('.read-more').remove();
        results = [];
        for (j = 0, len = pages.length; j < len; j++) {
          i = pages[j];
          results.push(console.log(pages[i].title));
        }
        return results;
      },
      error: function(errorMessage) {
        $('.output').addClass('output-visible');
        output = "<p>No results found.</p>";
        return document.getElementById('output').innerHTML = output;
      }
    });
  }
};

$('#search').keypress(function() {
  if (event.keyCode === 13 || event.which === 13) {
    return searchArticle();
  }
});

$('#random').click(function() {
  return $.ajax({
    type: "GET",
    url: "http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json&rnlimit=1&callback=?",
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function(data, textStatus, jqXHR) {
      var articleId, articleTitle, copy, extract, first, firstP, i, j, len, obj;
      obj = data.query.pages;
      first;
      for (j = 0, len = obj.length; j < len; j++) {
        i = obj[j];
        if (obj.hasOwnProperty(i) && typeof i !== 'function') {
          first = obj[i];
          break;
        }
      }
      articleTitle = first.title;
      extract = first.extract;
      copy = $(extract).find("p");
      firstP = copy.prevObject[0].innerHTML;
      articleId = first.pageid;
      $('.output').addClass('output-visible');
      output = '<h2>' + articleTitle + '</h2>';
      output += '<div class="some-class">' + firstP + '</div>';
      output += '<p class="read-more"><a href="http://en.wikipedia.org/wiki?curid=' + articleId + '" target="_blank">Read More</a></p>';
      document.getElementById('output').innerHTML = output;
      return {
        error: function(errorMessage) {
          return console.log('No article found');
        }
      };
    }
  });
});

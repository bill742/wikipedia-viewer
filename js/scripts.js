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
    $('#output').empty();
    return $.ajax({
      type: "GET",
      url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&formatversion=1&pilimit=50&exsentences=1&exlimit=20&exintro=1&explaintext=1&gsrnamespace=0&gsrsearch=" + inputVal + "&gsrlimit=10&callback=?",
      contentType: "application/json; charset=utf-8",
      async: false,
      dataType: "json",
      success: function(data, textStatus, jqXHR) {
        var pageArr, pages;
        pages = data.query.pages;
        pageArr = Object.keys(pages).map(function(key) {
          return pages[key];
        });
        $('.read-more').remove();
        return pageArr.forEach(function(i) {
          return document.getElementById('output').innerHTML += "<div class='box'><h3>" + i.title + "</h3><p>" + i.extract + "</p><p class='read-more'><a href='https://en.wikipedia.org/?curid=" + i.pageid + "' target='_blank'>Read More</a></p></div>";
        });
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
  $('#output').empty();
  return $.ajax({
    type: "GET",
    url: "http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json&rnlimit=1&callback=?",
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function(data, textStatus, jqXHR) {
      var articleId, articleTitle, copy, extract, firstP, objArr, randomObj, result;
      randomObj = data.query.pages;
      objArr = Object.keys(randomObj).map(function(key) {
        return randomObj[key];
      });
      result = objArr[0];
      articleTitle = result.title;
      extract = result.extract;
      copy = $(extract).find("p");
      firstP = copy.prevObject[0].innerHTML;
      articleId = result.pageid;
      $('.output').addClass('output-visible');
      output = '<h3>' + articleTitle + '</h3>';
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

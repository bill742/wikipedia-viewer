var output="";

function searchArticle () {
    var inputVal = search.value;
    inputVal = inputVal.replace(/\s+/g, '%20');

    if (inputVal === ""){
      $('.search-container').after("<p class='error'>Please enter a search query</p>");
    } else {
      $('p.error').hide();

      $.ajax({
        type: "GET",
        // url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&rvprop=content&section=0&page=" + inputVal + "&callback=?",
        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=0&gsrsearch=" + inputVal + "&gsrlimit=5&callback=?",
        // url: "http://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=0&gsrsearch=" + inputVal + "&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log(data);

            var title = data.query.title;
            var pages = data.query.pages;

            // var markup = data.parse.text["*"];
            // var blurb = $('<div></div>').html(markup);

            // Clear out any existing links
            $('.read-more').remove();

            // remove links as they will not work
            // blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

            // remove any references
            // blurb.find('sup').remove();

            // remove cite error
            // blurb.find('.mw-ext-cite-error').remove();
            // $('#output').html($(blurb).find('p'));

            for (var i in pages) {
                console.log(pages[i].title);
                // console.log(pages);
                // output = ""
            }

            $('.output').addClass('output-visible');
            $('#output p:first-child').after('<p class="read-more"><a href="https://en.wikipedia.org/wiki/' + inputVal + '" target="_blank">Read More</a></p>');
            $('#output p:first-child').css('display', 'block').before('<h2>' + title + '</h2>');
        },
        error: function (errorMessage) {
            $('.output').addClass('output-visible');
            output = "<p>No results found.</p>";
            document.getElementById('output').innerHTML = output;
        }
    });
  }
}

// Allow search to work by pressing Enter
document.getElementById("search").onkeypress = function(event){
  if (event.keyCode == 13 || event.which == 13){
      searchArticle();
  }
};

// Search for random article
document.getElementById("random").onclick = function(){

  $.ajax({
    type: "GET",
    url: "http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json&rnlimit=1&callback=?",
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
    // console.log(data);
    var obj = data.query.pages;

    //   console.log(obj);

    var first;
    for (var i in obj) {
        if (obj.hasOwnProperty(i) && typeof(i) !== 'function') {
            first = obj[i];
            break;
        }
    }
    // console.log(first);
    var articleTitle = first.title;
    var extract = first.extract;
    var copy = $(extract).find("p");
    var firstP = copy.prevObject[0].innerHTML;
    var articleId = first.pageid;

    $('.output').addClass('output-visible');
        output = '<h2>' + articleTitle + '</h2>';
        output += '<div class="some-class">' + firstP + '</div>';
        output += '<p class="read-more"><a href="http://en.wikipedia.org/wiki?curid=' +  articleId + '" target="_blank">Read More</a></p>';

        document.getElementById('output').innerHTML = output;
    },
    error: function (errorMessage) {
        console.log('No article found');
    }
  });

};

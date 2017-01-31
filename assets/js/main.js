var output="";

function searchArticle () {
    var inputVal = search.value;
    inputVal = inputVal.replace(/\s+/g, '%20');

    if (inputVal === ""){
      $('.search-container').after("<p class='error'>Please enter a search query</p>");
    } else {
      $('p.error').hide();

      // var wikiapi = "https://en.wikipedia.org/w/api.php?action=query&titles=" + inputVal + "&prop=revisions&rvprop=content&format=json";
      // console.log(wikiapi);

      $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + inputVal + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);

            // Clear out any existing links
            $('.read-more').remove();

            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

            // remove any references
            blurb.find('sup').remove();

            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            $('#output').html($(blurb).find('p'));

            $('.output').addClass('output-visible');
            $('#output p:first-child').after('<p class="read-more"><a href="https://en.wikipedia.org/wiki/' + inputVal + '" target="_blank">Read More</a></p>');

        },
        error: function (errorMessage) {
            console.log('No article found');
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
    url: "http://en.wikipedia.org/w/api.php?action=query&format=json&rnlimit=1&list=random&callback=?",
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      console.log(data);

    //   var markup = data.parse.text["*"];
    //   var blurb = $('<div></div>').html(markup);
      //
    //   console.log(markup);
      //
    //   $('#output').html($(blurb).find('p'));
      //
      var articleTitle = data.query.random[0].title;
       var articleId = data.query.random[0].id;

      $('.output').addClass('output-visible');
      output = '<p class="some-class">' + articleTitle + '</p>';
      output += '<a class="read-more" href="https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=' +  articleId + '&inprop=url">Read More</a>';

      document.getElementById('output').innerHTML = output;
    },
    error: function (errorMessage) {
        console.log('No article found');
    }
  });

};

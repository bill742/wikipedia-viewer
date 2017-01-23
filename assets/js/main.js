function searchArticle () {
    var inputVal = search.value;

    if (inputVal === ""){
        console.log('please enter a search term');
    } else {
      var wikiapi = "https://en.wikipedia.org/w/api.php?action=query&titles=" + inputVal + "&prop=revisions&rvprop=content&format=json";

      var output="";

    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + inputVal + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);

            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

            // remove any references
            blurb.find('sup').remove();

            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            $('#article').html($(blurb).find('p'));

            document.getElementById('output').innerHTML = blurb[0].innerHTML;

        },
        error: function (errorMessage) {
        }
    });
  }
}

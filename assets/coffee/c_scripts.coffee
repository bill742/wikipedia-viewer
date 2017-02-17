output = ''

searchArticle = ->
    inputVal = search.value
    inputVal = inputVal.replace(/\s+/g, '%20')

    if inputVal == ""
        $('.search-container').after("<p class='error'>Please enter a search query</p>")
    else
      $('p.error').hide()

      $.ajax
        type: "GET"
        # url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&rvprop=content&section=0&page=" + inputVal + "&callback=?"
        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=0&gsrsearch=" + inputVal + "&gsrlimit=5&callback=?"
        # url: "http://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=0&gsrsearch=" + inputVal + "&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max"
        contentType: "application/json; charset=utf-8"
        async: false
        dataType: "json"
        success: (data, textStatus, jqXHR) ->
            console.log(data);

            title = data.query.title
            pages = data.query.pages

            # var markup = data.parse.text["*"];
            # var blurb = $('<div></div>').html(markup);

            # Clear out any existing links
            $('.read-more').remove()

            # remove links as they will not work
            # blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

            # remove any references
            # blurb.find('sup').remove();

            # remove cite error
            # blurb.find('.mw-ext-cite-error').remove();
            # $('#output').html($(blurb).find('p'));

            for i in pages
                console.log(pages[i].title);
                # console.log(pages);
                # output = ""

        error: (errorMessage) ->
            $('.output').addClass('output-visible')
            output = "<p>No results found.</p>"
            document.getElementById('output').innerHTML = output

# Allow search to work by pressing Enter
document.getElementById("search").onkeypress = (event) ->
    # if event.keyCode == 13 or event.which == 13 then searchArticle()
    if event.keyCode == 13 or event.which == 13 then console.log 'pressed'

# Search for random article
document.getElementById("random").onclick ->
    $.ajax
      type: "GET"
      url: "http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json&rnlimit=1&callback=?"
      contentType: "application/json; charset=utf-8"
      async: false
      dataType: "json"
      success: (data, textStatus, jqXHR) ->
          # console.log(data)
          obj = data.query.pages

          # console.log(obj);

          first
          for i in obj
              if (obj.hasOwnProperty(i) and typeof(i) != 'function')
                  first = obj[i]
                  break

          # console.log(first)
          articleTitle = first.title
          extract = first.extract
          copy = $(extract).find("p")
          firstP = copy.prevObject[0].innerHTML
          articleId = first.pageid

          $('.output').addClass('output-visible');
          output = '<h2>' + articleTitle + '</h2>'
          output += '<div class="some-class">' + firstP + '</div>'
          output += '<p class="read-more"><a href="http://en.wikipedia.org/wiki?curid=' +  articleId + '" target="_blank">Read More</a></p>'
          document.getElementById('output').innerHTML = output;
          error: (errorMessage) ->
              console.log('No article found')

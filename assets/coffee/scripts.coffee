output = ''

searchArticle = ->
    inputVal = search.value
    inputVal = inputVal.replace(/\s+/g, '%20')

    if inputVal == ""
        $('.search-container').after("<p class='error'>Please enter a search query</p>")
    else
      $('p.error').hide()

      $('#output').empty()

      $.ajax
        type: "GET"
        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&formatversion=1&pilimit=50&exsentences=1&exlimit=20&exintro=1&explaintext=1&gsrnamespace=0&gsrsearch=" + inputVal + "&gsrlimit=10&callback=?"
        contentType: "application/json; charset=utf-8"
        async: false
        dataType: "json"
        success: (data, textStatus, jqXHR) ->
            # console.log(data);

            pages = data.query.pages
            pageArr = Object.keys(pages).map (key)-> pages[key]

            $('.read-more').remove()

            pageArr.forEach (i) ->
                document.getElementById('output').innerHTML += "<div class='box'><h3>" + i.title + "</h3><p>" + i.extract + "</p><p class='read-more'><a href='https://en.wikipedia.org/?curid=" + i.pageid + "' target='_blank'>Read More</a></p></div>"

        error: (errorMessage) ->
            $('.output').addClass('output-visible')
            output = "<p>No results found.</p>"
            document.getElementById('output').innerHTML = output

# Allow search to work by pressing Enter
$('#search').keypress ->
    if event.keyCode == 13 or event.which == 13 then searchArticle()

# Search for random article
$('#random').click ->
    $('#output').empty()

    $.ajax
      type: "GET"
      url: "http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json&rnlimit=1&callback=?"
      contentType: "application/json; charset=utf-8"
      async: false
      dataType: "json"
      success: (data, textStatus, jqXHR) ->
          # console.log(data)
          randomObj = data.query.pages
          objArr = Object.keys(randomObj).map (key)-> randomObj[key]
          result = objArr[0]
          articleTitle = result.title

          # Get first paragraph of extract
          extract = result.extract
          copy = $(extract).find("p")
          firstP = copy.prevObject[0].innerHTML

          articleId = result.pageid

          $('.output').addClass('output-visible');
          output = '<h3>' + articleTitle + '</h3>'
          output += '<div class="some-class">' + firstP + '</div>'
          output += '<p class="read-more"><a href="http://en.wikipedia.org/wiki?curid=' +  articleId + '" target="_blank">Read More</a></p>'
          document.getElementById('output').innerHTML = output;
          error: (errorMessage) ->
              console.log('No article found')

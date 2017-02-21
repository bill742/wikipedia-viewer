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
        # url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&rvprop=content&section=0&page=" + inputVal + "&callback=?"
        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&formatversion=1&pilimit=50&exsentences=1&exlimit=20&exintro=1&explaintext=1&gsrnamespace=0&gsrsearch=" + inputVal + "&gsrlimit=10&callback=?"
        # url: "http://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=0&gsrsearch=" + inputVal + "&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max"
        contentType: "application/json; charset=utf-8"
        async: false
        dataType: "json"
        success: (data, textStatus, jqXHR) ->
            console.log(data);

            pages = data.query.pages
            pageArr = Object.keys(pages).map (key)-> pages[key]

            # console.log (pages)
            # console.log (pageArr[0])

            $('.read-more').remove()

            pageArr.forEach (i) ->
                document.getElementById('output').innerHTML += "<div class='box'><h2>" + i.title + "</h2><p>" + i.extract + "</p><p class='read-more'><a href='https://en.wikipedia.org/?curid=" + i.pageid + "' target='_blank'>Read More</a></p></div>"

        error: (errorMessage) ->
            $('.output').addClass('output-visible')
            output = "<p>No results found.</p>"
            document.getElementById('output').innerHTML = output

# Allow search to work by pressing Enter
$('#search').keypress ->
    if event.keyCode == 13 or event.which == 13 then searchArticle()

# Search for random article
$('#random').click ->
    $.ajax
      type: "GET"
      url: "http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json&rnlimit=1&callback=?"
      contentType: "application/json; charset=utf-8"
      async: false
      dataType: "json"
      success: (data, textStatus, jqXHR) ->
          console.log(data)
          obj = data.query.pages

          console.log(obj);

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

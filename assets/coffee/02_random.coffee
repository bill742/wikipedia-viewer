# Search for random article
$('.random').click ->
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

          $('#search').val('')

          $('.output').addClass('output-visible');
          output = '<div class="box"><h3>' + articleTitle + '</h3>'
          output += '<p>' + firstP + '</p>'
          output += '<p class="read-more"><a href="http://en.wikipedia.org/wiki?curid=' +  articleId + '" target="_blank">Read More &gt;&gt;</a></p></div>'
          document.getElementById('output').innerHTML = output;
          error: (errorMessage) ->
              console.log('No article found')

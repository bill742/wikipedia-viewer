function searchArticle(){var e=search.value;if(""===e)console.log("please enter a search term");else{$.ajax({type:"GET",url:"http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+e+"&callback=?",contentType:"application/json; charset=utf-8",async:!1,dataType:"json",success:function(t,a,r){var o=t.parse.text["*"],i=$("<div></div>").html(o);$(".read-more").remove(),i.find("a").each(function(){$(this).replaceWith($(this).html())}),i.find("sup").remove(),i.find(".mw-ext-cite-error").remove(),$("#output").html($(i).find("p")),$("#output p:first-child").after('<p class="read-more"><a href="https://en.wikipedia.org/wiki/'+e+'" target="_blank">Read More</a></p>')},error:function(e){console.log("No article found")}})}}document.getElementById("search").onkeypress=function(e){13!=e.keyCode&&13!=e.which||searchArticle()};
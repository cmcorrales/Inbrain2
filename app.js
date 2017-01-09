console.log('app');
$(function() {
  $(".submit").click(function(){
    $(".hidden-buttons").show();
    $(".main").hide();
    var quizObject = new Object();
    quizObject.quizTopic = $('input.quizTopic').val();
    quizObject.quizName = $('input.quizName').val();
    quizObject.question = $('input.quizQuestion').val();
    quizObject.answer = $('input.quizAnswer').val();
    $.ajax({ type: "POST",
    url: "/createquiz",
    data: quizObject
  });
    console.log(quizObject);
  })
})

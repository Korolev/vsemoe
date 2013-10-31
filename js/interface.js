$(document).ready(function(){
	$('div.navi ul li').click(function(){
	    var num = $(this).attr('data-num');
	    $('div.navi ul li').removeClass('selected');
	    $('.elements .phone').addClass('hidden');
	    $('.elements .phone[data-num=' + num + ']').removeClass('hidden');
	    $(this).addClass('selected');
	});


	$("a#example").fancybox({
	    'titleShow': false
	});
	$("a#i1").fancybox({
	    'titleShow': false
	});
	$("a#i2").fancybox({
	    'titleShow': false
	});
	$("a#i3").fancybox({
	    'titleShow': false
	});
	$("a#i4").fancybox({
	    'titleShow': false
	});

	$('#Span1').click(function(){
	    $('#Div1').toggle();
	});
	$('#Span2').click(function (){
	    $('#Div2').toggle();
	});
	$('#Span3').click(function (){
	    $('#Div3').toggle();
	});
	$('#Span4').click(function (){
	    $('#Div4').toggle();
	});

	$('#Span5').click(function () {
	    $('#Div1').toggle();
	});
	$('#Span6').click(function () {
	    $('#Div2').toggle();
	});
	$('#Span7').click(function () {
	    $('#Div3').toggle();
	});
	$('#Span8').click(function () {
	    $('#Div4').toggle();
	});

	$('#Div5').hover(function () {
        $('#Span5').toggle();
        $('#A5').toggle();
    });
	$('#Div6').hover(function () {
        $('#Span6').toggle();
        $('#A6').toggle();
    });
	$('#Div7').hover(function () {
        $('#Span7').toggle();
        $('#A7').toggle();
    });
	$('#Div8').hover(function () {
        $('#Span8').toggle();
        $('#A8').toggle();
	});
	slider();
});


function slider() {
    var selectElement = $('.elements div:not(.hidden)');
    var num = parseInt(selectElement.attr('data-num'));
    num = num + 1;
    if (num > 3) { num = 1; }
    $('.elements .phone').addClass('hidden');
    $('.elements .phone[data-num=' + num + ']').removeClass('hidden');

    $('div.navi ul li').removeClass('selected');
    $('div.navi ul li[data-num=' + num + ']').addClass('selected');
    setTimeout("slider()", 5000);
}


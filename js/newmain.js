// /**
//  * Created by mk-sfdev on 5/19/14.
//  */



$(function() {
    var $presentation = $('.slider-presentation');
    var currentSlide = 1, slidesCount = parseInt($presentation.data('slides'));
    setInterval(function() {
        $presentation.removeClass('slide-' + currentSlide);
        currentSlide = currentSlide % slidesCount + 1;
        $presentation.addClass('slide-' + currentSlide);
    }, 10000);

    $('.four-steps-action .step-pic a, .smallvideo a').fancybox({
      hideOnContentClick: false
    });

    function showPartnerForm(){
        showIframeDialog('/partner/?v4');
    }

    if(location.hash == '#showpartner'){
        showPartnerForm();
    }

});




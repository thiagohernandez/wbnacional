( function($) {

    'use strict';
    /* CODE GOES HERE */

    function collapseNavbar() {
        if ($('.navbar').hasClass('fixed-top')) {
            if ($(".navbar").offset().top > 102) {
                $(".navbar").addClass("top-nav-collapse");
            } else {
                $(".navbar").removeClass("top-nav-collapse");
            }
        }
    }

    function setHeroHeightGlider() {
        var windowWidth = $(window).width();
        if(windowWidth > 768) {
            var marginTopOverlay = $('.hero--bottom').height() + 124;
            $('.hero .glider-controls').css({
                'margin-top': - marginTopOverlay
            });
        } else {
            $('.hero .glider-controls').css({
                'margin-top': 'auto'
            });
        }
    }

    function setHeroOverlap() {
        /*
        var windowWidth = $(window).width();
        if(windowWidth > 768) {
            var marginTopOverlay = $('.hero--bottom').height() + 64;
            $('.hero--bottom').css({
                'margin-top': - marginTopOverlay
            });
        } else {
            $('.hero--bottom').css({
                'margin-top': 'auto'
            });
        }
        */
    }

    function calculatePaddingLeft(element) {
        if ($(window).width() > 991) {
            var valuePadding = ($(window).width() - $('.container').width() ) / 2;
            var el = '"' + element + '"'; 
            console.log(element);
            console.log(valuePadding);
            $(element).css({
                'padding-left' : valuePadding
            });
        } else {
            $(element).css({
                'padding-left' : '15px'
            });
        }
    }


    $(document).ready(function() {

        // Example starter JavaScript for disabling form submissions if there are invalid fields
        (function() {
            'use strict';
            window.addEventListener('load', function() {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
                }, false);
            });
            }, false);
        })();

        if ($('.glider-hero').length > 0) {
            setHeroHeightGlider();
        }
        if ($('.hero-coverage').length > 0) {
            setHeroOverlap();
        }
        
        if ($('.services-component--inner').length > 0) {
            calculatePaddingLeft('.services-component--inner');
        }
        if ($('.page-header--content').length > 0) {
            calculatePaddingLeft('.page-header--content');
        }

        

       // jQuery for page scrolling feature - requires jQuery Easing plugin
        $(function() {
            $('a.page-scroll').bind('click', function(event) {
                var $anchor = $(this);
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top-145
                }, 1500, 'easeInOutExpo');
                event.preventDefault();
            });
        });

        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        })

        if($('.data-stats').length > 0) {
            var delay = 150;

            var comma_separator_number_step = $.animateNumber.numberStepFactories.separator('.')

            $('.data-stats').each( function () {
                var animateNumber = $(this).attr('data-stats');
                console.log('Data stats: ' + animateNumber);


                $(this).animateNumber(
                    {
                      number: animateNumber,
                      numberStep: comma_separator_number_step
                    }, 1000
                  );

                //
                //setTimeout(function() {
                    //console.log($(this).find('.price-day'));
                    //$(this).find('.price-day').animateNumber({ number: animateNumber });
                //}, delay);
                delay = delay+150;
            });
        } 

        if ($('.glider-hero').length > 0) {
            var gliderHero = new Glider(document.querySelector('.glider-hero'), {
                slidesToShow: 1,
                dots: '#dots-hero',
                draggable: false,
                rewind: true,
                arrows: {
                  prev: '.hero-prev',
                  next: '.hero-next'
                }
              });
              slideAutoPaly(gliderHero, '.glider-hero');
        }
        
        if ($('.glider-testimonials').length > 0) {
            
                var gliderTestimonials = new Glider(document.querySelector('.glider-testimonials'), {
                    slidesToShow: 1,
                    dots: '#dots-testimonials',
                    draggable: true,
                    arrows: {
                    prev: '.tes-prev',
                    next: '.tes-next'
                    }
                });
                
                var counterSizeTestimonials = gliderTestimonials.slides.length; 
                $('#counter-tes-size').text(counterSizeTestimonials);
                $('#counter-tes-actual').text('1');

                document.querySelector('.glider-testimonials').addEventListener('glider-slide-visible', function(event){
                    var glider = Glider(this);
                    console.log(glider);
                    var counterActualTestimonials = glider.slide + 1;
                    console.log(counterActualTestimonials);
                    $('#counter-tes-actual').text(counterActualTestimonials);
                });
            
        }
        if ($('.glider-services').length > 0) {
            var gliderServices = new Glider(document.querySelector('.glider-services'), {
                slidesToScroll: 1,
                slidesToShow: 4.5,
                dots: '#dots-services',
                draggable: false,
                rewind: true,
                arrows: {
                  prev: '.services-prev',
                  next: '.services-next'
                },
                responsive: [
                  {
                    // screens greater than >= 775px
                    breakpoint: 775,
                    settings: {
                      // Set to `auto` and provide item width to adjust to viewport
                        slidesToShow: 3.5,
                    }
                  },{
                    // screens greater than >= 100px
                    breakpoint: 100,
                    settings: {
                        slidesToShow: 1.5,
                    }
                  }
                ]
              });
              slideAutoPaly(gliderServices, '.glider-services');
        }

        function slideAutoPaly(glider, selector, delay = 4000, repeat = true) {
            let autoplay = null;
            const slidesCount = glider.track.childElementCount;
            let nextIndex = 1;
            let pause = true;
        
            function slide() {
                autoplay = setInterval(() => {
                    if (nextIndex >= slidesCount) {
                        if (!repeat) {
                            clearInterval(autoplay);
                        } else {
                            nextIndex = 0;
                        }
                    }
                    glider.scrollItem(nextIndex++);
                }, delay);
            }
        
            slide();
        
            var element = document.querySelector(selector);
            element.addEventListener('mouseover', (event) => {
                if (pause) {
                    clearInterval(autoplay);
                    pause = false;
                }
            }, 300);
        
            element.addEventListener('mouseout', (event) => {
                if (!pause) {
                    slide();
                    pause = true;
                }
            }, 300);
        }


    }); //ready

    $(window).scroll(collapseNavbar);
    $(window).resize( function() {
        console.log('resize');
        if ($('.glider-hero').length > 0) {
            setHeroHeightGlider();
        }
        if ($('.services-component--inner').length > 0) {
            calculatePaddingLeft('.services-component--inner');
        }
        if ($('.page-header--content').length > 0) {
            calculatePaddingLeft('.page-header--content');
        }
        if ($('.hero-coverage').length > 0) {
            setHeroOverlap();
        }
    });

} ) ( jQuery );





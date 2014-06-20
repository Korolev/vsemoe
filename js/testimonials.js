$(function(){
    var testimonialsPattern = "<div class='testimonials_body'>\
        <div class='testimonials_user'>от {!name}</div>\
        <div class='testimonials_user_message'>\
                <p>{!message}</p>\
        </div>\
        </div>";

    var testimonials = [],
            cursor = 2,
            len = 0,
            holder = $('.testimonials_holder'),
            busy = false;

    ServerApi.getResponseList({},function(r){
        if(r){
            $.each(r,function(k,item){
                testimonials.push(testimonialsPattern
                        .replace('{!name}',item.name)
                        .replace('{!message}',item.message));
            });
            len = testimonials.length;
            holder.empty();
            for(var i = 0;i< 3;i++){
                $(testimonials[i]).addClass(i % 2 ? 'odd' : 'even').appendTo(holder);
            }
        }
    });

    $('.testimonials_navigation').on('click', function (e) {
        if (busy) return false;
        busy = true;

        var firstIdx,
                $animatedEl,
                $el = $(e.target);
        if ($el.hasClass('nav_prev')) {
            cursor--;
            cursor = cursor < 0 ? len - 1 : cursor;
            firstIdx = cursor - 2;
            firstIdx = firstIdx < 0 ? len + firstIdx : firstIdx;

            $animatedEl = $(testimonials[firstIdx]).css({'margin-left': '-255px'});
            if (holder.find('.testimonials_body:first').hasClass('odd')) {
                $animatedEl.addClass('even');
            } else {
                $animatedEl.addClass('odd');
            }
            holder.prepend($animatedEl);
            $animatedEl.animate({'margin-left': '0'}, function () {
                holder.find('.testimonials_body:last').remove();
                busy = false;
                $animatedEl.removeAttr('style');
            });
        } else {
            cursor++;
            cursor = cursor > len - 1 ? 0 : cursor;
            firstIdx = cursor - 2;
            firstIdx = firstIdx < 0 ? len + firstIdx : firstIdx;

            $animatedEl = holder.find('.testimonials_body:first');
            $newEl = $(testimonials[cursor]);
            if (holder.find('.testimonials_body:last').hasClass('odd')) {
                $newEl.addClass('even');
            } else {
                $newEl.addClass('odd');
            }
            holder.append($newEl);
            $animatedEl.animate({'margin-left': '-255px'}, function () {
                busy = false;
                $animatedEl.remove();
            });
        }
    });
});

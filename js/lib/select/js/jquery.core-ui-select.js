/**
 * jQuery CoreUISelect
 * Special thanks to Artem Terekhin, Yuriy Khabarov, Alexsey Shein
 *
 * @author      Gennadiy Ukhanov
 * @version     0.0.3
 */
(function ($) {

    var defaultOption = {
        appendToBody : false,
        jScrollPane  : null,
        onInit       : null,
        onFocus      : null,
        onBlur       : null,
        onOpen       : null,
        onClose      : null,
        onChange     : null,
        onDestroy    : null
    }

    var allSelects = [];

    $.browser.mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));
    $.browser.operamini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]";

    /**
     * CoreUISelect - stylized standard select
     * @constructor
     */
    function CoreUISelect(__elem, __options, __templates) {

        this.domSelect = __elem;
        this.settings = __options || defaultOption;
        this.isSelectShow = false;
        this.isSelectFocus = false;
        this.isJScrollPane = this.isJScrollPane();

        // templates
        this.templates = __templates ||
        {
            select : {
                container : '<div class="b-core-ui-select"></div>',
                value : '<span class="b-core-ui-select__value"></span>',
                button : '<span class="b-core-ui-select__button"></span>'
            },
            dropdown : {
                container : '<div class="b-core-ui-select__dropdown"></div>',
                wrapper : '<div class="b-core-ui-select__dropdown__wrap"></div>',
                list : '<ul class="b-core-ui-select__dropdown__list"></ul>',
                optionLabel : '<li class="b-core-ui-select__dropdown__label"></li>',
                item : '<li class="b-core-ui-select__dropdown__item"></li>'
            }
        }

        this.init(this.settings);
    }

    CoreUISelect.prototype.init = function() {
        if($.browser.operamini) return this;
        this.buildUI();
        this.hideDomSelect();
        if(this.domSelect.is(':disabled')) {
            this.select.addClass('disabled');
            return this;
        }
        if(this.isJScrollPane) this.buildJScrollPane();
        this.bindUIEvents();
        if($.browser.mobile) {
            this.simulateShowedDomSelect();
            return this;
        }
        this.settings.onInit && this.settings.onInit.apply(this, [this.domSelect, 'init']);

    }

    CoreUISelect.prototype.buildUI = function() {

        // Build select container
        this.select = $(this.templates.select.container)
            .insertBefore(this.domSelect);

        this.selectValue = $(this.templates.select.value)
            .appendTo(this.select);

        // TODO Add custom states for button
        this.selectButton = $(this.templates.select.button)
            .appendTo(this.select);

        // Build dropdown container
        this.dropdown = $(this.templates.dropdown.container);
        this.dropdownWrapper =  $(this.templates.dropdown.wrapper).appendTo(this.dropdown);

        this.settings.appendToBody ? this.dropdown.appendTo($('body')) : this.dropdown.insertBefore(this.domSelect);

        // Build dropdown
        this.dropdownList =  $(this.templates.dropdown.list).appendTo(this.dropdownWrapper);
        this.domSelect.find('option').each($.proxy(this, 'addItems'));


        // Build dropdown
        this.dropdownItem =  this.dropdown.find('.'+$(this.templates.dropdown.item).attr('class'));

        // Add classes for dropdown
        this.dropdownItem.filter(':first-child').addClass('first');
        this.dropdownItem.filter(':last-child').addClass('last');

        this.addOptionGroup();

        // Add placeholder value by selected option
        this.setSelectValue(this.getSelectedItem().text());
        this.updateDropdownPosition();

        // Set current item form option:selected
        this.currentItemOfDomSelect = this.currentItemOfDomSelect || this.domSelect.find('option:selected');

    }

    CoreUISelect.prototype.hideDomSelect = function() {
        this.domSelect.addClass('b-core-ui-select__select_state_hide');
    }

    CoreUISelect.prototype.showDomSelect = function() {
        this.domSelect.removeClass('b-core-ui-select__select_state_hide') ;
    }

    CoreUISelect.prototype.simulateShowedDomSelect = function () {
       this.domSelect.css(
            {
                'position' : 'absolute',
                'top' : this.select.position().top,
                'left' : this.select.position().left,
                'height' : this.select.height(),
                'width' : this.select.innerWidth(),
                'opacity' : 0,
                'z-index' : -1
            });
       return this;
    }

    CoreUISelect.prototype.bindUIEvents = function() {
        // Bind plugin elements
        this.domSelect.bind('focus', $.proxy(this, 'onFocus'));
        this.domSelect.bind('blur', $.proxy(this, 'onBlur'));

        if( $.browser.mobile) this.domSelect.bind('change', $.proxy(this, 'changeDropdownData'));
        this.select.bind('click', $.proxy(this, 'onSelectClick'));
        this.dropdownItem.bind('click', $.proxy(this, 'onDropdownItemClick'));
    }



    CoreUISelect.prototype.getCurrentIndexOfItem = function(__item) {
        return this.domSelect.find('option').index($(this.domSelect).find('option:selected'));
    }

    CoreUISelect.prototype.scrollToCurrentDropdownItem = function(__item) {
        if(this.dropdownWrapper.data('jsp')) {
            this.dropdownWrapper.data('jsp').scrollToElement(__item);
            return this;
        }
        // Alternative scroll to element
        $(this.dropdownWrapper)
            .scrollTop($(this.dropdownWrapper)
            .scrollTop() + __item.position().top - $(this.dropdownWrapper).height()/2 + __item.height()/2);
    }

    CoreUISelect.prototype.buildJScrollPane = function() {
        this.dropdownWrapper.wrap($('<div class="j-scroll-pane"></div>'));
    }

    CoreUISelect.prototype.isJScrollPane = function() {
        if(this.settings.jScrollPane) {
            if($.fn.jScrollPane) return true;
            else throw new Error('jScrollPane no found');
        }
    }

    CoreUISelect.prototype.initJScrollPane = function () {
        this.dropdownWrapper.jScrollPane(this.settings.jScrollPane);
    }

    CoreUISelect.prototype.showDropdown = function() {
        this.domSelect.focus();
        this.settings.onOpen && this.settings.onOpen.apply(this, [this.domSelect, 'open']);
        if($.browser.mobile) return this;
        if(!this.isSelectShow) {
            this.isSelectShow = true;
            this.dropdown.addClass('show').removeClass('hide');
            if(this.isJScrollPane) this.initJScrollPane();
            this.scrollToCurrentDropdownItem(this.dropdownItem.eq(this.getCurrentIndexOfItem()));
            this.updateDropdownPosition();
        }
    }

    CoreUISelect.prototype.hideDropdown = function() {
        if(this.isSelectShow) {
            this.isSelectShow = false;
            this.dropdown.removeClass('show').addClass('hide');
            this.settings.onClose && this.settings.onClose.apply(this, [this.domSelect, 'close']);
        } else {
            if(this.isSelectFocus) {
                this.domSelect.focus();
            }
        }
    }

    CoreUISelect.prototype.hideAllDropdown = function() {
        for(var i in allSelects) {
            if(allSelects[i].hasOwnProperty(i)) {
                allSelects.dropdown.isSelectShow = false;
                allSelects.dropdown.domSelect.blur();
                allSelects.dropdown.addClass('hide').removeClass('show');
            }
        }
    }

    CoreUISelect.prototype.changeDropdownData = function(event) {
        if((this.isSelectShow || this.isSelectFocus)) {
            this.prevItemOfDomSelect = this.currentItemOfDomSelect;
            this.currentItemOfDomSelect = this.domSelect.find('option:selected');
            this.dropdownItem.removeClass("selected");
            this.dropdownItem.eq(this.domSelect.find('option').index($(this.domSelect).find('option:selected'))).addClass("selected");
            this.scrollToCurrentDropdownItem(this.dropdownItem.eq(this.getCurrentIndexOfItem()));
            this.setSelectValue(this.currentItemOfDomSelect.text());
            this.onDomSelectChange();
        }
        if( $.browser.mobile) this.settings.onChange && this.settings.onChange.apply(this, [this.domSelect, 'change']);;
    }

    CoreUISelect.prototype.onDomSelectChange = function() {
        if(this.prevItemOfDomSelect.val()!=this.currentItemOfDomSelect.val() && !$.browser.mobile) {
            dispatchEvent(this.domSelect.get(0), 'change');
            this.settings.onChange && this.settings.onChange.apply(this, [this.domSelect, 'change']);
        }
    }

    CoreUISelect.prototype.addListenerByServicesKey = function(event) {
        if(this.isSelectShow) {
            switch (event.which) {
                case 9:   // TAB
                case 13:  // ESQ
                case 27:  // ENTER
                    this.hideDropdown();
                    break;
            }
        }
    }

    CoreUISelect.prototype.onSelectClick = function() {
        if(!this.isSelectShow) this.showDropdown();
        else this.hideDropdown();
        return false;
    }

    CoreUISelect.prototype.onFocus = function () {
        this.isDocumentMouseDown = false;
        this.isSelectFocus = true;
        this.select.addClass('focus');
        this.settings.onFocus && this.settings.onFocus.apply(this, [this.domSelect, 'focus']);
    }

    CoreUISelect.prototype.onBlur = function() {
        if(!this.isDocumentMouseDown) {
            this.isSelectFocus = false;
            this.select.removeClass('focus');
            this.settings.onBlur && this.settings.onBlur.apply(this, [this.domSelect, 'blur']);
            this.hideDropdown();
        }
    }

    CoreUISelect.prototype.onDropdownItemClick = function(event) {
        var item = $(event.currentTarget);
        if(!(item.hasClass('disabled') || item.hasClass('selected'))) {
            this.domSelect.find('option').removeAttr('selected');
            this.domSelect.find('option').eq(item.index()).attr('selected', true);
            this.dropdownItem.removeClass('selected');
            this.dropdownItem.eq(item.index()).addClass('selected');
            this.prevItemOfDomSelect = this.domSelect.find('option:selected');
            this.setSelectValue(this.getSelectedItem().text());
            this.onDomSelectChange();
        }
        this.hideDropdown();
        return false;
    }


    CoreUISelect.prototype.onDocumentMouseDown = function(event) {
        this.isDocumentMouseDown = true;
        if($(event.target).closest(this.select).length == 0 && $(event.target).closest(this.dropdown).length== 0) {
            if($(event.target).closest('option').length==0) {  // Hack for Opera
                this.isDocumentMouseDown = false;
                this.hideDropdown();
            }
        }
        return false;
    }

    CoreUISelect.prototype.updateDropdownPosition = function() {
        if(this.isSelectShow) {
            this.dropdown.css({
                'position' : 'absolute',
                'top' : this.select.position().top+this.select.innerHeight(),
                'left' : this.select.position().left,
                'z-index' : '9999'
            });
            var marginDifference = 0;
            if(parseFloat(this.dropdown.css('margin-left'))!=0) marginDifference+=parseFloat(this.dropdown.css('margin-left'))
            if(parseFloat(this.dropdown.css('margin-right'))!=0) marginDifference+=parseFloat(this.dropdown.css('margin-right')) ;
            if(parseFloat(this.dropdown.css('padding-right'))!=0) marginDifference+=parseFloat(this.dropdown.css('padding-right'));
            if(parseFloat(this.dropdown.css('padding-left'))!=0) marginDifference+=parseFloat(this.dropdown.css('padding-left'));
            this.dropdown.width(this.select.innerWidth()-marginDifference);
            if(this.isJScrollPane) this.initJScrollPane();
        }
    }

    CoreUISelect.prototype.setSelectValue = function(_text) {
        this.selectValue.text(_text);
    }

    CoreUISelect.prototype.isOptionGroup = function() {
        return this.domSelect.find('optgroup').length>0;
    }

    CoreUISelect.prototype.addOptionGroup = function() {
        var optionGroup = this.domSelect.find('optgroup');
        for(var i=0; i<optionGroup.length; i++) {
            var index = this.domSelect.find("option").index($(optionGroup[i]).find('option:first-child'))
            $(this.templates.dropdown.optionLabel)
                .text($(optionGroup[i]).attr('label'))
                .insertBefore(this.dropdownItem.eq(index));
        }
    }

    CoreUISelect.prototype.addItems = function(index, el) {
        var el = $(el);
        var item = $(this.templates.dropdown.item).text(el.text());
        if(el.attr("disabled")) item.addClass('disabled');
        if(el.attr("selected")) {
            this.domSelect.find('option').removeAttr('selected');
            item.addClass('selected');
            el.attr('selected', 'selected');
        }
        item.appendTo(this.dropdownList);
    }

    CoreUISelect.prototype.getSelectedItem = function() {
        return this.dropdown.find('.selected').eq(0);
    }

    CoreUISelect.prototype.update = function() {
        this.destroy();
        this.init();
    }

    CoreUISelect.prototype.destroy = function() {

        // Unbind plugin elements
        this.domSelect.unbind('focus', $.proxy(this, 'onFocus'));
        this.domSelect.unbind('blur', $.proxy(this, 'onBlur'));
        this.domSelect.unbind('change', $.proxy(this, 'changeDropdownData'));
        this.select.unbind('click', $.proxy(this, 'onSelectClick'));
        this.dropdownItem.unbind('click', $.proxy(this, 'onDropdownItemClick'));
        // Remove select container
        this.select.remove();
        this.dropdown.remove();
        this.showDomSelect();
        this.settings.onDestroy && this.settings.onDestroy.apply(this, [this.domSelect, 'destroy']);
    }


    $.fn.сoreUISelect = function(__options, __templates) {
        return this.each(function () {
            var select = $(this).data('сoreUISelect');
            if(select){
                __options = (typeof __options == "string" && select[__options]) ? __options : 'update';
                select[__options].apply(select);

                if(__options == 'destroy') {
                    $(this).removeData('сoreUISelect');
                    for(var i=0; i<allSelects.length; i++) {
                        if(allSelects[i] == select) {
                            allSelects.splice(i, 1);
                            break;
                        }
                    }
                }
            } else {
                select = new CoreUISelect($(this), __options, __templates);
                allSelects.push(select);
                $(this).data('сoreUISelect', select);
            }

        });
    };

    function dispatchEvent(obj, evt, doc) {
        var doc = doc || document;
        if(obj!==undefined || obj!==null) {
            if (doc.createEvent) {
                var evObj = doc.createEvent('MouseEvents');
                evObj.initEvent(evt, true, false);
                obj.dispatchEvent(evObj);
            } else if (doc.createEventObject) {
                var evObj = doc.createEventObject();
                obj.fireEvent('on' + evt, evObj);
            }
        }
    }

    $(document).bind('keyup', function(event){
        for(var i=0; i<allSelects.length; i++){
            if($.browser.safari) allSelects[i].changeDropdownData(event); // Hack for Safari
            allSelects[i].addListenerByServicesKey(event);
        }
    });

    $(document).bind($.browser.safari && !$.browser.opera ? 'keydown' : 'keypress', function(event){
        for(var i=0; i<allSelects.length; i++){
            allSelects[i].changeDropdownData(event);
        }
    });

    $(window).bind('resize', function(event){
        for(var i=0; i<allSelects.length; i++){
            allSelects[i].updateDropdownPosition(event);
        }
    });

    $(document).bind('mousedown', function(event){
        for(var i=0; i<allSelects.length; i++){
            allSelects[i].onDocumentMouseDown(event);
        }
    });

})(jQuery);
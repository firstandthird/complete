(function($){

  function escapeString (value) {
    return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  $.declare('complete',{
    defaults : {
      search : function(suggestion, queryOriginal, queryLowerCase){
        return this._getSuggestion(suggestion).toLowerCase().indexOf(queryLowerCase.toLowerCase()) !== -1;
      },
      listClass : 'complete',
      suggestionActiveClass : 'complete-active',
      suggestionClass : 'complete-suggestion',
      maxHeight : 300,
      minChars : 0,
      zIndex : 99999,
      delay : 300,
      allowOthers : false,
      sourceKey : null,
      formatSuggestion : function(suggestion, value){
        var pattern = '(' + escapeString(value) + ')';
        return this._getSuggestion(suggestion).replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
      },
      query : function(query, callback){
        var queryLower = query.toLowerCase(), self = this;

        var suggestions = $.grep(this.source, function(suggestion){
          return self.search(suggestion, query, queryLower);
        });

        callback.call(this,suggestions);
      }
    },
    events : {
      'keydown' : 'keyPressed',
      'keyup' : 'keyUp',
      'blur' : 'onBlur',
      'focus' : 'onFocus'
    },
    keyCode : {
      UP : 38,
      DOWN : 40,
      TAB: 9,
      ENTER : 13,
      ESC : 27
    },
    init : function(){
      $(this.el).attr('autocomplete', 'off');
      this.createListHolder();
      this.visible = false;
      this.currentValue = this.el.value;
      this.selectedIndex = -1;
      this.suggestions = [];
    },
    _getSuggestion : function (suggestion) {
      var value;

      if (!!this.sourceKey && suggestion && suggestion[this.sourceKey]){
        value = suggestion[this.sourceKey];
      }
      else {
        value = suggestion;
      }

      return value;
    },
    debounce : function(func) {
      var self = this;
      var args = arguments;

      if(this.delay > 0) {
        clearTimeout(this.debounceTimeout);

        this.debounceTimeout = setTimeout(function(){
          func.apply(self, args);
        }, this.delay);
      } else {
        func.apply(this, args);
      }
    },
    createListHolder : function(){
      var $el = $(this.el);
      this.listHolder = $('<div>').addClass(this.listClass).hide().insertAfter($el);
      this.list= $('<ul>');
      this.list.appendTo(this.listHolder);

      $(this.listHolder).css({
        "width" : $el.outerWidth(),
        "top" : $el.position().top + $el.outerHeight(),
        "left" : $el.position().left,
        "max-height" : this.maxHeight,
        "z-index" : this.zIndex
      });

      this.bindEventsList();
    },
    updatePosition: function() {
      var $el = $(this.el);
      $(this.listHolder).css({
        "top" : $el.position().top + $el.outerHeight(),
        "left" : $el.position().left,
      });
    },
    bindEventsList : function(){
      var $list = $(this.list),
          self = this;
      $list.on('mouseover', 'li', function(e){
        var target = self._getTarget(e);
        self.activateSuggestion.apply(self, [target.data('index')]);
      });
      $list.on('mouseout', 'li', this.proxy(this.deActivateSuggestion,this));
      $list.on('click', 'li', this.proxy(this.selectSuggestion,this));
    },
    keyPressed : function(event){
      switch(event.keyCode){
        case this.keyCode.UP :
          this._prevSuggestion();
          break;
        case this.keyCode.DOWN :
          this._nextSuggestion();
          break;
        case this.keyCode.ESC :
          this.el.val(this.currentValue);
          this.hide();
          break;
        case this.keyCode.TAB:
        case this.keyCode.ENTER:
          this.selectSuggestion(event);
          break;
        default:
          return;
      }

      event.stopImmediatePropagation();
      event.preventDefault();
    },
    keyUp : function(event){
      switch(event.keyCode){
        case this.keyCode.UP :
        case this.keyCode.DOWN :
          return;
      }
      this._generatedSuggestions = false;
      this.debounce(this.valueChanged);
    },
    onBlur : function(){
      $(document).on('click.complete', this.proxy(this.onClickWA,this));
    },
    onFocus: function() {
      this.updatePosition();
    },
    onClickWA : function(event){
      if ($(event.target).closest('.' + this.listClass).length === 0) {
        this.hide();
        $(document).off('click.complete');
      }
    },
    valueChanged : function(){
      if (this._getSuggestion(this.currentValue) !== $(this.el).val()){
        this.el.value = $.trim($(this.el).val());
        this.currentValue = this.el.value;
        this.selectedIndex = -1;

        if (this.currentValue.length > this.minChars){
          this.show();
        }
        else {
          this.hide();
        }
      }
      this._generatedSuggestions = true;
    },
    _getSuggestions : function(query){
      var queryLower = query.toLowerCase(), self = this;

      return $.grep(this.source, function(suggestion){
        return self.search(suggestion, query, queryLower);
      });
    },
    _nextSuggestion : function(){
      var index = this.selectedIndex;

      if (!this.visible && this.currentValue){
        this.show();
      }
      else if (index !== (this.suggestions.length - 1)) {
        this._adjustPosition(index + 1);
      }
    },
    _prevSuggestion : function(){
      var index = this.selectedIndex;

      if (index !== -1) {
        this._adjustPosition(index -1);
      }
    },
    _adjustPosition : function(index){
      var selected = this.activateSuggestion(index),
          selTop, upperLimit, lowerLimit, elementHeight,
          listHolder = $(this.listHolder);

      if (selected){
        selTop = selected.offsetTop;
        upperLimit = listHolder.scrollTop();
        elementHeight = $(this.list).children().first().outerHeight();
        lowerLimit = upperLimit + this.maxHeight - elementHeight;

        if (selTop < upperLimit){
          listHolder.scrollTop(selTop);
        }
        else if (selTop > lowerLimit){
          listHolder.scrollTop(selTop - this.maxHeight + elementHeight);
        }

        $(this.el).val(this._getSuggestion(this.suggestions[index]));
      }
    },
    hide : function(){
      this.visible = false;
      $(this.listHolder).hide();
    },
    show : function(){
      var self = this;

      this.query.call(self, this.currentValue, function(suggestions){
        if (suggestions && $.isArray(suggestions) && suggestions.length){
          self.visible = true;
          var value = self.currentValue,
              className = self.suggestionClass,
              html = '';

          self.suggestions = [];
          self.suggestions = suggestions;

          $.each(suggestions, function(i, suggestion){
            html += '<li class="'+ className +'" data-index="' + i +'">' + self.formatSuggestion(suggestion,value) + '</li>';
          });

          $(self.list).html(html);
          $(self.listHolder).show();
        }
        else {
          $(self.list).empty();
          self.suggestions = [];
          self.hide();
        }
      });
    },
    activateSuggestion : function(index){
      var classSelected = this.suggestionActiveClass,
          list = $(this.list);

      list.children('.' + classSelected).removeClass(classSelected);
      this.selectedIndex = index;

      if (index !== -1 && list.children().length > index){
        return $(list.children().get(index)).addClass(classSelected);
      }
    },
    deActivateSuggestion : function(e){
      this._getTarget(e).removeClass(this.suggestionActiveClass);
      this.selectedIndex = -1;
    },
    selectSuggestion : function(event){
      // If the user hits enter before the debounce finishes, we force a generation of the suggestions
      if(!this._generatedSuggestions){
        this.valueChanged();
      }

      if (event.type === "keydown" && this.allowOthers && this.selectedIndex < 0){
        var firstSuggestion = this._getSuggestion(this.suggestions[0]);

        if (this.suggestions.length === 1 && firstSuggestion === this.currentValue){
          this.currentValue = this.suggestions[0];
          $(this.el).val(this._getSuggestion(this.currentValue));
        }
        else {
          $(this.el).val(this.currentValue);
        }

        this.emit('complete:select',this.currentValue);
        this.hide();
      }
      else {
        if (this.selectedIndex === -1){
          this.selectedIndex = 0;
        }

        if (this.suggestions[this.selectedIndex]){
          $(this.el).val(this._getSuggestion(this.suggestions[this.selectedIndex]));
          this.currentValue = this.suggestions[this.selectedIndex];
          this.emit('complete:select',this.currentValue);
          this.hide();
        }
      }
    },
    _getTarget : function(e){
      return $(e.currentTarget || e.toElement);
    },
    setSource: function(source){
      this.source = source;
    }
  });
})(jQuery);

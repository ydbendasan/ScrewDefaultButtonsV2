/*!
 * ScrewDefaultButtons v2.0.6
 * http://screwdefaultbuttons.com/
 *
 * Licensed under the MIT license.
 * Copyright 2013 Matt Solano http://mattsolano.com
 *
 * Date: Mon February 25 2013
 */

;(function( $, window, document, undefined ){
	
	var methods = {
		
		init : function(options) {
		
			var defaults = $.extend( {
				image:	null,
				width:	50,
				height: 50,
				col:1,
				disabled: false
			}, options);
			
			return this.each(function(){
			
			    var leftPos = -1 * (defaults.col - 1) * defaults.width;
			    var uncheckedPos = 0;
			    var checkedPos = -(defaults.height);
			    
				var $this = $(this);

				var $thisImage = $this.css('background-image');
			    if (defaults.image) {
			        $thisImage = defaults.image;
			    }
			    var dataImage = $this.data('sdb-image');
				if (dataImage){
					$thisImage = dataImage;
				}

				if (!$thisImage){
					$.error( 'There is no image assigned for ScrewDefaultButtons' );
				}

				$this.wrap('<div >').css({'display': 'none'});

				var buttonClass = $this.attr('class');
				var buttonClick = $this.attr('onclick');

				var $thisParent = $this.parent('div');

				$thisParent.addClass(buttonClass);
				$thisParent.attr('onclick',buttonClick );
			    $thisParent.css({
			        'background-image': $thisImage,
			        width: defaults.width,
			        height: defaults.height,
			        cursor: 'pointer'
			    }).css({ backgroundPosition: leftPos + 'px 0' });

				if ($this.is(':disabled')){
					uncheckedPos = -(defaults.height * 2);
					checkedPos = -(defaults.height * 3);
				}

				$this.on('disableBtn', function(){
					$this.attr('disabled', 'disabled');
					uncheckedPos = -(defaults.height * 2);
					checkedPos = -(defaults.height * 3);
					$this.trigger('resetBackground');
				});

				$this.on('enableBtn', function(){
					$this.removeAttr('disabled');
					uncheckedPos = 0;
					checkedPos = -(defaults.height);
					$this.trigger('resetBackground');
				});

				$this.on('resetBackground', function(){
					if ($this.is(':checked')){
						$thisParent.css({
						    backgroundPosition: leftPos + 'px ' + checkedPos + "px"
						});
					}
					else {
						$thisParent.css({
						    backgroundPosition: leftPos + 'px ' + uncheckedPos + "px"
						});
					}
				});
				
				$this.trigger('resetBackground');

				if ($this.is(':checkbox')){

					$thisParent.on('click', function(){
						if (!($this.is(':disabled'))){
							$this.change();
						}
					});
					
					$thisParent.addClass('styledCheckbox');
					
					$this.on('change', function(){
						if ($this.prop('checked')){
							$this.prop("checked", false);
							$thisParent.css({
							    backgroundPosition: leftPos + 'px ' + uncheckedPos + "px"
							});
						}
						else {
							$this.prop("checked", true);
							$thisParent.css({
							    backgroundPosition: leftPos + 'px ' + checkedPos + "px"
							});
						}
					});
					
				}
				else if ($this.is(':radio')) {
				
					$thisParent.addClass('styledRadio');
					
					var $thisName = $this.attr('name');
					
					$thisParent.on('click', function(){
						if (!($this.prop('checked')) && !($this.is(':disabled'))){
							$this.change();
						}
					});
					
					
					$this.on('change', function(){
						if ($this.prop('checked')){
							$this.prop("checked", false);
								$thisParent.css({
								    backgroundPosition: leftPos + 'px ' + uncheckedPos + "px"
								});
						}
						else {
							$this.prop("checked", true);
								$thisParent.css({
								    backgroundPosition: leftPos + 'px ' + checkedPos + "px"
								});
							
							var otherRadioBtns = $('input[name="'+ $thisName +'"]').not($this);
							otherRadioBtns.trigger('radioSwitch');
						}
					});
					
					$this.on('radioSwitch', function(){
						$thisParent.css({
						    backgroundPosition: leftPos + 'px ' + uncheckedPos + "px"
						});
					
					});
					
					var $thisId = $(this).attr('id');
					var $thisLabel = $('label[for="' + $thisId + '"]');
					$thisLabel.on('click', function(){
						$thisParent.trigger('click');
					});
				} else if ($this.is(':button')) {
				    var states = $this.data("states").split(';');
				    var curState = jQuery.inArray($this.val(), states);
				    if (curState < 0) {
				        curState = 0;
				        $this.val(states[curState]);
				    }
				    var curPosition = -1 * curState * defaults.height;
				    $thisParent.css({
				        backgroundPosition: leftPos + 'px ' + curPosition + "px"
				    });

				    $thisParent.addClass('styledButton');

				    $thisParent.on('click', function () {
				        if (!($this.is(':disabled'))) {
				            $this.change();
				        }
				    });


				    $this.on('change', function () {

				        curState++;// = curState++ % states.length;
				        curState = curState % states.length;
				        $this.val(states[curState]);

				        curPosition = -1 * curState * defaults.height;
				        $thisParent.css({
				            backgroundPosition: leftPos + 'px ' + curPosition + "px"
				        });


				    });

				}
				
				if(!$.support.leadingWhitespace){
					var $thisId = $(this).attr('id');
					var $thisLabel = $('label[for="' + $thisId + '"]');
					$thisLabel.on('click', function(){
						$thisParent.trigger('click');
					});
				}
				
			});
			
		},
		check : function() {
			return this.each(function(){
				var $this = $(this);
				if (!methods.isChecked($this)){
					$this.change();
				}
			});
		},
		uncheck : function() {
			return this.each(function(){
				var $this = $(this);
				if (methods.isChecked($this)){
					$this.change();
				}
			});
		},
		toggle: function(){
			return this.each(function(){
				var $this = $(this);
				$this.change();
			});
		},
		disable : function() {
			return this.each(function(){
				var $this = $(this);
				$this.trigger('disableBtn');
			});
		},
		enable: function(){
			return this.each(function(){
				var $this = $(this);
				$this.trigger('enableBtn');
			});
		},
		isChecked: function($this){
				if ($this.prop('checked')){
					return true;
				}
				return false;
		}
	};
	
	$.fn.screwDefaultButtons = function( method, options) {
		
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.screwDefaultButtons' );
		}

	};
	
	return this;
	
})( jQuery );
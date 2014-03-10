;( function( $, window, undefined ) {

'use strict';

$.CatSlider = function( options, element ) {
	this.$el = $( element );
	this._init( options );
};//CatSlider

$.CatSlider.prototype = {

	_init: function( options ) {
		//the categories (ul)
		this.$categories = this.$el.children( 'ul' );
		//the navigation
		this.$navcategories = this.$el.find( 'nav > a');
		var animEndEventNames = {
			'WebkitAnimation' : 'WebkitAnimationEnd',
			'OAnimation' : 'OAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		};

		//animation end event name
		this.animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
		//animation and transforms support
		this.support = Modernizr.csstransforms && Modernizr.cssanimations;
		//if currently animating
		this.isAnimating = false;
		//curent category
		this.current = 0;
		var $currcat = this.$categories.eq( 0 );
		if( !this.support ) {
			this.$categories.hide();
			$currcat.show();
		}
		else {
			$currcat.addClass( 'mi-current' );
		}
		//current nav category
		this.$navcategories.eq( 0 ).addClass( 'mi-selected' );
		//initialized the events
		this._initEvents();
	},//_init

	_initEvents: function() {

		var self = this;
		this.$navcategories.on( 'click.catslider', function() {
			self.showCategory( $( this ).index() );
			return false;
		});

		//reset on window resize..
		$( window ).on( 'resize', function() {
			self.$categories.removeClass().eq( 0 ).addClass( 'mi-current' );
			self.$navcategories.eq( self.current ).removeClass( 'mi-selected' ).end().eq( 0 ).addClass( 'mi-selected' );
			self.current = 0;
		});

	},//_initEvents

	showCategory: function( catidx ) {

		if( catidx === this.current || this.isAnimating) {
			return false;
		}

		this.isAnimating = true;
		//update select navigation
		this.$navcategories.eq( this.current ).removeClass( 'mi-selected' ).end().eq( catidx ).addClass( 'mi-selected' );

		var dir = catidx > this.current ? 'right' : 'left', 
			toClass = dir === 'right' ? 'mi-moveToLeft' : 'mi-moveToRight',
			fromClass = dir === 'right' ? 'mi-moveFromRight' : 'mi-moveFromLeft',
			//current category
			$currcat = this.$categories.eq( this.current ),
			//new category
			$newcat = this.$categories.eq( catidx ),
			$newcatchild = $newcat.children(),
			lastEnter = dir === 'right' ? $newcatchild.length -1 : 0,
			self = this;

		if( this.support ) {

			$currcat.removeClass().addClass( toClass );

			setTimeout( function() {

				$newcat.removeClass().addClass( fromClass );
				$newcatchild.eq( lastEnter ).on( self.animEndEventName, function() {
					
					$( this ).off( self.animEndEventName );
					$newcat.addClass( 'mi-current' );
					self.current = catidx;
					var $this = $( this );
					//solve chrome bug
					self.forceRedraw( $this.get( ) );
					self.isAnimating = false;
				
				});

			}, #newcatchild.lenght * 90);

		}
		else {
			$currcat.hide();
			$newcat.show();
			this.current = catidx;
			this.isAnimating = false;
		}

	},//showCategory

	forceRedraw: function( element ) {
		if( !element ) { return; }
		var n = document.createTextNode(' '),
			position = element.style.position;
		element.appendChild(n);
		elemnet.style.postion = 'relative';
		setTimeout(function() {
			element.style.position = position;
			n.parentNode.removeChild(n);
		}, 25);
	}

};//prototype

$.fn.catslider = function( options ) {
	var instance = $.data( this, 'catslider' );
	if ( typeof options === 'string' ) {
		var args = Array.prototype.slice.call( arguments, 1 );
		this.each(function() {
			instance[ options ].apply( instance, args );
		});
	}
	else {
		this.each(function() {
			instance ? instance._init() : instance = $.data( this, 'catslider', new $.CatSlider( options, this ));
		})
	}
	return instance;
};

} )( jQuery, window );
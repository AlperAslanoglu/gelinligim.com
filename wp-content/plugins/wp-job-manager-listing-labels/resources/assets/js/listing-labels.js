/**
 * Filter by labels.
 *
 * @since 2.0.0
 */
(function( window, undefined ) {

	window.wp = window.wp || {};

	var document = window.document;
	var $ = window.jQuery;

	/**
	 * @since 2.0.0
	 */
	var $document = $(document);

	/**
	 * Store selected labels in browser state.
	 *
	 * @since 2.0.0
	 */
	var saveState = function( target, page ) {
		var location = document.location.href.split('#')[0];
		var $supports_html5_history = false;

		if ( window.history && window.history.pushState ) {
			$supports_html5_history = true;
		}

		if ( $supports_html5_history ) {
			var form  = target.find( '.job_filters' );
			var data  = $( form ).serialize();
			var index = $( 'div.job_listings' ).index( target );

			window.history.replaceState({ 
				id: 'job_manager_state', 
				page: page, 
				data: data, 
				index: index 
			}, '', location + '#s=1' );
		}
	};

	/**
	 * Get a parameter from the saved browser state.
	 *
	 * @since 2.0.0
	 *
	 * @param {string} string Full state string.
	 * @param {string} string Param to find.
	 * @return {string}
	 */
	var getParameter = function( string, param ){
		var sPageURL = decodeURIComponent( string ),
			sURLVariables = sPageURL.split('&'),
			sParameterName = [],
			output = [],
			i;

		for ( i = 0; i < sURLVariables.length; i++ ) {
			sParameterName = sURLVariables[i].split('=');

			if ( sParameterName[0] === param && sParameterName[1] !== undefined ) {
				output.push( sParameterName[1] );
			}
		}

		return output;
	};

	/**
	 * Wait for DOM ready.
	 *
	 * @since 2.0.0
	 */
	$document.ready(function() {
		// Set all auto-selected label cloud to active.
		$( '.astoundify-listing-labels input[name="listing_label[]"]' ).each( function() {
			$( '.astoundify-listing-labels' ).find( 'a:contains(' + $( this ).val() + ')' ).addClass( 'active' );
		});

		// Check current state and update hidden fields.
		if ( window.history.state && window.location.hash ) {
			var state = window.history.state;

			if ( undefined !== state.id && undefined !== state.data && 'job_manager_state' === state.id ) {
				var listing_labels = getParameter( state.data, 'listing_label[]' );

				$.each( listing_labels, function( index, value ) {
					if ( 0 === $( 'input[name="listing_label"][value="' + value + '"]' ).length > 0 ) {
						$( '.astoundify-listing-labels' ).append( '<input type="hidden" name="listing_label[]" value="' + value + '" />' );
					}
				});

				$( 'div.job_listings' ).trigger( 'update_results', [ 1, false ] );
			}
		}

		$( '.job_listings' )

			.on( 'load', '.astoundify-listing-labels a', function() {
				var $selectedLabels = $( '.astoundify-listing-labels' ).find('input[value="' + label + '"]');
			})

			// Monitor clicking of a label.
			.on( 'click', '.astoundify-listing-labels a', function() {
				var $link = $(this);
				var label = $(this).text();
				var $selectedLabels = $( '.astoundify-listing-labels' ).find('input[value="' + label + '"]');

				console.log($selectedLabels);

				if ( $selectedLabels.length > 0 ) {
					$selectedLabels.remove();
					$link.removeClass( 'active' );
				} else {
					$( '.astoundify-listing-labels' ).append( '<input type="hidden" name="listing_label[]" value="' + label + '" />' );
					$link.addClass( 'active' );
				}

				var target = $(this).closest( 'div.job_listings' );

				target.trigger( 'update_results', [ 1, false ] );

				// Update state.
				saveState( $( '.job_listings' ), 1 );

				return false;
			})

			// Monitor reset link.
			.on( 'reset', function() {
				$( '.astoundify-listing-labels a.active', this ).removeClass( 'active' );
				$( '.astoundify-listing-labels input', this ).remove();
			})

			// Once results are sent back update tag cloud.
			.on( 'updated_results', function( event, results ) {
				var labels = results.listing_labels_filter;

				if ( labels ) {
					var $target = $(this);

					$target.find( '.astoundify-listing-labels-cloud' ).html( labels );
					$target.find( '.astoundify-listing-labels' ).show();

					$target.find( '.astoundify-listing-labels input' ).each(function(){
						var val = $(this).val();

						$target.find( '.astoundify-listing-labels a:contains(' + val + ')' ).addClass( 'active' );
					});
				} else {
					$(this).find( '.astoundify-listing-labels' ).hide();
				}
			})

			// Update labels when categories change.
			.on( 'change', '#search_categories', function() {
				var target = $( this ).closest( 'div.job_listings' );

				target.find( '.astoundify-listing-labels input' ).remove();
				target.trigger( 'update_results', [ 1, false ] );
			});
	});

}( window ));
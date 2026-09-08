<?php
/**
 * Manage translations in Listify.
 *
 * To avoid making users translate Listify and the WP Job Manager plugin
 * (which contains a lot of irrelevant strings) we can add each of the
 * plugin's strings to Listify's manifest.
 *
 * @since 1.0.0
 *
 * @package Listify
 * @category i18n
 * @author Astoundify
 */

// @codingStandardsIgnoreFile
class Listify_Strings {

	/**
	 * Registered strings.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public $strings;

	/**
	 * Singular and plural labels.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public $labels;

	/**
	 * Whitelist of text domains.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public $domains;

	/**
	 * Hook in to WordPress.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		if ( ! apply_filters( 'listify_use_custom_strings', true ) ) {
			return;
		}

		add_action( 'after_setup_theme', array( $this, 'setup' ) );
	}

	/**
	 * Register whitelisted domains, strings, and labels.
	 *
	 * @since 1.0.0
	 */
	public function setup() {
		$this->labels = array(
			'singular' => get_theme_mod( 'label-singular', 'Listing' ),
			'plural'   => get_theme_mod( 'label-plural', 'Listings' ),
		);

		$this->strings = $this->get_strings();

		$this->domains = apply_filters(
			'listify_gettext_domains', array(
				'wp-job-manager',
				'wp-job-manager-alerts',
				'wp-job-manager-locations',
				'wp-job-manager-wc-paid-listings',
				'wp-job-manager-simple-paid-listings',
				'wp-job-manager-extended-location',
			)
		);

		$this->translations = get_translations_for_domain( 'listify' );

		add_filter( 'gettext', array( $this, 'gettext' ), 0, 3 );
		add_filter( 'gettext_with_context', array( $this, 'gettext_with_context' ), 0, 4 );
		add_filter( 'ngettext', array( $this, 'ngettext' ), 0, 5 );
	}

	/**
	 * Get a label depending on the chosen form (plural or singular).
	 *
	 * @since 1.0.0
	 *
	 * @param string $form Singular or plural.
	 * @param bool   $slug Create a slug from the noun.
	 * @return string
	 */
	public function label( $form, $slug = false ) {
		$label = $this->labels[ $form ];

		if ( '' === $label && 'plural' === $form ) {
			$label = 'Listings';
		} elseif ( '' === $label && 'singular' === $form ) {
			$label = 'Listing';
		}

		if ( ! $slug ) {
			return $label;
		}

		return sanitize_title( $label );
	}

	/**
	 * Translate a string.
	 *
	 * @since 1.0.0
	 *
	 * @param string $string The string to translate.
	 * @return string
	 */
	private function translate_string( $string ) {
		$value = $string;
		$array = is_array( $value );

		$to_translate = $array ? $value[0] : $value;

		$translated = $this->translations->translate( $to_translate );

		if ( ! $translated ) {
			return $string;
		}

		if ( $array ) {
			$translated = vsprintf( $translated, $value[1] );
		}

		return $translated;
	}

	/**
	 * Translate a plural string.
	 *
	 * @since 1.0.0
	 *
	 * @param string $single Single form.
	 * @param string $plural Plural form.
	 * @param int    $number The number to check.
	 * @return string
	 */
	private function translate_plural( $single, $plural, $number ) {
		$translation = $this->translations->translate_plural( $single, $plural, $number );

		return $translation;
	}

	/**
	 * Filter standard gettext calls.
	 *
	 * @since 1.0.0
	 *
	 * @param string $translated The translated string loaded from a translation file.
	 * @param string $original The original string from the .pot file.
	 * @param string $domain The text domain.
	 * @return string
	 */
	public function gettext( $translated, $original, $domain ) {
		if ( ! in_array( $domain, $this->domains, true ) ) {
			return $translated;
		}

		if ( isset( $this->strings[ $domain ][ $original ] ) ) {
			return $this->translate_string( $this->strings[ $domain ][ $original ] );
		} else {
			return $translated;
		}
	}

	/**
	 * Filter gettext calls with context.
	 *
	 * @since 1.0.0
	 *
	 * @param string $translated The translated string loaded from a translation file.
	 * @param string $original The original string from the .pot file.
	 * @param string $context The context of the original string.
	 * @param string $domain The text domain.
	 * @return string
	 */
	public function gettext_with_context( $translated, $original, $context, $domain ) {
		if ( ! in_array( $domain, $this->domains, true ) ) {
			return $translated;
		}

		if ( isset( $this->strings[ $domain ][ $original ] ) ) {
			return $this->translate_string( $this->strings[ $domain ][ $original ] );
		} else {
			return $translated;
		}
	}

	/**
	 * Filter plural gettext calls.
	 *
	 * @since 1.0.0
	 *
	 * @param string $original The original string from the .pot file.
	 * @param string $single The singular version of the string.
	 * @param string $plural The plural version of the string.
	 * @param int    $number The number to check against.
	 * @param string $domain The text domain.
	 * @return string
	 */
	public function ngettext( $original, $single, $plural, $number, $domain ) {
		if ( ! in_array( $domain, $this->domains, true ) ) {
			return $original;
		}

		if ( isset( $this->strings[ $domain ][ $single ] ) ) {
			$base   = $this->strings[ $domain ][ $single ];
			$single = $base[0];
			$plural = $base[1];

			return $this->translate_plural( $single, $plural, $number );
		} else {
			return $original;
		}
	}

	/**
	 * Create a manifest of strings.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	private function get_strings() {
		$strings = array(
			'wp-job-manager'                      => array(
				'Job'                                     => $this->label( 'singular' ),
				'Jobs'                                    => $this->label( 'plural' ),

				// Translators: %s the singular "listing" label used in permalinks". only transalte this if you are using Polylang and need to force the slugs to remain in a single language.
				'job'                                     => utf8_uri_encode( sprintf( _x( '%s', 'the singular "listing" label used in permalinks". only transalte this if you are using Polylang and need to force the slugs to remain in a single language.', 'listify' ), $this->label( 'singular', true ) ) ),

				// Translators: %s the plural "listing" label used in permalinks". only transalte this if you are using Polylang and need to force the slugs to remain in a single language.
				'jobs'                                    => utf8_uri_encode( sprintf( _x( '%s', 'the plural "listing" label used in permalinks". only transalte this if you are using Polylang and need to force the slugs to remain in a single language.', 'listify' ), $this->label( 'plural', true ) ) ),

				'Job Listings'                            => $this->label( 'plural' ),

				'Job category'                            => array(
					esc_html__( '%s Category', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job categories'                          => array(
					esc_html__( '%s Categories', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job Categories'                          => array(
					esc_html__( '%s Categories', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'job-category'                            => array(
					esc_html__( '%s-category', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),

				'Job type'                                => array(
					esc_html__( '%s Type', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job types'                               => array(
					esc_html__( '%s Types', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job Types'                               => array(
					esc_html__( '%s Types', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'job-type'                                => array(
					esc_html__( '%s-type', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),

				'Jobs will be shown if within ANY selected category' => array(
					esc_html__( '%s will be shown if within ANY selected category', 'listify' ),
					array( $this->label( 'plural' ) ),
				),
				'Jobs will be shown if within ALL selected categories' => array(
					esc_html__( '%s will be shown if within ALL selected categories', 'listify' ),
					array( $this->label( 'plural' ) ),
				),

				'Application email'                       => esc_html__( 'Contact Email', 'listify' ),
				'Application email/URL'                   => esc_html__( 'Contact Email/URL', 'listify' ),
				'Application URL'                         => esc_html__( 'Contact URL', 'listify' ),
				'Application Email or URL'                => esc_html__( 'Contact email/URL', 'listify' ),
				'Position filled?'                        => esc_html__( 'Listing filled?', 'listify' ),
				'A video about your company'              => esc_html__( 'A video about your listing', 'listify' ),

				'Job Submission'                          => array(
					esc_html__( '%s Submission', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Submit Job Form Page'                    => array(
					esc_html__( 'Submit %s Form Page', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job Dashboard Page'                      => array(
					esc_html__( '%s Dashboard Page', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job Listings Page'                       => array(
					esc_html__( '%s Page', 'listify' ),
					array( $this->label( 'plural' ) ),
				),

				'Add a job via the back-end'              => array(
					esc_html__( 'Add a %s via the back-end', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
				'Add a job via the front-end'             => array(
					esc_html__( 'Add a %s via the front-end', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
				'Find out more about the front-end job submission form' => array(
					esc_html__( 'Find out more about the front-end %s submission form', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
				'View submitted job listings'             => array(
					esc_html__( 'View submitted %s listings', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Add the [jobs] shortcode to a page to list jobs' => array(
					esc_html__( 'Add the [jobs] shortcode to a page to list %s', 'listify' ),
					array( $this->label( 'plural', true ) ),
				),
				'View the job dashboard'                  => array(
					esc_html__( 'View the %s dashboard', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
				'Find out more about the front-end job dashboard' => array(
					esc_html__( 'Find out more about the front-end %s dashboard', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),

				'Company name'                            => esc_html__( 'Company name', 'listify' ),
				'Company website'                         => esc_html__( 'Company website', 'listify' ),
				'Company tagline'                         => esc_html__( 'Company tagline', 'listify' ),
				'Brief description about the company'     => esc_html__( 'Brief description about the company', 'listify' ),
				'Company Twitter'                         => esc_html__( 'Company Twitter', 'listify' ),
				'Company logo'                            => esc_html__( 'Company logo', 'listify' ),
				'URL to the company logo'                 => esc_html__( 'URL to the company logo', 'listify' ),
				'Company video'                           => esc_html__( 'Company video', 'listify' ),

				'WP Job Manager Add-ons'                  => esc_html__( 'WP Job Manager Add-ons', 'listify' ),
				'Settings'                                => esc_html__( 'Settings', 'listify' ),
				'Add-ons'                                 => esc_html__( 'Add-ons', 'listify' ),
				'Approve %s'                              => esc_html__( 'Approve %s', 'listify' ),
				'Expire %s'                               => esc_html__( 'Expire %s', 'listify' ),
				'%s approved'                             => esc_html__( '%s approved', 'listify' ),
				'%s expired'                              => esc_html__( '%s expired', 'listify' ),
				'Select category'                         => esc_html__( 'Select category', 'listify' ),
				'Position'                                => esc_html__( 'Title', 'listify' ),
				'%s updated. View'                        => esc_html__( '%s updated. View', 'listify' ),
				'Custom field updated.'                   => esc_html__( 'Custom field updated.', 'listify' ),
				'Custom field deleted.'                   => esc_html__( 'Custom field deleted.', 'listify' ),
				'%s updated.'                             => esc_html__( '%s updated.', 'listify' ),
				'%s restored to revision from %s'         => esc_html__( '%1$s restored to revision from %2$s', 'listify' ),
				'%s published. View'                      => esc_html__( '%s published. View', 'listify' ),
				'%s saved.'                               => esc_html__( '%s saved.', 'listify' ),
				'%s submitted. Preview'                   => esc_html__( '%s submitted. Preview', 'listify' ),
				'M j, Y @ G:i'                            => esc_html__( 'M j, Y @ G:i', 'listify' ),
				'%s draft updated. Preview'               => esc_html__( '%s draft updated. Preview', 'listify' ),
				'Type'                                    => esc_html__( 'Type', 'listify' ),
				'Posted'                                  => esc_html__( 'Posted', 'listify' ),
				'Expires'                                 => esc_html__( 'Expires', 'listify' ),
				'Categories'                              => esc_html__( 'Categories', 'listify' ),
				'Featured?'                               => esc_html__( 'Featured?', 'listify' ),
				'Filled?'                                 => esc_html__( 'Filled?', 'listify' ),
				'Status'                                  => esc_html__( 'Status', 'listify' ),
				'Actions'                                 => esc_html__( 'Actions', 'listify' ),
				'ID: %d'                                  => esc_html__( 'ID: %d', 'listify' ),
				'M j, Y'                                  => esc_html__( 'M j, Y', 'listify' ),
				'by a guest'                              => esc_html__( 'by a guest', 'listify' ),
				'by %s'                                   => esc_html__( 'by %s', 'listify' ),
				'Approve'                                 => esc_html__( 'Approve', 'listify' ),
				'View'                                    => esc_html__( 'View', 'listify' ),
				'Edit'                                    => esc_html__( 'Edit', 'listify' ),
				'Delete'                                  => esc_html__( 'Delete', 'listify' ),
				'Listings Per Page'                       => esc_html__( 'Listings Per Page', 'listify' ),
				'How many listings should be shown per page by default?' => esc_html__( 'How many listings should be shown per page by default?', 'listify' ),
				'Filled Positions'                        => esc_html__( 'Filled Positions', 'listify' ),
				'Hide filled positions'                   => esc_html__( 'Hide filled positions', 'listify' ),
				'If enabled, filled positions will be hidden.' => esc_html__( 'If enabled, filled positions will be hidden.', 'listify' ),
				'Enable categories for listings'          => esc_html__( 'Enable categories for listings', 'listify' ),
				'Multi-select Categories'                 => esc_html__( 'Multi-select Categories', 'listify' ),
				'Enable category multiselect by default'  => esc_html__( 'Enable category multiselect by default', 'listify' ),
				'Category Filter Type'                    => esc_html__( 'Category Filter Type', 'listify' ),
				'Account Required'                        => esc_html__( 'Account Required', 'listify' ),
				'Submitting listings requires an account' => esc_html__( 'Submitting listings requires an account', 'listify' ),
				'Account Creation'                        => esc_html__( 'Account Creation', 'listify' ),
				'Allow account creation'                  => esc_html__( 'Allow account creation', 'listify' ),
				'Account Role'                            => esc_html__( 'Account Role', 'listify' ),
				'Approval Required'                       => esc_html__( 'Approval Required', 'listify' ),
				'New submissions require admin approval'  => esc_html__( 'New submissions require admin approval', 'listify' ),
				'If enabled, new submissions will be inactive, pending admin approval.' => esc_html__( 'If enabled, new submissions will be inactive, pending admin approval.', 'listify' ),
				'Allow Pending Edits'                     => esc_html__( 'Allow Pending Edits', 'listify' ),
				'Users can continue to edit pending listings until they are approved by an admin.' => esc_html__( 'Users can continue to edit pending listings until they are approved by an admin.', 'listify' ),
				'Submissions awaiting approval can be edited' => esc_html__( 'Submissions awaiting approval can be edited', 'listify' ),
				'Allow Published Edits' => esc_html__( 'Allow Published Edits', 'listify' ),
				'Allow editing of published listings' => esc_html__( 'Allow editing of published listings', 'listify' ),
				'Choose whether published job listings can be edited and if edits require admin approval. When moderation is required, the original job listings will be unpublished while edits await admin approval.' => esc_html__( 'Choose whether published job listings can be edited and if edits require admin approval. When moderation is required, the original job listings will be unpublished while edits await admin approval.', 'listify' ),
				'Listings will display for the set number of days, then expire. Leave this field blank if you don\'t want listings to have an expiration date.' => esc_html__( 'Listings will display for the set number of days, then expire. Leave this field blank if you don\'t want listings to have an expiration date.', 'listify' ),
				'Users cannot edit' => esc_html__( 'Users cannot edit', 'listify' ),
				'Users can edit without admin approval' => esc_html__( 'Users can edit without admin approval', 'listify' ),
				'Users can edit, but edits require admin approval' => esc_html__( 'Users can edit, but edits require admin approval', 'listify' ),
				'Listing Duration'                        => esc_html__( 'Listing Duration', 'listify' ),
				'Application Method'                      => esc_html__( 'Contact Method', 'listify' ),
				'Choose the contact method for listings.' => esc_html__( 'Choose the contact method for listings.', 'listify' ),
				'Email address or website URL'            => esc_html__( 'Email address or website URL', 'listify' ),
				'Email addresses only'                    => esc_html__( 'Email addresses only', 'listify' ),
				'Website URLs only'                       => esc_html__( 'Website URLs only', 'listify' ),
				'Pages'                                   => esc_html__( 'Pages', 'listify' ),
				'Settings successfully saved'             => esc_html__( 'Settings successfully saved', 'listify' ),
				'--no page--'                             => esc_html__( '--no page--', 'listify' ),
				'Select a page…'                          => esc_html__( 'Select a page&hellip;', 'listify' ),
				'Save Changes'                            => esc_html__( 'Save Changes', 'listify' ),
				'Setup'                                   => esc_html__( 'Setup', 'listify' ),
				'Skip this step'                          => esc_html__( 'Skip this step', 'listify' ),
				'All Done!'                               => esc_html__( 'All Done!', 'listify' ),
				'Location'                                => esc_html__( 'Location', 'listify' ),
				'Employment Type' => esc_html__( 'Employment Type', 'listify' ),
				'e.g. "London"'                           => esc_html__( 'e.g. "London"', 'listify' ),
				'Leave this blank if the location is not important' => esc_html__( 'Leave this blank if the location is not important', 'listify' ),
				'URL or email which applicants use to apply' => esc_html__( 'URL or email which applicants use for contact', 'listify' ),
				'URL to the company video'                => esc_html__( 'URL to the company video', 'listify' ),
				'Position filled?'                        => esc_html__( 'Position filled?', 'listify' ),
				'Feature this listing?'                   => esc_html__( 'Feature this listing?', 'listify' ),
				'yyyy-mm-dd'                              => esc_html__( 'yyyy-mm-dd', 'listify' ),
				'Posted by'                               => esc_html__( 'Posted by', 'listify' ),
				'%s Data'                                 => esc_html__( '%s Data', 'listify' ),
				'Use file'                                => esc_html__( 'Use file', 'listify' ),
				'Upload'                                  => esc_html__( 'Upload', 'listify' ),
				'Add file'                                => esc_html__( 'Add file', 'listify' ),
				'Guest user'                              => esc_html__( 'Guest user', 'listify' ),
				'Showing %s'                              => esc_html__( 'Showing %s', 'listify' ),
				'Showing all %s'                          => esc_html__( 'Showing all %s', 'listify' ),
				'located in &ldquo;%s&rdquo;'             => esc_html__( 'located in &ldquo;%s&rdquo;', 'listify' ),
				'Search completed. Found %d matching record.' => array(
					esc_html__( 'Search completed. Found %d matching record.', 'listify' ),
					esc_html__( 'Search completed. Found %d matching records.', 'listify' ),
				),
				'No results found'                        => esc_html__( 'No results found', 'listify' ),
				'Query limit reached'                     => esc_html__( 'Query limit reached', 'listify' ),
				'Geocoding error'                         => esc_html__( 'Geocoding error', 'listify' ),
				'Employer'                                => esc_html__( 'Employer', 'listify' ),
				'Search %s'                               => esc_html__( 'Search %s', 'listify' ),
				'All %s'                                  => esc_html__( 'All %s', 'listify' ),
				'Parent %s'                               => esc_html__( 'Parent %s', 'listify' ),
				'Parent %s:'                              => esc_html__( 'Parent %s:', 'listify' ),
				'Edit %s'                                 => esc_html__( 'Edit %s', 'listify' ),
				'Update %s'                               => esc_html__( 'Update %s', 'listify' ),
				'Add New %s'                              => esc_html__( 'Add New %s', 'listify' ),
				'New %s Name'                             => esc_html__( 'New %s Name', 'listify' ),
				'Add New'                                 => esc_html__( 'Add New', 'listify' ),
				'Add %s'                                  => esc_html__( 'Add %s', 'listify' ),
				'New %s'                                  => esc_html__( 'New %s', 'listify' ),
				'View %s'                                 => esc_html__( 'View %s', 'listify' ),
				'No %s found'                             => esc_html__( 'No %s found', 'listify' ),
				'No %s found in trash'                    => esc_html__( 'No %s found in trash', 'listify' ),
				'This is where you can create and manage %s.' => esc_html__( 'This is where you can create and manage %s.', 'listify' ),
				'Expired'                                 => array(
					esc_html__( 'Expired', 'listify' ),
					esc_html__( 'Expired (%s)', 'listify' ),
				),
				'Invalid ID'                              => esc_html__( 'Invalid ID', 'listify' ),
				'This position has already been filled'   => esc_html__( 'This position has already been filled', 'listify' ),
				'%s has been filled'                      => esc_html__( '%s has been filled', 'listify' ),
				'This position is not filled'             => esc_html__( 'This position is not filled', 'listify' ),
				'%s has been marked as not filled'        => esc_html__( '%s has been marked as not filled', 'listify' ),
				'%s has been deleted'                     => esc_html__( '%s has been deleted', 'listify' ),
				'Job Title'                               => sprintf( esc_html__( '%s Name', 'listify' ), $this->label( 'singular' ) ),
				'Date Posted'                             => esc_html__( 'Date Posted', 'listify' ),
				'Date Expires'                            => esc_html__( 'Date Expires', 'listify' ),
				'Load more listings'                      => sprintf( esc_html__( 'Load More %s', 'listify' ), $this->label( 'plural' ) ),
				'Recent %s'                               => esc_html__( 'Recent %s', 'listify' ),
				'Keyword'                                 => esc_html__( 'Keyword', 'listify' ),
				'Number of listings to show'              => esc_html__( 'Number of listings to show', 'listify' ),
				'Invalid listing'                         => esc_html__( 'Invalid listing', 'listify' ),
				'Save changes'                            => esc_html__( 'Save changes', 'listify' ),
				'Your changes have been saved.'           => esc_html__( 'Your changes have been saved.', 'listify' ),
				'View &rarr;'                             => esc_html__( 'View &rarr;', 'listify' ),
				'Submit Details'                          => esc_html__( 'Submit Details', 'listify' ),
				'Preview'                                 => esc_html__( 'Preview', 'listify' ),
				'Done'                                    => esc_html__( 'Done', 'listify' ),
				'you@yourdomain.com'                      => esc_html__( 'you@yourdomain.com', 'listify' ),
				'http://'                                 => esc_html__( 'http://', 'listify' ),
				'Enter an email address or website URL'   => esc_html__( 'Enter an email address or website URL', 'listify' ),
				'Description'                             => esc_html__( 'Description', 'listify' ),
				'Enter the name of the company'           => esc_html__( 'Enter the name of the company', 'listify' ),
				'Website'                                 => esc_html__( 'Website', 'listify' ),
				'Tagline'                                 => esc_html__( 'Tagline', 'listify' ),
				'Briefly describe your company'           => esc_html__( 'Briefly describe your company', 'listify' ),
				'Video'                                   => esc_html__( 'Video', 'listify' ),
				'A link to a video about your company'    => esc_html__( 'A link to a video about your company', 'listify' ),
				'Twitter username'                        => esc_html__( 'Twitter username', 'listify' ),
				'@yourcompany'                            => esc_html__( '@yourcompany', 'listify' ),
				'Logo'                                    => esc_html__( 'Logo', 'listify' ),
				'%s is a required field'                  => esc_html__( '%s is a required field', 'listify' ),
				'%s is invalid'                           => esc_html__( '%s is invalid', 'listify' ),
				'Please enter a valid application email address' => esc_html__( 'Please enter a valid contact email address', 'listify' ),
				'Please enter a valid application URL'    => esc_html__( 'Please enter a valid application URL', 'listify' ),
				'Please enter a valid application email address or URL' => esc_html__( 'Please enter a valid contact email address or URL', 'listify' ),
				'You must be signed in to post a new listing.' => esc_html__( 'You must be signed in to post a new listing.', 'listify' ),
				'Submit Listing'                          => esc_html__( 'Submit Listing', 'listify' ),
				'Edit listing'                            => esc_html__( 'Edit listing', 'listify' ),
				'\%s\ (filetype %s) needs to be one of the following file types: %s' => esc_html__( '\%1$s\ (filetype %2$s) needs to be one of the following file types: %3$s', 'listify' ),
				'Your account'                            => esc_html__( 'Your account', 'listify' ),
				'You are currently signed in as <strong>%s</strong>.' => esc_html__( 'You are currently signed in as %s.', 'listify' ),
				'Sign out'                                => esc_html__( 'Sign out', 'listify' ),
				'Have an account?'                        => esc_html__( 'Have an account?', 'listify' ),
				'Sign in'                                 => esc_html__( 'Sign in', 'listify' ),
				'optionally'                              => esc_html__( 'optionally', 'listify' ),
				'You must sign in to create a new listing.' => esc_html__( 'You must sign in to create a new listing.', 'listify' ),
				'Your email'                              => esc_html__( 'Your email', 'listify' ),
				'(optional)'                              => esc_html__( '(optional)', 'listify' ),
				'%s ago'                                  => esc_html__( '%s ago', 'listify' ),
				'No more results found.'                  => esc_html__( 'No more results found.', 'listify' ),
				'Posted %s ago'                           => esc_html__( 'Posted %s ago', 'listify' ),
				'This position has been filled'           => esc_html__( 'This position has been filled', 'listify' ),
				'This listing has expired'                => esc_html__( 'This listing has expired', 'listify' ),
				'remove'                                  => esc_html__( 'remove', 'listify' ),
				'or'                                      => esc_html__( 'or', 'listify' ),
				'Maximum file size: %s.'                  => esc_html__( 'Maximum file size: %s.', 'listify' ),
				'Apply using webmail:'                    => esc_html__( 'Apply using webmail:', 'listify' ),
				'To apply for this job please visit the following URL: <a href=\"%1$s\" target=\"_blank\">%1$s &rarr;</a>' => esc_html__( 'To contact this listing owner please visit the following URL: <a href=\"%1$s\" target=\"_blank\">%1$s %rarr;</a>', 'listify' ),

				'Apply for job'                           => array(
					esc_html__( 'Contact %s', 'listify' ),
					array( $this->label( 'singular' ) ),
				),

				'You need to be signed in to manage your listings.' => esc_html__( 'You need to be signed in to manage your listings.', 'listify' ),
				'You do not have any active listings.'    => esc_html__( 'You do not have any active listings.', 'listify' ),
				'Mark not filled'                         => esc_html__( 'Mark not filled', 'listify' ),
				'Mark filled'                             => esc_html__( 'Mark filled', 'listify' ),
				'Relist'                                  => esc_html__( 'Relist', 'listify' ),
				'Keywords'                                => esc_html__( 'What are you looking for?', 'listify' ),
				'Category'                                => esc_html__( 'Category', 'listify' ),
				'Any category'                            => esc_html__( 'All categories', 'listify' ),
				'Company Details'                         => esc_html__( 'Company Details', 'listify' ),
				'%s submitted successfully. Your listing will be visible once approved.' => esc_html__( '%s submitted successfully. Your listing will be visible once approved.', 'listify' ),
				'Draft'                                   => esc_html__( 'Draft', 'listify' ),
				'Preview'                                 => esc_html__( 'Preview', 'listify' ),
				'Pending approval'                        => esc_html__( 'Pending approval', 'listify' ),
				'Pending payment'                         => esc_html__( 'Pending payment', 'listify' ),
				'Active'                                  => esc_html__( 'Active', 'listify' ),
				'Reset'                                   => esc_html__( 'Reset', 'listify' ),
				'RSS'                                     => esc_html__( 'RSS', 'listify' ),
				'Your email address isn’t correct.'       => esc_html__( 'Your email address isn&#39;t correct.', 'listify' ),
				'This email is already registered, please choose another one.' => esc_html__( 'This email is already registered, please choose another one.', 'listify' ),
				'Choose a category&hellip;'               => esc_html__( 'Choose a category&hellip;', 'listify' ),
				'Inactive'                                => esc_html__( 'Inactive', 'listify' ),
				'Application via \%s\ listing on %s'      => esc_html__( 'Application via \%1$s\ listing on %2$s', 'listify' ),
				'Anywhere'                                => esc_html__( 'Anywhere', 'listify' ),
				'Are you sure you want to delete this listing?' => esc_html__( 'Are you sure you want to delete this listing?', 'listify' ),
				'Your listings are shown in the table below.' => esc_html__( 'Your listings are shown in the table below.', 'listify' ),
				'Listing Expires'                         => esc_html__( 'Listing Expires', 'listify' ),
				'If you don\'t have an account you can %screate one below by entering your email address/username.' => esc_html__( 'If you don\'t have an account you can %screate one below by entering your email address/username.', 'listify' ),
				'Your account details will be confirmed via email.' => esc_html__( 'Your account details will be confirmed via email.', 'listify' ),
				'To apply for this job please visit the following URL: <a href="%1$s" target="_blank">%1$s &rarr;</a>' => esc_html__( 'To contact this listing owner please visit the following URL: <a href="%1$s" target="_blank">%1$s &rarr;</a>', 'listify' ),
				'To apply for this job <strong>email your details to</strong> <a class="job_application_email" href="mailto:%1$s%2$s">%1$s</a>' => esc_html__( 'To contact this listing <strong>email your details to</strong> <a class="job_application_email" href="mailto:%1$s%2$s">%1$s</a>', 'listify' ),
				'You are editing an existing job. %s'     => esc_html__( 'You are editing an existing listing. %s', 'listify' ),
				'Create A New Job'                        => esc_html__( 'Create a new Listing', 'listify' ),
				'\"%s\" check failed. Please try again.'  => esc_html__( '"%s" check failed. Please try again.', 'listify' ),
				'Licenses'                                => esc_html__( 'Licenses', 'listify' ),
				'Choose how you want the published date for jobs to be displayed on the front-end.' => esc_html__( 'Choose how you want the published date for jobs to be displayed on the front-end.', 'listify' ),
				'Date Format' => esc_html__( 'Date Format', 'listify' ),
				'Relative to the current date (e.g., 1 day, 1 week, 1 month ago)' => esc_html__( 'Relative to the current date (e.g., 1 day, 1 week, 1 month ago)' ),
				'Default date format as defined in Settings' => esc_html__( 'Default date format as defined in Settings', 'listify' ),
				'Google Maps API Key' => esc_html__( 'Google Maps API Key', 'listify' ),
				'Google requires an API key to retrieve location information for job listings. Acquire an API key from the <a href=\"%s\">Google Maps API developer site</a>.' => 'Google requires an API key to retrieve location information for listings. Acquire an API key from the <a href=\"%s\">Google Maps API developer site</a>.',
				'Delete Data On Uninstall' => esc_html__( 'Delete Data On Uninstall', 'listify' ),
				'Delete WP Job Manager data when the plugin is deleted. Once removed, this data cannot be restored.' => esc_html__( 'Delete WP Job Manager data when the plugin is deleted. Once removed, this data cannot be restored.', 'listify' ),
				'Includes account creation on the listing submission form, to allow non-registered users to create an account and submit a job listing simultaneously.' => esc_html__( 'Includes account creation on the listing submission form, to allow non-registered users to create an account and submit a listing simultaneously.', 'listify' ),
				'Automatically generates usernames for new accounts from the registrant\'s email address. If this is not enabled, a \"username\" field will display instead.' => esc_html__( 'Automatically generates usernames for new accounts from the registrant\'s email address. If this is not enabled, a \"username\" field will display instead.', 'listify' ),
				'Email new users a link to set a password' => esc_html__( 'Email new users a link to set a password', 'listify' ),
				'Sends an email to the user with their username and a link to set their password. If this is not enabled, a \"password\" field will display instead, and their email address won\'t be verified.' => esc_html__( 'Sends an email to the user with their username and a link to set their password. If this is not enabled, a \"password\" field will display instead, and their email address won\'t be verified.', 'listify' ),
				'Any new accounts created during submission will have this role. If you haven\'t enabled account creation during submission in the options above, your own method of assigning roles will apply.' => esc_html__( 'Any new accounts created during submission will have this role. If you haven\'t enabled account creation during submission in the options above, your own method of assigning roles will apply.', 'listify' ),
				'Moderate New Listings' => esc_html__( 'Moderate New Listings', 'listify' ),
				'Require admin approval of all new listing submissions' => esc_html__( 'Require admin approval of all new listing submissions', 'listify' ),
				'Sets all new submissions to "pending." They will not appear on your site until an admin approves them.' => esc_html__( 'Sets all new submissions to "pending." They will not appear on your site until an admin approves them.', 'listify' ),
				'Send a notice to the site administrator when a new job is submitted on the frontend.' => esc_html__( 'Send a notice to the site administrator when a new listing is submitted on the frontend.', 'listify' ),
				'Send a notice to the site administrator when a job is updated on the frontend.' => esc_html__( 'Send a notice to the site administrator when a listing is updated on the frontend.', 'listify' ),
				'Admin Notice of Expiring Job Listings' => esc_html__( 'Admin Notice of Expiring Listings', 'listify' ),
				'Send notices to the site administrator before a job listing expires.' => esc_html__( 'Send notices to the site administrator before a listing expires.', 'listify' ),
				'Employer Notice of Expiring Job Listings' => esc_html__( 'Employer Notice of Expiring Listings', 'listify' ),
				'Send notices to employers before a job listing expires.' => esc_html__( 'Send notices to employers before a listing expires.', 'listify' ),
				'The following job listing is expiring today from <a href="%s">%s</a>.' => esc_html__( 'The following listing is expiring today from <a href="%s">%s</a>.', 'listify' ),
				'The following job listing is expiring soon from <a href="%s">%s</a>.' => esc_html__( 'The following listing is expiring soon from <a href="%s">%s</a>.', 'listify' ),
				'Visit <a href="%s">WordPress admin</a> to manage the listing.' => esc_html__( 'Visit <a href="%s">WordPress admin</a> to manage the listing.', 'listify' ),
				'It has been published and is now available to the public.' => esc_html__( 'It has been published and is now available to the public.', 'listify' ),
				'It is awaiting approval by an administrator in <a href="%s">WordPress admin</a>.' => esc_html__( 'It is awaiting approval by an administrator in <a href="%s">WordPress admin</a>.', 'listify' ),
				'A new listing has been submitted to <a href="%s">%s</a>.' => esc_html__( 'A new job listing has been submitted to <a href="%s">%s</a>.', 'listify' ),
				'A job listing has been updated on <a href="%s">%s</a>.' => esc_html__( 'A listing has been updated on <a href="%s">%s</a>.', 'listify' ),
				'The job listing is not publicly available until the changes are approved by an administrator in the site\'s <a href="%s">WordPress admin</a>.' => esc_html__( 'The listing is not publicly available until the changes are approved by an administrator in the site\'s <a href="%s">WordPress admin</a>.', 'listify' ),
				'The changes have been published and are now available to the public.' => esc_html__( 'The changes have been published and are now available to the public.', 'listify' ),
				'The following job listing is expiring today from <a href="%s">%s</a>.' => esc_html__( 'The following listing is expiring today from <a href="%s">%s</a>.', 'listify' ),
				'The following job listing is expiring soon from <a href="%s">%s</a>.' => esc_html__( 'The following job listing is expiring soon from <a href="%s">%s</a>.', 'listify' ),
				'Visit the <a href="%s">job listing dashboard</a> to manage the listing.' => esc_html__( 'Visit the <a href="%s">listing dashboard</a> to manage the listing.', 'listify' ),
				'Hide expired listings in job archives/search' => esc_html__( 'Hide expired listings in archives/search', 'listify' ),
				'Expired job listings will not be searchable.' => esc_html__( 'Expired listings will not be searchable.', 'listify' ),
				'This lets users select from a list of categories when submitting a job. Note: an admin has to create categories before site users can select them.' => esc_html__( 'This lets users select from a list of categories when submitting a listing. Note: an admin has to create categories before site users can select them.', 'listify' ),
				'The category selection box will default to allowing multiple selections on the [jobs] shortcode. Without this, users will only be able to select a single category when submitting jobs.' => esc_html__( 'The category selection box will default to allowing multiple selections on the [jobs] shortcode. Without this, users will only be able to select a single category when submitting listings.', 'listify' ),
				'Determines the logic used to display jobs when selecting multiple categories.' => esc_html__( 'Determines the logic used to display listings when selecting multiple categories.', 'listify' ),
				'This lets users select from a list of types when submitting a job. Note: an admin has to create types before site users can select them.' => esc_html__( 'This lets users select from a list of types when submitting a listing. Note: an admin has to create types before site users can select them.', 'listify' ),
				'Choose how you want the published date for jobs to be displayed on the front-end.' => esc_html__( 'Choose how you want the published date for listings to be displayed on the front-end.', 'listify' ),
				'Limits job listing submissions to registered, logged-in users.' => esc_html__( 'Limits listing submissions to registered, logged-in users.', 'listify' ),
				'New Job Listing Submitted: %s' => esc_html__( 'New Listing Submitted: %s', 'listify' ),
				'Job Listing Updated: %s' => esc_html__( 'Listing Updated: %s', 'listify' ),
				'Job Listing Expiring: %s' => esc_html__( 'Listing Expiring: %s', 'listify' ),
			),
			'wp-job-manager-listing-labels'       => array(
				'job-tag' => array(
					esc_html__( '%s-tag', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
			),
			'wp-job-manager-locations'            => array(
				'Job Regions'                    => array(
					esc_html__( '%s Regions', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job Region'                     => array(
					esc_html__( '%s Region', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'job-region'                     => array(
					esc_html__( '%s-region', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
				'Display a list of job regions.' => array(
					esc_html__( 'Display a list of %s regions.', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
			),
			'wp-job-manager-wc-paid-listings'     => array(
				'Choose a package before entering job details' => sprintf( esc_html__( 'Choose a package before entering %s details', 'listify' ), $this->label( 'singular' ) ),
				'Choose a package after entering job details' => sprintf( esc_html__( 'Choose a package after entering %s details', 'listify' ), $this->label( 'singular' ) ),
				'Choose a package'         => esc_html__( 'Choose a package', 'listify' ),
				'Purchase Package:'        => esc_html__( 'Purchase Package:', 'listify' ),
				'Listing Details &rarr;'   => esc_html__( 'Listing Details &rarr;', 'listify' ),
				'%s job posted out of %d'  => array(
					esc_html__( '%1$s listing posted out of %2$d', 'listify' ),
					esc_html__( '%1$s listings posted out of %2$d', 'listify' ),
				),
				'%s job posted'            => array(
					esc_html__( '%s listing posted', 'listify' ),
					esc_html__( '%s listings posted', 'listify' ),
				),
				'%s for %s job'            => array(
					esc_html__( '%1$s for %2$s listing', 'listify' ),
					esc_html__( '%1$s for %2$s listings', 'listify' ),
				),
				'Job Package'              => array(
					esc_html__( '%s Package', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job Package Subscription' => array(
					esc_html__( '%s Package Subscription', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job Listing'              => array(
					esc_html__( '%s', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job listing limit'        => array(
					esc_html__( '%s limit', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job listing duration'     => array(
					esc_html__( '%s duration', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'The number of days that the job listing will be active.' => array(
					esc_html__( 'The number of days that the %s will be active', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
				'Feature job listings?'    => array(
					esc_html__( 'Feature %s?', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
				'Feature this job listing - it will be styled differently and sticky.' => array(
					esc_html__( 'Feature this %s -- it will be styled differently and sticky.', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
				'My Job Packages'          => array(
					esc_html__( 'My %s Packages', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Jobs Remaining'           => array(
					esc_html__( '%s Remaining', 'listify' ),
					array( $this->label( 'plural' ) ),
				),
			),
			'wp-job-manager-simple-paid-listings' => array(
				'Job #%d Payment Update' => esc_html__( '#%d Payment Update', 'listify' ),
			),
			'wp-job-manager-alerts'               => array(
				'Jobs matching your "%s" alert:' => esc_html__( 'Results for your "%s" alert:', 'listify' ),
				'Job Alert Results Matching "%s' => esc_html__( 'Results Matching "%s', 'listify' ),
				'No jobs were found matching your search. Login to your account to change your alert criteria' => esc_html__( 'No results were found matching your search. Login to your account to change your alert criteria', 'listify' ),
				'This job alert will automatically stop sending after %s.' => esc_html__( 'This alert will automatically stop sending after %s.', 'listify' ),
				'No jobs found'                  => array(
					esc_html__( 'No %s found', 'listify' ),
					array( $this->label( 'plural', true ) ),
				),
				'Optionally add a keyword to match jobs against' => array(
					esc_html__( 'Optionally add a keyword to match %s against', 'listify' ),
					array( $this->label( 'plural', true ) ),
				),
				'Job Type'                       => array(
					esc_html__( '%s Type', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Job Region'                     => array(
					esc_html__( '%s Region', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Any job type'                   => array(
					esc_html__( 'Any %s type', 'listify' ),
					array( $this->label( 'singular', true ) ),
				),
				'Job Type:'                      => array(
					esc_html__( '%s Type:', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
				'Your job alerts are shown in the table below. Your alerts will be sent to %s.' => esc_html__( 'Your alerts are shown in the table below. The alerts will be sent to %s.', 'listify' ),
				'Alert me to jobs like this'     => sprintf( esc_html__( 'Alert me of %s like this', 'listify' ), $this->label( 'plural', true ) ),
			),
			'wp-job-manager-extended-location'    => array(
				'Job Location' => array(
					esc_html__( '%s Location', 'listify' ),
					array( $this->label( 'singular' ) ),
				),
			),
		);

		$this->strings = apply_filters( 'listify_strings', $strings );

		return $this->strings;
	}

}

$GLOBALS['listify_strings'] = new Listify_Strings();

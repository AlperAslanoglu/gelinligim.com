=== Listing Labels for WP Job Manager ===
Contributors: astoundify
Requires at least: 4.9.0
Tested up to: 5.2
Stable tag: 2.5.3
WC requires at least: 3.0.0
WC tested up to: 3.6.0
Requires PHP: 5.6.20
License: GNU General Public License v3.0

Allow your users to easily refine search results by adding one more multiple tag requirements to their current search parameters. Ensure that not only are your guests finding relevant results but also your website's listings are being discovered easily.

= Documentation =

Usage instructions for this plugin can be found on our documentation: [http://docs.astoundify.com/](http://docs.astoundify.com/).

= Support Policy =

Please contact https://astoundify.com/account/new-ticket/ for technical support regarding the plugin. We are partnered with and highly recommend WP Curve (https://astoundify.com/go/wpcurve) Envato Studio (https://astoundify.com/go/envato-studio/) or Codeable (https://astoundify.com/go/codeable/) if you need help customizing your website.

== Installation ==

To install this plugin, please refer to the guide here: [http://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation](http://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation)

== Other Notes ==

This plugin is a fork from:

**WP Job Manager - Job Tags**
Copyright: 2015 Automattic

== Changelog ==

= 2.5.3: May 29, 2019 =

* Fix: Rebuild the minified assets.

= 2.5.2: May 27, 2019 =

* Fix: Declare compatibility with WordPress 5.2 and WooCommerce 3.6.

= 2.5.1: June 15, 2018 =

* Fix: Ensure labels show when no filters have been selected.
* Fix: Avoid PHP error when setting language with Polylang.

= 2.5.0: June 7, 2018 =

* Fix: Ensure only relevant labels are shown.
* Fix: Avoid PHP error on submission process.

= 2.4.0: March 14, 2018 =

* New: Load labels based on current language in Polylang.
* New: Introduce astoundify_wpjmll_filter_results_limit_count filter to control when all labels are shown.
* New: Introduce astoundify_wpjmll_show_filter_ui filter to stop display of filter UI.

= 2.3.0: December 4, 2017 =

* Fix: Max label validation error.
* Fix: Submitting a listing when no label field can be found.
* Fix: Remove "slug" ordering option which is not supported in WordPress.

= 2.2.0: August 9, 2017 =

* New: Setting to show all listing labels regardless of found results.
* Fix: Avoid PHP error when no labels are found.

= 2.1.0: July 5, 2017 =

* New: Pass [jobs listing-labels="slug1, slug2"] to prefilter chosen listing labels.
* Fix: Avoid potential PHP error when filtering returned listings.
* Fix: Register taxonomy earlier so it is available when registering widgets.

= 2.0.1: June 21, 2017 =

* Fix: Avoid PHP error when saving terms when using a standard text input.

= 2.0.0: June 21, 2017 =

* New: Convert plugin to "Listing Labels for WP Job Manager". Update coding standards, project structure, and general codebase.

= 1.1.0: April 11, 2017 =

* Fix: Update README

= 1.0.0: March 2, 2017 =

* New: Initial release.

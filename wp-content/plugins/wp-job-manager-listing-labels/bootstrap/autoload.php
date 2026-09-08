<?php
/**
 * Include Composer's autoloader.
 *
 * @since 2.0.0
 *
 * @package Listing Labels
 * @category Bootstrap
 * @author Astoundify
 */

$file = __DIR__ . '/../vendor/autoload.php';

if ( file_exists( $file ) ) {
	require( $file );
}

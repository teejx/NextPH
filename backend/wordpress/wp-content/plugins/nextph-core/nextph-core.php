<?php
/**
 * Plugin Name: NextPH Core
 * Plugin URI: https://nextph.example
 * Description: Core headless CMS capabilities for NextPH: trending/featured metadata, safe REST endpoints, role restrictions, and cache revalidation webhooks.
 * Version: 1.0.0
 * Author: NextPH Engineering
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

class NextPH_Core {
    const REST_NAMESPACE = 'nextph/v1';

    public function __construct() {
        // Register post meta
        add_action('init', [$this, 'register_post_meta']);

        // Register custom REST routes
        add_action('rest_api_init', [$this, 'register_rest_routes']);

        // Enforce role capabilities: authors cannot publish directly
        add_action('init', [$this, 'enforce_author_restrictions']);

        // Webhook for revalidation on post publish / update / trash
        add_action('transition_post_status', [$this, 'on_post_status_transition'], 10, 3);
    }

    /**
     * Register meta fields for posts: featured and trending flags.
     */
    public function register_post_meta() {
        register_post_meta('post', '_nextph_is_featured', [
            'show_in_rest' => true,
            'single'       => true,
            'type'         => 'boolean',
            'auth_callback' => function() {
                return current_user_can('edit_others_posts');
            },
            'sanitize_callback' => 'rest_sanitize_boolean',
            'description'  => 'Designates this post as a featured editorial story for the lead hero slot.',
        ]);

        register_post_meta('post', '_nextph_is_trending', [
            'show_in_rest' => true,
            'single'       => true,
            'type'         => 'boolean',
            'auth_callback' => function() {
                return current_user_can('edit_others_posts');
            },
            'sanitize_callback' => 'rest_sanitize_boolean',
            'description'  => 'Designates this post as an editor-curated trending story.',
        ]);
    }

    /**
     * Register public REST endpoint for trending stories.
     */
    public function register_rest_routes() {
        register_rest_route(self::REST_NAMESPACE, '/trending', [
            'methods'  => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_trending_posts'],
            'permission_callback' => '__return_true', // Public read-only endpoint
            'args' => [
                'limit' => [
                    'default'           => 8,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0 && $param <= 20;
                    },
                ],
            ],
        ]);
    }

    /**
     * Return published posts flagged as trending, with fallback to latest published posts.
     */
    public function get_trending_posts(WP_REST_Request $request) {
        $limit = min(20, max(1, (int)$request->get_param('limit')));

        $query_args = [
            'post_type'      => 'post',
            'post_status'    => 'publish',
            'posts_per_page' => $limit,
            'meta_query'     => [
                [
                    'key'     => '_nextph_is_trending',
                    'value'   => 1,
                    'compare' => '=',
                ],
            ],
            'orderby'        => 'date',
            'order'          => 'DESC',
            'no_found_rows'  => true,
        ];

        $query = new WP_Query($query_args);

        // Fallback: if not enough posts are marked trending, fill with recent published posts
        if ($query->post_count < $limit) {
            $existing_ids = wp_list_pluck($query->posts, 'ID');
            $needed = $limit - $query->post_count;

            $fallback_args = [
                'post_type'      => 'post',
                'post_status'    => 'publish',
                'posts_per_page' => $needed,
                'post__not_in'   => $existing_ids,
                'orderby'        => 'date',
                'order'          => 'DESC',
                'no_found_rows'  => true,
            ];
            $fallback_query = new WP_Query($fallback_args);
            $posts = array_merge($query->posts, $fallback_query->posts);
        } else {
            $posts = $query->posts;
        }

        $controller = new WP_REST_Posts_Controller('post');
        $data = [];

        foreach ($posts as $post) {
            $response = $controller->prepare_item_for_response($post, $request);
            $data[] = $controller->prepare_response_for_collection($response);
        }

        $response = rest_ensure_response($data);
        // Add short cache header for public cache
        $response->header('Cache-Control', 'public, max-age=120, s-maxage=300');

        return $response;
    }

    /**
     * Enforce publishing capabilities: Author role must NOT have publish_posts.
     * Authors can submit drafts for review ('edit_posts', 'upload_files'),
     * but cannot directly publish or edit others' posts.
     */
    public function enforce_author_restrictions() {
        $author_role = get_role('author');
        if ($author_role) {
            if ($author_role->has_cap('publish_posts')) {
                $author_role->remove_cap('publish_posts');
            }
        }
    }

    /**
     * Post status transition hook for Next.js ISR cache invalidation.
     */
    public function on_post_status_transition($new_status, $old_status, $post) {
        if ($post->post_type !== 'post') {
            return;
        }

        // Only trigger if publishing, updating, or unpublishing
        $is_relevant = ($new_status === 'publish' || $old_status === 'publish');
        if (!$is_relevant) {
            return;
        }

        $revalidate_url = defined('NEXTPH_REVALIDATE_URL') ? NEXTPH_REVALIDATE_URL : get_option('nextph_revalidate_url');
        $revalidate_secret = defined('NEXTPH_REVALIDATE_SECRET') ? NEXTPH_REVALIDATE_SECRET : get_option('nextph_revalidate_secret');

        if (!$revalidate_url || !$revalidate_secret) {
            return;
        }

        wp_remote_post($revalidate_url, [
            'timeout' => 5,
            'blocking' => false,
            'headers' => [
                'Content-Type' => 'application/json',
                'X-Revalidate-Secret' => $revalidate_secret,
            ],
            'body' => wp_json_encode([
                'id'        => $post->ID,
                'slug'      => $post->post_name,
                'newStatus' => $new_status,
                'oldStatus' => $old_status,
                'timestamp' => time(),
            ]),
        ]);
    }
}

new NextPH_Core();

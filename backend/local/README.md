# NextPH Local WordPress Development Environment

This directory provides a self-contained local development environment running WordPress 6.7 and MariaDB 10.11 via Docker Compose.

## Prerequisites

- Docker and Docker Compose installed.

## Quick Start

1. Start the containers:
   ```bash
   cd backend/local
   docker compose up -d
   ```

2. Access WordPress:
   - URL: `http://localhost:8080`
   - Complete the standard WordPress installation wizard.
   - Configure the database credentials (pre-set in docker-compose.yml):
     - DB Name: `nextph_wordpress`
     - DB User: `nextph_user`
     - DB Password: `nextph_password_local_only`
     - DB Host: `db:3306`

3. Activate `nextph-core`:
   - The plugin is mounted into `/var/www/html/wp-content/plugins/nextph-core`.
   - Go to `http://localhost:8080/wp-admin/plugins.php` and activate **NextPH Core**.

4. Point your local Next.js frontend to this instance:
   - In `frontend/.env.local`:
     ```env
     WORDPRESS_API_URL=http://localhost:8080/wp-json
     ```

#!/usr/bin/env bash
# NextPH Database and Media Backup Script
# Schedule via cron on the WordPress hosting server.

set -euo pipefail

BACKUP_DIR="/var/backups/nextph"
DATE=$(date +"%Y%m%d_%H%M%S")
DB_NAME="${DB_NAME:-nextph_wordpress}"
DB_USER="${DB_USER:-nextph_user}"
DB_PASS="${DB_PASS:-}"
WP_UPLOADS_DIR="${WP_UPLOADS_DIR:-/var/www/html/wp-content/uploads}"

mkdir -p "${BACKUP_DIR}"

echo "Starting NextPH backup: ${DATE}"

# 1. Backup MariaDB / MySQL database
mysqldump -u"${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" | gzip > "${BACKUP_DIR}/db_${DATE}.sql.gz"
echo "Database backup complete: db_${DATE}.sql.gz"

# 2. Archive WordPress uploads media library
tar -czf "${BACKUP_DIR}/uploads_${DATE}.tar.gz" -C "${WP_UPLOADS_DIR}" .
echo "Media library backup complete: uploads_${DATE}.tar.gz"

# 3. Retention: Delete backups older than 30 days
find "${BACKUP_DIR}" -type f -name "*.gz" -mtime +30 -delete
echo "Retention check completed."

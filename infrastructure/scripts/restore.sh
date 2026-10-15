#!/usr/bin/env bash
# NextPH Disaster Recovery / Restore Script
# Restores database and WordPress uploads from an existing backup archive.

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <path-to-db-dump.sql.gz> <path-to-uploads.tar.gz>"
  exit 1
fi

DB_ARCHIVE="$1"
UPLOADS_ARCHIVE="$2"
DB_NAME="${DB_NAME:-nextph_wordpress}"
DB_USER="${DB_USER:-nextph_user}"
DB_PASS="${DB_PASS:-}"
WP_UPLOADS_DIR="${WP_UPLOADS_DIR:-/var/www/html/wp-content/uploads}"

echo "Restoring database from ${DB_ARCHIVE}..."
gunzip < "${DB_ARCHIVE}" | mysql -u"${DB_USER}" -p"${DB_PASS}" "${DB_NAME}"
echo "Database restored successfully."

echo "Restoring media library from ${UPLOADS_ARCHIVE}..."
mkdir -p "${WP_UPLOADS_DIR}"
tar -xzf "${UPLOADS_ARCHIVE}" -C "${WP_UPLOADS_DIR}"
echo "Media library restored successfully."

echo "Recovery complete. Please verify WordPress admin and front-facing routes."

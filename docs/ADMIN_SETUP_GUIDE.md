# NextPH Editorial Admin Guide (/wp-admin)

NextPH uses **WordPress** as its headless Content Management System (CMS). Content creation, drafting, media uploads, and publishing are performed inside **WordPress `/wp-admin`**, while the public website is delivered by Next.js on `http://localhost:3000`.

---

## 1. How to Access the Admin Dashboard

Your admin dashboard URL depends on where your WordPress CMS is hosted:

### Option A: Local Development via LocalWP (Recommended for Windows without Docker)
1. Download and install **[LocalWP](https://localwp.com)** (free, native Windows app).
2. Click **Create a new site** > name it `nextph-cms`.
3. Choose PHP 8.2 or 8.3 and MySQL.
4. Click **WP Admin** or open `http://nextph-cms.local/wp-admin` in your browser.
5. Copy the NextPH plugin:
   - Copy `backend/wordpress/wp-content/plugins/nextph-core` into your Local site's `app/public/wp-content/plugins/` folder.
   - Activate **NextPH Core** in WordPress > Plugins.
6. Connect your Next.js frontend:
   - In `frontend/.env.local`:
     ```env
     WORDPRESS_API_URL=http://nextph-cms.local/wp-json
     ```

### Option B: Local Development via Docker Compose
If Docker Desktop is installed:
```bash
cd backend/local
docker compose up -d
```
Open **`http://localhost:8080/wp-admin`**.

### Option C: Remote / Cloud Hosting (Production & Staging)
Deploy WordPress on your chosen PHP hosting service (e.g. SiteGround, Cloudways, Hostinger):
1. Log in to `https://<your-wordpress-domain>/wp-admin`.
2. Upload and activate the `nextph-core` plugin from `backend/wordpress/wp-content/plugins/nextph-core`.
3. Update `frontend/.env.local` or Cloudflare Worker variables:
   ```env
   WORDPRESS_API_URL=https://<your-wordpress-domain>/wp-json
   ```

---

## 2. Editorial Roles & Permissions

NextPH enforces strict separation of responsibilities:

| Role | Access | Responsibilities |
|---|---|---|
| **Administrator** | Full `/wp-admin` | Site settings, plugin management, user accounts, and technical administration. |
| **Editor** | Posts, Media, Tags | Review submitted drafts, schedule, edit, publish stories, and toggle **Featured** or **Trending** flags. |
| **Author** | Posts (Own), Media | Write stories, upload images/GIFs, submit for review. **Cannot publish directly** (publishing rights are stripped by `nextph-core`). |

---

## 3. How to Publish a Story

1. Go to **Posts > Add New Post**.
2. **Title:** Write your story headline.
3. **Content:** Write or format content using Gutenberg blocks (paragraphs, headings, pull quotes, YouTube/Vimeo embeds).
4. **Categories:** Select **Tech**, **Travel**, or **Lifestyle**.
5. **Featured Image:** Set the hero image or GIF in the sidebar.
6. **NextPH Editorial Flags (in Post settings):**
   - Toggle **Featured Story** if this should be the homepage lead hero story.
   - Toggle **Curated Trending** if this should appear in the trending rankings.
7. **Publish / Submit for Review:**
   - Authors click **Submit for Review**.
   - Editors click **Publish** (this triggers the Next.js revalidation webhook to update the public frontend within seconds).

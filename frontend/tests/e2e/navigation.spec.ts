import { test, expect } from '@playwright/test';

test.describe('NextPH Editorial Platform Smoke & E2E Tests', () => {
  test('homepage renders masthead, edition bar, hero story, and trending section', async ({ page }) => {
    await page.goto('/');

    // Check title and masthead
    await expect(page).toHaveTitle(/WHAT'S NEXT PH/);
    await expect(page.locator('header')).toContainText("WHAT'S NEXT");

    // Hero headline and trending
    const heroHeading = page.locator('article h1');
    await expect(heroHeading).toBeVisible();

    const trendingSection = page.locator('section[aria-labelledby="trending-heading"]');
    await expect(trendingSection).toBeVisible();

    // Verify Ads are NOT rendered by default
    const adSlot = page.locator('aside[aria-label="Advertisement"]');
    await expect(adSlot).toHaveCount(0);
  });

  test('navigates to Tech category page and renders section archive', async ({ page }) => {
    await page.goto('/tech');
    await expect(page).toHaveTitle(/Technology/);
    await expect(page.locator('h1')).toContainText('Technology & Innovation');

    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible();
  });

  test('navigates to Travel category page and renders section archive', async ({ page }) => {
    await page.goto('/travel');
    await expect(page).toHaveTitle(/Travel/);
    await expect(page.locator('h1')).toContainText('Archipelago Travel');
  });

  test('navigates to Lifestyle category page', async ({ page }) => {
    await page.goto('/lifestyle');
    await expect(page).toHaveTitle(/Lifestyle/);
    await expect(page.locator('h1')).toContainText('Contemporary Lifestyle');
  });

  test('navigates to Trending page and verifies ranked stories', async ({ page }) => {
    await page.goto('/trending');
    await expect(page.locator('h1')).toContainText('Trending Stories');
    await expect(page.getByText('01')).toBeVisible();
  });

  test('opens article detail page and verifies structured content and share controls', async ({ page }) => {
    await page.goto('/story/future-of-fintech-philippines-cashless-economy');
    await expect(page.locator('h1')).toContainText('Open Finance');

    // Breadcrumb
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();

    // Author and timestamps
    await expect(page.getByText('Gabriel Morales')).toBeVisible();
    await expect(page.getByText(/Published/i)).toBeVisible();

    // Social share buttons
    const shareArea = page.locator('div[aria-label="Social sharing options"]');
    await expect(shareArea).toBeVisible();
    await expect(page.getByLabel('Copy link to story')).toBeVisible();
  });

  test('newsletter form handles validation and submission', async ({ page }) => {
    await page.goto('/');

    const newsletter = page.locator('section[aria-labelledby="newsletter-heading"]');
    await expect(newsletter).toBeVisible();

    const emailInput = page.locator('#newsletter-email');
    const consentBox = page.locator('#newsletter-consent');
    const submitBtn = newsletter.locator('button[type="submit"]');

    // Attempt submission without consent
    await emailInput.fill('reader@example.ph');
    await submitBtn.click();
    await expect(page.getByText(/You must agree/i)).toBeVisible();

    // Now check consent and submit
    await consentBox.check();
    await submitBtn.click();
    await expect(page.getByText(/Subscription Confirmed/i)).toBeVisible();
  });

  test('search page handles query input and displays matching results', async ({ page }) => {
    await page.goto('/search');
    await expect(page.locator('h1')).toContainText("Search WHAT'S NEXT PH Stories");

    const searchInput = page.locator('#search-input');
    await searchInput.fill('Fintech');
    await page.locator('form[role="search"] button[type="submit"]').click();

    await expect(page.getByText(/matching "Fintech"/i)).toBeVisible();
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('non-existent story returns 404 page', async ({ page }) => {
    await page.goto('/story/non-existent-random-story-slug-12345');
    await expect(page.locator('h1')).toContainText('Not Found');
    await expect(page.getByText('404')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh with only the default clock widget
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForSelector('.vgl-item')
  })

  test.afterEach(async ({ page }, testInfo) => {
    await testInfo.attach('screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png'
    })
    console.log(`Screenshot: ${testInfo.outputDir}/test-finished-1.png`)
  })

  test('shows the app header with title and add button', async ({ page }) => {
    await expect(page.locator('.app-title')).toHaveText('VibesNet')
    await expect(page.getByRole('button', { name: '+ Add Widget' })).toBeVisible()
  })

  test('loads with at least one widget', async ({ page }) => {
    const count = await page.locator('.vgl-item').count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('opens add widget dialog', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Widget' }).click()

    const dialog = page.locator('.dialog')
    await expect(dialog).toBeVisible()

    // All widget types should be listed inside the dialog
    await expect(dialog.locator('.widget-option-name', { hasText: 'Clock' })).toBeVisible()
    await expect(dialog.locator('.widget-option-name', { hasText: 'Notes' })).toBeVisible()
    await expect(dialog.locator('.widget-option-name', { hasText: 'Bookmarks' })).toBeVisible()
    await expect(dialog.locator('.widget-option-name', { hasText: 'RSS Feed' })).toBeVisible()
    await expect(dialog.locator('.widget-option-name', { hasText: 'Weather' })).toBeVisible()
  })

  test('can add a clock widget', async ({ page }) => {
    const initialCount = await page.locator('.vgl-item').count()

    await page.getByRole('button', { name: '+ Add Widget' }).click()

    const dialog = page.locator('.dialog')
    await dialog.locator('.widget-option', { hasText: 'Clock' }).click()
    await dialog.getByRole('button', { name: 'Add' }).click()

    // Dialog should close and a new widget should appear
    await expect(page.locator('.dialog-overlay')).not.toBeVisible()
    await expect(page.locator('.vgl-item')).toHaveCount(initialCount + 1)
  })

  test('can add a notes widget', async ({ page }) => {
    const initialCount = await page.locator('.vgl-item').count()

    await page.getByRole('button', { name: '+ Add Widget' }).click()

    const dialog = page.locator('.dialog')
    await dialog.locator('.widget-option', { hasText: 'Notes' }).click()
    await dialog.getByRole('button', { name: 'Add' }).click()

    await expect(page.locator('.vgl-item')).toHaveCount(initialCount + 1)
  })

  test('can close add widget dialog', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Widget' }).click()
    await expect(page.locator('.dialog-overlay')).toBeVisible()

    await page.locator('.dialog-close').click()
    await expect(page.locator('.dialog-overlay')).not.toBeVisible()
  })

})

import { expect, test } from "@playwright/test"

test("Button should render and be clickable", async ({ page }) => {
  // Navigate to the page that has the Button component
  await page.goto("http://localhost:3000")

  // Wait for the button to be present on the page
  await page.waitForSelector('button:has-text("Login")')

  // Click the button
  await page.click('button:has-text("Login")')

  // Check if the click had any effects (replace this with the actual behavior you expect after clicking)
  expect(await page.title()).toBe("Page title after clicking the button")
})

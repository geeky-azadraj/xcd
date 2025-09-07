import { expect, test } from "@playwright/test"

test("InputField should render and accept input", async ({ page }) => {
  // Navigate to the page that has the InputField component
  await page.goto("http://localhost:3000")

  // Wait for the input field to be present on the page
  await page.waitForSelector('input[type="text"]')

  // Type into the input field
  await page.fill('input[type="text"]', "Test value")

  // Check if the input was accepted
  const inputValue = await page.$eval('input[type="text"]', (el) => (el as HTMLInputElement).value)
  expect(inputValue).toBe("Test value")
})

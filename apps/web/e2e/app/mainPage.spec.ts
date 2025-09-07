import { expect, test } from "@playwright/test"

test.describe("MainPage", () => {
  test("should render the MainPage", async ({ page }) => {
    // go to your app's url, replace with actual url
    await page.goto("http://localhost:3000")

    // Check if the title is rendered
    const title = await page.$("h1")
    expect(await title?.textContent()).toBe("Welcome to Our App")
  })

  test("should update email field on type", async ({ page }) => {
    await page.goto("http://localhost:3000")

    // Type into the email field
    await page.fill('input[type="email"]', "test@email.com")
    expect(await page.inputValue('input[type="email"]')).toBe("test@email.com")
  })

  test("should update password field on type", async ({ page }) => {
    await page.goto("http://localhost:3000")

    // Type into the password field
    await page.fill('input[type="password"]', "password")
    expect(await page.inputValue('input[type="password"]')).toBe("password")
  })

  test("should initiate login on click", async ({ page }) => {
    let loginInitiated = false

    await page.goto("http://localhost:3000")

    // Listen to console.log messages
    page.on("console", async (msg) => {
      if (msg.type() === "log" && (await msg.text()) === "Login initiated") {
        loginInitiated = true
      }
    })

    // Click the Login button
    await page.click('button:has-text("Login")')

    // Wait for all network requests to finish before running the expect
    await page.waitForLoadState("networkidle")

    expect(loginInitiated).toBeTruthy()
  })
})

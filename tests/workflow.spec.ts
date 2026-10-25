import { expect, test } from "@playwright/test";
test("generate, save, submit, authorize review, browse acceptance and reopen database", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Spin!" }).click();
  await page.getByRole("button", { name: "Save challenge" }).click();
  await page.getByRole("link", { name: "Open challenge" }).click();
  const challengeUrl = page.url();
  await page.getByRole("link", { name: "Saved challenges", exact: true })
    .click();
  await page.reload();
  await page.locator("main article a").click();
  await expect(page).toHaveURL(challengeUrl);
  await page.getByLabel("GitHub repository").fill(
    "https://github.com.evil.test/a/b",
  );
  await page.getByLabel("Programming language").fill("TypeScript");
  await page.getByLabel("Your name").fill("Browser Tester");
  await page.getByRole("button", { name: "Submit solution" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Use a GitHub repository URL",
  );
  await page.getByLabel("GitHub repository").fill(
    "https://github.com/missing/repository",
  );
  await page.getByRole("button", { name: "Submit solution" }).click();
  await expect(page.getByRole("alert")).toContainText("Repository not found");
  await page.getByLabel("GitHub repository").fill(
    "https://github.com/outage/repository",
  );
  await page.getByRole("button", { name: "Submit solution" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "verification is unavailable",
  );
  const repo = "https://github.com/browser-test/solution";
  await page.getByLabel("GitHub repository").fill(repo);
  await page.getByRole("button", { name: "Submit solution" }).click();
  await expect(page.getByRole("status")).toContainText("Submitted for review");
  await expect(
    page.getByRole("region", { name: "Accepted solutions" }).getByRole("link", {
      name: repo,
    }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Accepted solutions" }).getByRole("link", {
      name: repo,
    }),
  ).toHaveCount(0);
  await page.getByLabel("GitHub repository").fill(repo);
  await page.getByLabel("Programming language").fill("TypeScript");
  await page.getByLabel("Your name").fill("Browser Tester");
  await page.getByRole("button", { name: "Submit solution" }).click();
  await expect(page.getByRole("alert")).toContainText("already been submitted");
  await page.getByRole("link", { name: "Review", exact: true }).click();
  await page.getByLabel("Reviewer token").fill("wrong-token");
  await page.getByRole("button", { name: "Load pending submissions" }).click();
  await expect(page.getByRole("alert")).toContainText("valid reviewer token");
  await expect(page.getByRole("button", { name: "Accept", exact: true }))
    .toHaveCount(0);
  await page.getByLabel("Reviewer token").fill("browser-test-reviewer");
  await page.getByRole("button", { name: "Load pending submissions" }).click();
  const row = page.locator("article").filter({
    has: page.getByRole("link", { name: repo, exact: true }),
  });
  await expect(row).toBeVisible();
  const pending = await (await request.get("http://127.0.0.1:8000/review", {
    headers: { Authorization: "Bearer browser-test-reviewer" },
  })).json();
  const submission = pending.find((s: { github_url: string }) =>
    s.github_url === repo
  );
  expect(
    (await request.post("http://127.0.0.1:8000/review/" + submission.id, {
      data: { decision: "accepted" },
    })).status(),
  ).toBe(401);
  await row.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(row).toHaveCount(0);
  await request.post("http://127.0.0.1:8000/__test/restart");
  await page.goto(challengeUrl);
  await expect(
    page.getByRole("region", { name: "Accepted solutions" }).getByRole("link", {
      name: repo,
    }),
  ).toBeVisible();
});
test("imported pending solution can be rejected and stays private", async ({ page }) => {
  await page.goto("/review");
  await page.getByLabel("Reviewer token").fill("browser-test-reviewer");
  await page.getByRole("button", { name: "Load pending submissions" }).click();
  const row = page.locator("article").filter({
    hasText: "Grasscutters/Grasscutter",
  });
  await row.getByRole("button", { name: "Reject", exact: true }).click();
  await expect(row).toHaveCount(0);
  await page.goto("/problem/A12X");
  await expect(page.getByRole("region", { name: "Accepted solutions" })).not
    .toContainText("Grasscutter");
  await page.goto("/problem/P42K");
  await expect(page.getByRole("region", { name: "Accepted solutions" }))
    .toContainText("WilliamRagstad/Tic-Tac-Toe");
});
test("community challenge creation and unknown challenge errors", async ({ page }) => {
  await page.goto("/submit");
  await page.getByLabel("Title", { exact: true }).fill("Test challenge");
  await page.getByLabel("Description").fill("Build a useful test application");
  await page.getByLabel("Author", { exact: true }).fill("Test Author");
  await page.getByLabel("Tags (comma separated)").fill("testing, web");
  await page.getByRole("button", { name: "Submit challenge", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Test challenge", exact: true }).first(),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Test challenge", exact: true }).first(),
  ).toBeVisible();
  await page.goto("/problem/does-not-exist");
  await expect(page.getByRole("alert")).toContainText("Challenge not found");
});

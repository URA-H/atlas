// Verification script for /new coffee karte creation form.
// Bypasses OAuth by inserting a Session row directly, sets the
// authjs.session-token cookie in a Playwright browser context.

import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";
import { randomBytes } from "node:crypto";
import { mkdir } from "node:fs/promises";

const SCREENSHOTS = "screenshots";
const BASE = "http://localhost:3000";

async function main() {
  await mkdir(SCREENSHOTS, { recursive: true });
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("FAIL: no user in DB. Sign in via Google first.");
    process.exit(1);
  }
  console.log(`Using user: ${user.email}`);

  const sessionToken = randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  console.log(`Created session: ${sessionToken.slice(0, 10)}…`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  await context.addCookies([
    {
      name: "authjs.session-token",
      value: sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  const page = await context.newPage();

  const results = [];
  function record(label, ok, detail) {
    results.push({ label, ok, detail });
    console.log(`${ok ? "✅" : "❌"} ${label} — ${detail}`);
  }

  // ---------- /new desktop render ----------
  await page.goto(`${BASE}/new`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("form", { timeout: 5000 });

  const url1 = page.url();
  record(
    "/new served to authenticated session",
    url1.endsWith("/new"),
    `landed on ${url1}`,
  );

  // Wait for fonts (next/font loads with display: swap; we wait a moment)
  await page.waitForTimeout(800);

  await page.screenshot({
    path: `${SCREENSHOTS}/new-desktop-initial.png`,
    fullPage: true,
  });

  // ---------- check Fraunces / Caveat applied ----------
  const fontInfo = await page.evaluate(() => {
    const h2 = document.querySelector("h2");
    const subtitle = document.querySelector("h2 + span"); // not used; we'll use other selectors
    const hand = document.querySelector(".font-hand, [class*='font-hand']");
    return {
      h2FontFamily: h2 ? getComputedStyle(h2).fontFamily : null,
      handFontFamily: hand ? getComputedStyle(hand).fontFamily : null,
    };
  });
  record(
    "Section headings (h2) use Fraunces",
    /Fraunces/i.test(fontInfo.h2FontFamily ?? ""),
    `h2 font-family: ${fontInfo.h2FontFamily}`,
  );
  record(
    "Hand-written accents use Caveat",
    /Caveat/i.test(fontInfo.handFontFamily ?? ""),
    `font-hand font-family: ${fontInfo.handFontFamily}`,
  );

  // ---------- section dividers ----------
  const sectionCount = await page.locator("section").count();
  const dividerCount = await page.locator("section .border-b").count();
  record(
    "Section dividers exist",
    sectionCount >= 4 && dividerCount >= 4,
    `${sectionCount} sections, ${dividerCount} bottom-borders found`,
  );

  // ---------- roast pill selection ----------
  const mediumPill = page.getByRole("button", { name: /^Medium$/ });
  await mediumPill.click();
  await page.waitForTimeout(200);
  const ariaPressed = await mediumPill.getAttribute("aria-pressed");
  const pillStyles = await mediumPill.evaluate(
    (el) => {
      const cs = getComputedStyle(el);
      return { backgroundColor: cs.backgroundColor, color: cs.color };
    },
  );
  // Check the bg is the primary brown (oklch translates to rgb in browser; we just check it's not paper)
  const isBrownish = !/255,\s*255,\s*255/.test(pillStyles.backgroundColor);
  record(
    "Roast pill toggles aria-pressed",
    ariaPressed === "true",
    `aria-pressed=${ariaPressed}, bg=${pillStyles.backgroundColor}`,
  );
  record(
    "Roast pill changes background when selected",
    isBrownish,
    `bg after click: ${pillStyles.backgroundColor}`,
  );

  // ---------- brew method pill ----------
  const v60Pill = page.locator('button:has-text("V60")').first();
  await v60Pill.scrollIntoViewIfNeeded();
  await v60Pill.click({ timeout: 5000 });
  await page.waitForTimeout(200);
  const v60Pressed = await v60Pill.getAttribute("aria-pressed");
  record(
    "Brew method (V60) pill toggles",
    v60Pressed === "true",
    `aria-pressed=${v60Pressed}`,
  );

  // ---------- flavor wheel (desktop) ----------
  const desktopWheel = page.locator("svg[aria-label='SCA フレーバーホイール']");
  const wheelVisible = await desktopWheel.isVisible();
  record(
    "Flavor wheel SVG renders on desktop",
    wheelVisible,
    `aria-label svg visible: ${wheelVisible}`,
  );

  // ---------- score slider ----------
  const acidityInput = page.locator('input[name="scoreAcidity"]');
  await acidityInput.evaluate((el) => {
    // React tracks the value via a private setter on the input prototype.
    // Direct el.value = ... doesn't notify React. Call the native setter
    // explicitly so React's synthetic event handler sees the change.
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(el, "8");
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(200);
  // Find the span next to it (last sibling in our grid)
  const acidityRow = page.locator('input[name="scoreAcidity"]').locator("xpath=..");
  const displayedScore = await acidityRow
    .locator("xpath=./span[last()]")
    .innerText();
  record(
    "Score slider value reflects in adjacent text",
    displayedScore.trim() === "8",
    `displayed: "${displayedScore}"`,
  );

  // ---------- mobile viewport: flavor wheel becomes accordion ----------
  await page.setViewportSize({ width: 380, height: 800 });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: `${SCREENSHOTS}/new-mobile.png`,
    fullPage: true,
  });
  const wheelVisibleMobile = await desktopWheel.isVisible();
  const accordionVisible = await page
    .locator("button[aria-expanded]")
    .first()
    .isVisible();
  record(
    "Flavor wheel SVG hidden on mobile (<md)",
    !wheelVisibleMobile,
    `SVG still visible: ${wheelVisibleMobile}`,
  );
  record(
    "Mobile accordion (aria-expanded buttons) visible",
    accordionVisible,
    `accordion visible: ${accordionVisible}`,
  );

  // ---------- submit and check redirect ----------
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(200);
  await page.locator('input[name="name"]').fill("Verify Test — Yirgacheffe");
  await page.locator('input[name="roaster"]').fill("VerifyRoaster");
  await page.locator('input[name="origin"]').fill("Ethiopia");

  // Open Fruity > Berry tertiary by clicking Berry sub-segment if visible.
  // The desktop wheel exists; we can click the inner ring "Fruity" segment via title attr.
  try {
    await page.locator('title:has-text("Fruity"):not(:has-text("›"))').first().evaluate((t) => t.parentElement?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  } catch {}

  const before = page.url();
  await page.getByRole("button", { name: "綴じる" }).click();
  // Wait for redirect
  await page.waitForURL(/\/coffee\/[a-z0-9]+/i, { timeout: 10_000 });
  const after = page.url();
  record(
    "Submit redirects to /coffee/[id]",
    /\/coffee\/[a-z0-9]+/i.test(after),
    `${before} -> ${after}`,
  );

  await page.screenshot({
    path: `${SCREENSHOTS}/coffee-detail.png`,
    fullPage: true,
  });

  // Verify the title shows the saved name
  const detailTitle = await page.locator("h1").innerText();
  record(
    "Detail page shows saved name",
    detailTitle.includes("Verify Test"),
    `h1: "${detailTitle}"`,
  );

  // ---------- close & summarize ----------
  await browser.close();

  // Cleanup the test session we created
  await prisma.session.delete({ where: { sessionToken } });
  await prisma.$disconnect();

  const fail = results.find((r) => !r.ok);
  console.log("\n=== SUMMARY ===");
  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}: ${r.label}`);
  process.exit(fail ? 1 : 0);
}

main().catch(async (err) => {
  console.error("Script error:", err);
  // Best-effort cleanup of dangling test sessions
  try {
    const cleanup = new PrismaClient();
    await cleanup.session.deleteMany({
      where: { expires: { lt: new Date(Date.now() + 30 * 60 * 1000) } },
    });
    await cleanup.$disconnect();
  } catch {}
  process.exit(2);
});

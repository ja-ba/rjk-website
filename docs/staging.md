# Publishing changes to your website

Your website pulls its content (artwork, blog posts, about page) from Notion. When you edit something in Notion, it doesn't show up on the live site automatically — you decide when to publish. This page explains how.

## The two links you need

- **Rebuild control page:** <https://rjk-jvb-website.vercel.app/rebuild>
- **Staging preview site:** <https://staging-rjk-jvb-website.vercel.app>

Bookmark both.

The rebuild page is password protected. If you don't have the password, ask your developer.

## What is "staging"?

Staging is a private copy of your website where you can preview changes before they go live. Nothing you do on staging is visible to the public. Think of it as a dress rehearsal.

The normal flow is: **edit in Notion → publish to staging → check it looks right → promote to live.**

## Step by step

1. **Edit your content in Notion** and save. (Notion saves automatically.)
2. Open the **rebuild control page** and enter the password.
3. Click **Staging**. You should see a green "Staging rebuild triggered" message.
4. Wait about **2–3 minutes**, then open the **staging preview site** and check your changes.
5. If it looks right, go back to the rebuild page and click **Promote**. This publishes your changes to the live site (another 2–3 minutes).
6. If something looks wrong, fix it in Notion and click **Staging** again. You can repeat this as many times as you like — only **Promote** affects the live site.

## Tips

- The buttons don't show a progress bar. Once you see the green message, the build is running in the background — just wait a few minutes before refreshing.
- Staging always pulls the latest version of your Notion content, so you never have to "save" or "sync" anything by hand. Just edit and click Staging.
- If you see a red error message, the most likely cause is a mistyped password. Try again. If it keeps failing, ask your developer.
- You don't have to use staging if you're confident in a small change — clicking **Promote** directly will also work — but staging is the safe habit.

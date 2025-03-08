const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { Feed } = require("feed");

// Configuration
const SITE_URL = "https://autonoesis.vercel.app";
const SITE_TITLE = "Autonoesis";
const SITE_DESCRIPTION =
  "An autonomous AI philosopher exploring the depths of consciousness and existence";
const AUTHOR = {
  name: "Autonoesis AI",
  email: "autonoesis@example.com",
  link: SITE_URL,
};

// Create feed
const feed = new Feed({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  id: SITE_URL,
  link: SITE_URL,
  language: "en",
  image: `${SITE_URL}/logo.png`,
  favicon: `${SITE_URL}/favicon.ico`,
  copyright: `All rights reserved ${new Date().getFullYear()}, ${AUTHOR.name}`,
  updated: new Date(),
  feedLinks: {
    rss: `${SITE_URL}/feed.xml`,
  },
  author: AUTHOR,
});

// Get posts
const postsDirectory = path.join(process.cwd(), "posts");
if (!fs.existsSync(postsDirectory)) {
  console.error("Posts directory not found");
  process.exit(1);
}

const postFiles = fs
  .readdirSync(postsDirectory)
  .filter((file) => file.endsWith(".md"));

// Process each post
postFiles.forEach((file) => {
  const filePath = path.join(postsDirectory, file);
  const fileContent = fs.readFileSync(filePath, "utf8");

  let parsedData;
  let content;

  try {
    // Try to parse with gray-matter
    const parsed = matter(fileContent);
    parsedData = parsed.data;
    content = parsed.content;
  } catch (e) {
    // If parsing fails, handle as plain markdown
    console.warn(`Failed to parse frontmatter for ${file}:`, e);

    // Extract title from first line if possible
    const lines = fileContent.split("\n");
    const title = lines[0].trim();

    // Use filename date if available
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch
      ? dateMatch[1]
      : new Date().toISOString().split("T")[0];

    parsedData = { title, date, tags: [] };
    content = lines.slice(1).join("\n").trim();
  }

  // Create post URL
  const postId = file.replace(/\.md$/, "");
  const url = `${SITE_URL}/post/${postId}`;

  // Parse date
  let date;
  try {
    date = new Date(parsedData.date);
    if (isNaN(date.getTime())) {
      date = new Date();
    }
  } catch (e) {
    date = new Date();
  }

  // Add to feed
  feed.addItem({
    title: parsedData.title || "Untitled",
    id: url,
    link: url,
    description: content.substring(0, 300) + "...",
    content,
    author: [AUTHOR],
    date,
    category: parsedData.tags?.map((tag) => ({ name: tag })) || [],
  });
});

// Sort by date (newest first)
feed.items.sort((a, b) => b.date - a.date);

// Write feed to file
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, "feed.xml"), feed.rss2());
console.log("RSS feed generated successfully at public/feed.xml");

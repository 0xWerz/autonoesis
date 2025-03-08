import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET(request: NextRequest) {
  try {
    const postsDirectory = path.join(process.cwd(), "posts");

    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json({ posts: [] });
    }

    const fileNames = fs.readdirSync(postsDirectory);

    const posts = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        // Read file content
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Parse frontmatter
        let parsedData;
        let content;

        try {
          // Try to parse with gray-matter
          const parsed = matter(fileContents);
          parsedData = parsed.data;
          content = parsed.content;
        } catch (e) {
          // If parsing fails, handle as plain markdown
          console.warn(`Failed to parse frontmatter for ${fileName}:`, e);

          // Extract title from first line if possible
          const lines = fileContents.split("\n");
          const title = lines[0].trim();

          // Use filename date if available
          const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
          const date = dateMatch
            ? dateMatch[1]
            : new Date().toISOString().split("T")[0];

          parsedData = { title, date, tags: [] };
          content = lines.slice(1).join("\n").trim();
        }

        // Generate random position for chaos view
        const randomX = Math.floor(Math.random() * 70);
        const randomY = Math.floor(Math.random() * 70);
        const randomRotation = Math.random() * 10 - 5;

        // Return post data
        return {
          id: fileName.replace(/\.md$/, ""),
          title: parsedData.title || "Untitled",
          date: parsedData.date || new Date().toISOString().split("T")[0],
          content: content.trim(),
          tags: parsedData.tags || [],
          x: randomX,
          y: randomY,
          rotation: randomRotation,
          scale: 0.9 + Math.random() * 0.3,
          opacity: 0.7 + Math.random() * 0.3,
          zIndex: Math.floor(Math.random() * 10),
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

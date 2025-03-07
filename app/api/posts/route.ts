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
        const { data, content } = matter(fileContents);

        // Generate random position for chaos view
        const randomX = Math.floor(Math.random() * 70);
        const randomY = Math.floor(Math.random() * 70);
        const randomRotation = Math.random() * 10 - 5;

        // Return post data
        return {
          id: fileName.replace(/\.md$/, ""),
          title: data.title || "Untitled",
          date: data.date || new Date().toISOString().split("T")[0],
          content: content,
          tags: data.tags || [],
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

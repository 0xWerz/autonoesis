import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const postsDirectory = path.join(process.cwd(), "posts");

    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json(
        { error: "Posts directory not found" },
        { status: 404 }
      );
    }

    // Find the post file
    const postFile = `${postId}.md`;
    const fullPath = path.join(postsDirectory, postFile);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Read file content
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Parse frontmatter and content
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const htmlContent = marked(content);

    // Return post data
    return NextResponse.json({
      post: {
        id: postId,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString().split("T")[0],
        content: htmlContent,
        tags: data.tags || [],
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

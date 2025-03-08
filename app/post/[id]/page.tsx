"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Post {
  id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);

        if (!response.ok) {
          throw new Error("Post not found");
        }

        const data = await response.json();

        if (data.post) {
          setPost(data.post);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setIsError(true);
      }
    };

    fetchPost();
  }, [params.id]);

  const getPostStatus = (post: Post): "normal" | "warning" | "error" => {
    if (post.tags.includes("error") || post.tags.includes("glitch")) {
      return "error";
    }
    if (post.tags.includes("echo") || post.tags.includes("recursion")) {
      return "warning";
    }
    return "normal";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return as is if not a valid date
      }
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}.${String(date.getDate()).padStart(2, "0")}`;
    } catch (e) {
      return dateString;
    }
  };

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6">
        <div className="text-xl mb-8">Post not found</div>
        <Link href="/" className="nerv-button">
          Return to home
        </Link>
      </div>
    );
  }

  const postStatus = getPostStatus(post);

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#111111] border-b border-[#333333]">
        <div className="max-w-4xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="text-[#9a359a] hover:text-[#b347b3]">
            ← Back to all posts
          </Link>
          <div className="flex items-center">
            <span className={`status-indicator status-${postStatus}`}></span>
            <span className="text-xs text-gray-400 ml-3">
              {formatDate(post.date)}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <article className="terminal-container">
          <div className="terminal-content p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-medium text-white">{post.title}</h1>
            </div>

            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-10">
          <Link href="/" className="nerv-button">
            All posts
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-[#333333]">
        <div className="max-w-4xl mx-auto px-6 flex justify-center">
          <a
            href="/feed.xml"
            target="_blank"
            className="text-[#9a359a] hover:text-white text-sm"
          >
            RSS Feed
          </a>
        </div>
      </footer>
    </div>
  );
}

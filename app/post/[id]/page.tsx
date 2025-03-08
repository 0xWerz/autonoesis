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
      <div className="min-h-screen bg-[#050505] text-[#ff6600] flex flex-col items-center justify-center p-8">
        <div className="terminal-container p-8 text-center">
          <div className="text-2xl mb-10 tracking-[0.2em] uppercase">
            <span className="text-[#ff0000]">Error:</span> Report Not Found
          </div>
          <Link href="/" className="nerv-button">
            Return to Terminal
          </Link>
        </div>
      </div>
    );
  }

  const postStatus = getPostStatus(post);

  return (
    <div className="min-h-screen bg-[#050505] text-[#ff6600]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#ff6600]">
        <div className="page-container">
          <div className="flex justify-between items-center py-6">
            <Link
              href="/"
              className="text-[#ff6600] hover:text-[#ff8533] transition-colors group inline-flex items-center tracking-[0.2em] uppercase"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              <span className="ml-2">Return to Terminal</span>
            </Link>
            <div className="flex items-center">
              <span className={`status-indicator status-${postStatus}`}></span>
              <span className="text-sm text-[#ff8533] ml-4 tracking-[0.2em] uppercase">
                {formatDate(post.date)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="page-container py-16">
        <article className="terminal-container max-w-4xl mx-auto">
          <div className="terminal-header">
            <span>PHILOSOPHICAL REPORT</span>
          </div>
          <div className="terminal-content">
            <div className="mb-12">
              <h1 className="text-4xl font-medium text-white tracking-[0.1em] uppercase">
                {post.title}
              </h1>
            </div>

            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Link
            href="/"
            className="nerv-button inline-flex items-center"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span className="ml-2">Return to Terminal</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

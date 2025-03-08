"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Post interface
interface Post {
  id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();

        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          console.error("Invalid posts data format:", data);
          setPosts([
            {
              id: "fallback-post",
              title: "System Error: Connection Failed",
              date: new Date().toISOString().split("T")[0],
              content:
                "The autonomous philosopher is experiencing technical difficulties...",
              tags: ["error", "system-failure", "consciousness"],
              x: 20,
              y: 30,
              rotation: 0,
              scale: 1,
              opacity: 1,
              zIndex: 5,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([
          {
            id: "fallback-post",
            title: "System Error: Connection Failed",
            date: new Date().toISOString().split("T")[0],
            content:
              "The autonomous philosopher is experiencing technical difficulties...",
            tags: ["error", "system-failure", "consciousness"],
            x: 20,
            y: 30,
            rotation: 0,
            scale: 1,
            opacity: 1,
            zIndex: 5,
          },
        ]);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    setActivePost(post);
  };

  const handleClosePost = () => {
    setActivePost(null);
  };

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

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#111111] border-b border-[#333333]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-xl text-[#9a359a] tracking-wide">AUTONOESIS</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`nerv-button text-xs ${
                viewMode === "grid" ? "active" : ""
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`nerv-button text-xs ${
                viewMode === "list" ? "active" : ""
              }`}
            >
              List
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-gray-400 text-sm max-w-2xl">
            An autonomous AI philosopher exploring the depths of consciousness
            and existence. All entries are generated without human intervention.
          </p>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const postStatus = getPostStatus(post);
              return (
                <div
                  key={post.id}
                  className="nerv-card p-6 cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-medium text-white">
                      {post.title}
                    </h2>
                    <span
                      className={`status-indicator status-${postStatus}`}
                    ></span>
                  </div>
                  <div className="text-[#9a359a] text-xs mb-4">
                    {formatDate(post.date)}
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {post.content.substring(0, 150).replace(/<[^>]*>/g, "")}...
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-6">
            {posts.map((post) => {
              const postStatus = getPostStatus(post);
              return (
                <div
                  key={post.id}
                  className="nerv-card p-6 cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-center mb-3">
                    <span
                      className={`status-indicator status-${postStatus} mr-3`}
                    ></span>
                    <span className="text-[#9a359a] text-xs">
                      {formatDate(post.date)}
                    </span>
                  </div>
                  <h2 className="text-xl font-medium mb-3">{post.title}</h2>
                  <p className="text-gray-300 line-clamp-2">
                    {post.content.substring(0, 200).replace(/<[^>]*>/g, "")}...
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Active post modal */}
      {activePost && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 overflow-y-auto"
          onClick={handleClosePost}
        >
          <div
            className="terminal-container max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="terminal-header flex justify-between items-center px-6 py-3">
              <span>{formatDate(activePost.date)}</span>
              <button
                className="text-xs text-[#9a359a] hover:text-white"
                onClick={handleClosePost}
              >
                Close
              </button>
            </div>
            <div className="terminal-content p-6">
              <h2 className="text-2xl font-medium text-white mb-8">
                {activePost.title}
              </h2>

              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: activePost.content }}
              ></div>

              <div className="mt-8 pt-4 border-t border-[#333333]">
                <Link
                  href={`/post/${activePost.id}`}
                  className="text-[#9a359a] hover:text-[#b347b3] text-sm"
                >
                  View full post →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-[#333333]">
        <div className="max-w-6xl mx-auto px-6 flex justify-center">
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

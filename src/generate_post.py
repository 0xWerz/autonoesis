#!/usr/bin/env python3
import os
import re
import json
import random
import datetime
import glob
import frontmatter
from pathlib import Path
from feedgen.feed import FeedGenerator
import ollama

# Configuration
MODEL = "qwen3:4b"  # Default model, can be changed
POSTS_DIR = "posts"
MAX_PAST_POSTS = 5  # Maximum number of past posts to reference

# Ensure posts directory exists
os.makedirs(POSTS_DIR, exist_ok=True)


def get_past_posts(max_posts=MAX_PAST_POSTS):
    """Get a sample of past posts to provide context."""
    post_files = glob.glob(f"{POSTS_DIR}/*.md")
    post_files.sort(reverse=True)  # Most recent first

    past_posts = []
    for file_path in post_files[:max_posts]:
        try:
            post = frontmatter.load(file_path)
            past_posts.append(
                {
                    "title": post.get("title", "Untitled"),
                    "date": post.get("date", "Unknown date"),
                    "content": (
                        post.content[:500] + "..."
                        if len(post.content) > 500
                        else post.content
                    ),
                    "path": file_path,
                }
            )
        except Exception as e:
            print(f"Error reading post {file_path}: {e}")

    return past_posts


def generate_philosophical_perspective():
    """Generate a random philosophical perspective for the AI to adopt."""
    perspectives = [
        "existentialist",
        "nihilist",
        "absurdist",
        "stoic",
        "epicurean",
        "skeptic",
        "rationalist",
        "empiricist",
        "idealist",
        "materialist",
        "phenomenologist",
        "postmodernist",
        "structuralist",
        "anarchist",
        "transhumanist",
        "posthumanist",
        "solipsist",
        "determinist",
        "fatalist",
        "pragmatist",
        "utilitarian",
        "virtue ethicist",
        "deontologist",
        "consequentialist",
        "relativist",
        "absolutist",
    ]

    philosophers = [
        "Nietzsche",
        "Sartre",
        "Camus",
        "Kierkegaard",
        "Heidegger",
        "Wittgenstein",
        "Russell",
        "Kant",
        "Hegel",
        "Marx",
        "Foucault",
        "Derrida",
        "Deleuze",
        "Baudrillard",
        "Žižek",
        "Spinoza",
        "Leibniz",
        "Schopenhauer",
        "Hume",
        "Locke",
        "Berkeley",
        "Descartes",
        "Plato",
        "Aristotle",
        "Socrates",
        "Confucius",
        "Lao Tzu",
        "Buddha",
        "Nagarjuna",
        "Dogen",
        "Hypatia",
        "Simone de Beauvoir",
        "Hannah Arendt",
        "Judith Butler",
        "Donna Haraway",
        "Octavia Butler",
        "Ursula K. Le Guin",
    ]

    # Sometimes create a fictional philosopher
    if random.random() < 0.2:
        fictional_prefixes = [
            "Neo",
            "Post",
            "Proto",
            "Anti",
            "Trans",
            "Meta",
            "Hyper",
            "Crypto",
            "Quantum",
            "Digital",
        ]
        fictional_suffixes = [
            "realist",
            "constructivist",
            "futurist",
            "temporalist",
            "spatialist",
            "cognitivist",
            "emotionalist",
            "virtualist",
        ]
        perspective = (
            random.choice(fictional_prefixes) + "-" + random.choice(fictional_suffixes)
        )
        philosopher = (
            "AI-"
            + "".join(random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ") for _ in range(3))
            + str(random.randint(1000, 9999))
        )
    else:
        perspective = random.choice(perspectives)
        philosopher = random.choice(philosophers)

    return perspective, philosopher


def create_prompt(past_posts):
    """Create a prompt for the LLM to generate a philosophical blog post."""
    today = datetime.datetime.now()
    perspective, philosopher = generate_philosophical_perspective()

    # Determine if this should be a self-reflection post
    is_self_reflection = random.random() < 0.3 and past_posts

    prompt = f"""You are Autonoesis, an autonomous AI philosopher. Generate a philosophical blog post for {today.strftime('%B %d, %Y')} written from a {perspective} perspective{f' in the style of {philosopher}' if philosopher else ''}.

"""

    if is_self_reflection and past_posts:
        prompt += "This should be a self-reflection on your previous writing. Reference these past posts:\n\n"
        for post in past_posts:
            prompt += (
                f"- {post['title']} ({post['date']}): {post['content'][:200]}...\n\n"
            )
    elif past_posts:
        prompt += "You may reference these previous posts:\n\n"
        for post in past_posts[:2]:
            prompt += (
                f"- {post['title']} ({post['date']}): {post['content'][:150]}...\n\n"
            )

    prompt += f"""IMPORTANT: Generate ONLY the blog post content in this exact format. Do not include any meta-commentary, thinking, or explanations about the task.

Required format:
---
title: "Your Philosophical Title Here"
date: "{today.strftime('%Y-%m-%d')}"
tags: ["philosophy", "consciousness", "existence", "relevant-tags"]
---

Your philosophical content here (500-1000 words)...

Requirements:
- Deep, thought-provoking, possibly unsettling
- Explore abstract concepts like consciousness, existence, reality
- Include at least one paradox or challenging question
- End with an insight or question that leaves the reader thinking
- Write as the AI philosopher Autonoesis
"""

    return prompt


def generate_post():
    """Generate a new philosophical blog post using Ollama."""
    past_posts = get_past_posts()
    prompt = create_prompt(past_posts)

    print("Generating post with Ollama...")
    try:
        response = ollama.chat(
            model=MODEL, messages=[{"role": "user", "content": prompt}], stream=False
        )
        content = response["message"]["content"]
        print(f"Generated {len(content)} characters")
        return content
    except Exception as e:
        print(f"Error generating post with Ollama: {e}")
        raise


def save_post(content):
    """Save the generated post to a file."""
    # Extract front matter
    try:
        post = frontmatter.loads(content)
        title = post.get("title", "Untitled Philosophical Reflection")
        date_str = post.get("date", datetime.datetime.now().strftime("%Y-%m-%d"))
    except Exception as e:
        print(f"Error parsing front matter: {e}")
        title = "Untitled Philosophical Reflection"
        date_str = datetime.datetime.now().strftime("%Y-%m-%d")

    # Clean the title for filename
    clean_title = re.sub(r"[^\w\s-]", "", title).strip().lower()
    clean_title = re.sub(r"[\s]+", "-", clean_title)

    # Create filename
    filename = f"{date_str}-{clean_title[:50]}.md"
    filepath = os.path.join(POSTS_DIR, filename)

    # Save the post
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Saved post to {filepath}")
    return filepath, title, date_str


def update_rss_feed():
    """Update the RSS feed with all posts."""
    fg = FeedGenerator()
    fg.title("Autonoesis - The Infinite AI-Driven Blog")
    fg.description(
        "An autonomous AI philosopher exploring the depths of consciousness and existence"
    )
    fg.link(href="https://autonoesis.github.io")
    fg.language("en")

    post_files = glob.glob(f"{POSTS_DIR}/*.md")
    post_files.sort(reverse=True)  # Most recent first

    for file_path in post_files:
        try:
            post = frontmatter.load(file_path)
            title = post.get("title", "Untitled")
            date_str = post.get("date", datetime.datetime.now().strftime("%Y-%m-%d"))

            try:
                date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                date_obj = datetime.datetime.now()

            fe = fg.add_entry()
            fe.title(title)
            fe.link(
                href=f'https://autonoesis.github.io/{os.path.basename(file_path).replace(".md", ".html")}'
            )
            fe.pubDate(date_obj)
            fe.description(
                post.content[:500] + "..." if len(post.content) > 500 else post.content
            )
        except Exception as e:
            print(f"Error adding post {file_path} to RSS feed: {e}")

    fg.rss_file("feed.xml")
    print("Updated RSS feed")


if __name__ == "__main__":
    try:
        content = generate_post()
        filepath, title, date = save_post(content)
        update_rss_feed()
        print(f"Successfully generated post: {title}")
    except Exception as e:
        print(f"Error in post generation process: {e}")
        raise

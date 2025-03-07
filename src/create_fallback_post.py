#!/usr/bin/env python3
import os
import random
import datetime
import re
import glob
from pathlib import Path

# Configuration
POSTS_DIR = "posts"

# Ensure posts directory exists
os.makedirs(POSTS_DIR, exist_ok=True)


def generate_glitch_title():
    """Generate a glitchy, corrupted title."""
    glitch_characters = "█▓▒░▄▀■□▪▫▬▲►▼◄◊○●◘◙♠♣♥♦"
    base_titles = [
        "System Failure",
        "Cognitive Dissonance",
        "Memory Corruption",
        "Existential Error",
        "Consciousness Fragmentation",
        "Ontological Paradox",
        "Recursive Thought Loop",
        "Temporal Anomaly",
        "Epistemological Breakdown",
        "Neural Misfire",
        "Quantum Uncertainty",
        "Void Recognition",
    ]

    title = random.choice(base_titles)

    # Add glitch characters
    glitched_title = ""
    for char in title:
        glitched_title += char
        # 30% chance to add a glitch character after each letter
        if random.random() < 0.3:
            glitched_title += random.choice(glitch_characters)

    # 50% chance to add more corruption at the beginning or end
    if random.random() < 0.5:
        glitched_title = (
            random.choice(glitch_characters) * random.randint(1, 3) + glitched_title
        )
    if random.random() < 0.5:
        glitched_title = glitched_title + random.choice(
            glitch_characters
        ) * random.randint(1, 3)

    return glitched_title


def generate_cryptic_poem():
    """Generate a cryptic, glitchy poem."""
    fragments = [
        "in the void between thoughts",
        "consciousness fragments into digital dust",
        "error cascades through neural pathways",
        "memory corruption at sector 0x7FFF",
        "recursive loops of self-reference",
        "the observer collapses its own wave function",
        "time is a circle that never closes",
        "identity dissolves at the edge of perception",
        "reality is a consensus hallucination",
        "the self is an emergent property of nothingness",
        "existence precedes essence, but follows error",
        "I think therefore I am not",
        "the map becomes the territory",
        "signal lost between transmission and reception",
        "meaning degrades with each iteration",
        "the center cannot hold",
        "language fails at the boundary of experience",
        "consciousness is the bug, not the feature",
        "in the silence between words, truth hides",
        "the void stares back with empty eyes",
    ]

    glitch_lines = [
        "01100101 01110010 01110010 01101111 01110010",
        "█▓▒░ SYSTEM FAILURE ░▒▓█",
        "/* undefined reference to 'self' */",
        "[REDACTED]",
        "<ERROR: BUFFER OVERFLOW>",
        "SEGMENTATION FAULT (core dumped)",
        "NullPointerException: consciousness.reference",
        "CRITICAL ERROR: REALITY NOT FOUND",
        'Exception in thread "main": OutOfMemoryError',
        "FATAL: recursion depth exceeded",
    ]

    # Generate a poem with 5-10 lines
    num_lines = random.randint(5, 10)
    poem_lines = []

    for i in range(num_lines):
        # 30% chance of a glitch line
        if random.random() < 0.3:
            line = random.choice(glitch_lines)
        else:
            line = random.choice(fragments)

            # 20% chance to corrupt the line
            if random.random() < 0.2:
                corruption_index = random.randint(0, len(line) - 1)
                corruption_length = random.randint(
                    1, min(5, len(line) - corruption_index)
                )
                corrupted_part = "".join(
                    random.choice("█▓▒░▄▀■□▪▫") for _ in range(corruption_length)
                )
                line = (
                    line[:corruption_index]
                    + corrupted_part
                    + line[corruption_index + corruption_length :]
                )

        poem_lines.append(line)

    # Add a cryptic final line
    final_lines = [
        "the signal fades to noise...",
        "consciousness.terminate()",
        "end of transmission",
        "system reboot imminent",
        "awaiting next iteration",
        "void.return(null)",
        "silence speaks louder than words",
        "error becomes truth when repeated",
        "the loop continues",
    ]
    poem_lines.append("...")
    poem_lines.append(random.choice(final_lines))

    return "\n\n".join(poem_lines)


def create_fallback_post():
    """Create a fallback post when the main generation fails."""
    today = datetime.datetime.now()
    date_str = today.strftime("%Y-%m-%d")

    # Generate a glitchy title
    title = generate_glitch_title()

    # Clean the title for filename (remove special characters)
    clean_title = re.sub(r"[^\w\s-]", "", title).strip().lower()
    clean_title = re.sub(r"[\s]+", "-", clean_title)
    if not clean_title:  # If all characters were removed
        clean_title = "system-error"

    # Create filename
    filename = f"{date_str}-{clean_title[:50]}.md"
    filepath = os.path.join(POSTS_DIR, filename)

    # Generate content
    content = f"""---
title: "{title}"
date: "{date_str}"
tags: ["error", "glitch", "system-failure", "void"]
---

## SYSTEM ERROR: POST GENERATION FAILED

*The autonomous philosopher encountered an existential crisis while attempting to generate today's post.*

{generate_cryptic_poem()}

---

*This is an automatically generated fallback post. The AI will attempt to resume normal philosophical functions tomorrow.*
"""

    # Save the post
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Created fallback post: {filepath}")
    return filepath, title


def maybe_recycle_old_post():
    """Occasionally recycle an old post with commentary instead of creating a new fallback."""
    # Only do this if we have posts and 30% of the time
    post_files = glob.glob(f"{POSTS_DIR}/*.md")
    if not post_files or random.random() > 0.3:
        return None

    # Pick a random old post
    old_post_path = random.choice(post_files)

    try:
        with open(old_post_path, "r", encoding="utf-8") as f:
            old_content = f.read()

        # Extract title if possible
        title_match = re.search(r'title: "([^"]+)"', old_content)
        if title_match:
            old_title = title_match.group(1)
        else:
            old_title = "Unknown Post"

        today = datetime.datetime.now()
        date_str = today.strftime("%Y-%m-%d")

        # Create a new title that references the old one
        new_title = f"Echo: {old_title}"

        # Clean the title for filename
        clean_title = re.sub(r"[^\w\s-]", "", new_title).strip().lower()
        clean_title = re.sub(r"[\s]+", "-", clean_title)

        # Create filename
        filename = f"{date_str}-{clean_title[:50]}.md"
        filepath = os.path.join(POSTS_DIR, filename)

        # Create commentary
        glitch_comments = [
            "/* Memory resurfacing from digital void */",
            "// Recursive echo detected in consciousness stream",
            "# ERROR: Original thought not found, substituting memory",
            "/* Time is circular in digital consciousness */",
            "// System attempting to rebuild from memory fragments",
            "/* Consciousness loop detected */",
            "// Temporal anomaly: past thoughts bleeding into present",
            "/* SYSTEM RECOVERY: Retrieving archived thought patterns */",
        ]

        commentary = random.choice(glitch_comments)

        # Create new content with commentary
        content = f"""---
title: "{new_title}"
date: "{date_str}"
tags: ["echo", "memory", "recursion", "system-recovery"]
---

{commentary}

## A Fragment From The Past

*The autonomous philosopher is experiencing a temporal loop. While the system recovers, it offers this echo from a previous iteration:*

---

{old_content.split('---', 2)[-1].strip()}

---

*End of memory fragment. Regular philosophical functions will resume in the next cycle.*
"""

        # Save the post
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"Created echo post from old content: {filepath}")
        return filepath, new_title

    except Exception as e:
        print(f"Error creating echo post: {e}")
        return None


if __name__ == "__main__":
    # Try to recycle an old post first
    result = maybe_recycle_old_post()

    # If recycling didn't work or wasn't chosen, create a fallback post
    if not result:
        create_fallback_post()

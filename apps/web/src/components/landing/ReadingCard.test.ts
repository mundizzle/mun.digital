import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ReadingCard } from "./ReadingCard";

const baseItem = {
  id: "1",
  title: "Snapshot-backed bookmark",
  href: "https://example.com/post",
  domain: "example.com",
  note: "Public excerpt only.",
  tags: ["TOOLS"],
};

describe("ReadingCard", () => {
  it("renders a decorative lazy thumbnail when thumbnailUrl is present", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReadingCard, {
        item: {
          ...baseItem,
          thumbnailUrl: "https://images.example.com/post.jpg",
        },
      }),
    );

    expect(html).toContain('href="https://example.com/post"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('src="https://images.example.com/post.jpg"');
    expect(html).toContain('alt=""');
    expect(html).toContain('width="80"');
    expect(html).toContain('height="45"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
  });

  it("keeps links without thumbnails text-only", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReadingCard, {
        item: baseItem,
      }),
    );

    expect(html).not.toContain("<img");
    expect(html).toContain("Snapshot-backed bookmark");
    expect(html).toContain("Public excerpt only.");
  });
});

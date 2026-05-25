import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { tokenMetadata } from "@mun.digital/tokens/metadata";

function TokenReference() {
  const categories = Array.from(new Set(tokenMetadata.tokens.map((token) => token.category)));

  return (
    <div className="max-w-5xl text-foreground">
      <h1 className="m-0 text-2xl font-semibold">Design Tokens</h1>
      <p className="my-3 max-w-[72ch] font-sans text-sm leading-6 text-muted-foreground">
        Generated from <code>@mun.digital/tokens/metadata</code>. These tokens are the shared design source for the portfolio app, docs, and Storybook.
      </p>
      <div className="grid gap-8">
        {categories.map((category) => {
          const tokens = tokenMetadata.tokens.filter((token) => token.category === category);

          return (
            <section key={category} aria-labelledby={`tokens-${category.toLowerCase()}`}>
              <h2 className="mb-3 text-lg font-semibold" id={`tokens-${category.toLowerCase()}`}>
                {category}
              </h2>
              <div className="overflow-x-auto border border-border">
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="sr-only">{category} design tokens</caption>
                  <thead>
                    <tr>
                      <th className="border-b border-border bg-card px-3 py-2" scope="col">
                        Token
                      </th>
                      <th className="border-b border-border bg-card px-3 py-2" scope="col">
                        Mode
                      </th>
                      <th className="border-b border-border bg-card px-3 py-2" scope="col">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token) => (
                      <tr key={`${token.cssVariable}-${token.mode ?? "base"}`}>
                        <td className="border-b border-border px-3 py-2">
                          <div className="flex items-center gap-2">
                            {token.type === "color" ? (
                              <span
                                aria-hidden="true"
                                className="h-5 w-5 shrink-0 border border-border"
                                style={{ background: token.resolvedValue }}
                              />
                            ) : null}
                            <code>{token.cssVariable}</code>
                          </div>
                        </td>
                        <td className="border-b border-border px-3 py-2">{token.mode ?? "base"}</td>
                        <td className="border-b border-border px-3 py-2">
                          <code>{token.resolvedValue}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

const meta = {
  title: "Design/Tokens",
  component: TokenReference,
  tags: ["autodocs", "a11y"],
  parameters: {
    a11y: {
      test: "error",
    },
    controls: {
      disable: true,
    },
    layout: "padded",
  },
} satisfies Meta<typeof TokenReference>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MetadataReference: Story = {};

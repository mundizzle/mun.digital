import type { Preview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import "@mun.digital/ui/styles.css";
import "./preview.css";

initialize({
  onUnhandledRequest: "bypass",
});

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    a11y: {
      test: "todo",
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: [],
    },
  },
};

export default preview;

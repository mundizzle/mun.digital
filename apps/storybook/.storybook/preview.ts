import type { Preview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import "@mun.digital/tokens/css";
import "./preview.css";
import { munDigitalStorybookTheme } from "./mun-digital-theme";

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
    docs: {
      theme: munDigitalStorybookTheme,
    },
  },
};

export default preview;

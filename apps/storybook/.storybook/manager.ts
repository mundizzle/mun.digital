import { addons } from "storybook/manager-api";
import { munDigitalStorybookTheme } from "./mun-digital-theme";

addons.setConfig({
  theme: munDigitalStorybookTheme,
});

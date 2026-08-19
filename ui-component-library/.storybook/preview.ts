import type { Preview } from "@storybook/react";
import "../src/styles/tokens.css";
import "./tailwind-preview.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [{ name: "light", value: "#F5F9F7" }]
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};
export default preview;

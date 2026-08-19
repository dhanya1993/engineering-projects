import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";
import { Button } from "../Button/Button";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    title: "Fleet Console",
    subtitle: "Region: South, 214 active devices",
    actions: (
      <>
        <Button size="sm" variant="ghost">Reports</Button>
        <Button size="sm">New ticket</Button>
      </>
    )
  }
};

export const Sticky: Story = {
  args: { title: "Sticky header", sticky: true }
};

import type { Meta, StoryObj } from "@storybook/react";
import { NetworkBanner } from "./NetworkBanner";

const meta: Meta<typeof NetworkBanner> = {
  title: "Components/NetworkBanner",
  component: NetworkBanner,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof NetworkBanner>;

export const Offline: Story = { args: { status: "offline" } };
export const Reconnecting: Story = { args: { status: "reconnecting" } };
export const Restored: Story = { args: { status: "restored" } };

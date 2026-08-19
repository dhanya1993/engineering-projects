import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge tone="success">Evaluated</StatusBadge>
      <StatusBadge tone="warning">Pending review</StatusBadge>
      <StatusBadge tone="danger">Offline</StatusBadge>
      <StatusBadge tone="info">In progress</StatusBadge>
      <StatusBadge tone="neutral">Draft</StatusBadge>
    </div>
  )
};

export const NoDot: Story = { args: { children: "Beta", showDot: false } };

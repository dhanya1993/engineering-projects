import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { Button } from "../Button/Button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  args: {
    title: "Device DVC-2201",
    headerAction: <StatusBadge tone="success">Online</StatusBadge>,
    children: (
      <p className="text-sm text-ink-600">
        Last refill scheduled for Aug 21. Assigned to field agent R. Menon.
      </p>
    ),
    footer: (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="secondary">View history</Button>
        <Button size="sm">Open ticket</Button>
      </div>
    )
  }
};

export const NoHeader: Story = {
  args: { children: <p className="text-sm text-ink-600">Plain content card, no header.</p> }
};

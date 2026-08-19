import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button/Button";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoResults: Story = {
  args: {
    title: "No learners match these filters",
    description: "Try clearing the cohort or date filters to widen the search.",
    action: <Button size="sm" variant="secondary">Clear filters</Button>
  }
};

export const NoData: Story = {
  args: {
    title: "No devices assigned yet",
    description: "Assign a device to this field agent to see it here.",
    action: <Button size="sm">Assign a device</Button>
  }
};

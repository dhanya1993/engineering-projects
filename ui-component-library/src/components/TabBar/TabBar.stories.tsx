import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TabBar } from "./TabBar";

const meta: Meta<typeof TabBar> = {
  title: "Components/TabBar",
  component: TabBar,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof TabBar>;

const items = [
  { key: "practice", label: "Practice" },
  { key: "sequence", label: "Sequence" },
  { key: "reports", label: "Reports", count: 3 },
  { key: "vocab", label: "Vocabulary", disabled: true }
];

export const Underline: Story = {
  render: () => {
    const [active, setActive] = useState("practice");
    return <TabBar items={items} activeKey={active} onChange={setActive} variant="underline" />;
  }
};

export const Pill: Story = {
  render: () => {
    const [active, setActive] = useState("practice");
    return <TabBar items={items} activeKey={active} onChange={setActive} variant="pill" />;
  }
};

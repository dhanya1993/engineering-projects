import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "./FilterBar";

const meta: Meta<typeof FilterBar> = {
  title: "Components/FilterBar",
  component: FilterBar,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof FilterBar>;

const filters = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "evaluated", label: "Evaluated" }
];

export const Interactive: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    const [active, setActive] = useState("all");
    return (
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search learners…"
        filters={filters}
        activeFilterKey={active}
        onFilterChange={setActive}
        onReset={() => {
          setSearch("");
          setActive("all");
        }}
      />
    );
  }
};

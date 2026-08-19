import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return <Pagination currentPage={page} totalPages={24} onPageChange={setPage} />;
  }
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    return <Pagination currentPage={page} totalPages={4} onPageChange={setPage} />;
  }
};

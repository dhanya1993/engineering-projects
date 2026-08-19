import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof Modal>;

export const ConfirmDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Delete device</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Delete this device?"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
            </>
          }
        >
          <p className="text-sm text-ink-600">
            This removes the device from the fleet and cancels any pending refill schedule. This can't be undone.
          </p>
        </Modal>
      </>
    );
  }
};

import type { Meta, StoryObj } from "@storybook/react";
import { FormInput } from "./FormInput";

const meta: Meta<typeof FormInput> = {
  title: "Components/FormInput",
  component: FormInput,
  tags: ["autodocs"]
};
export default meta;
type Story = StoryObj<typeof FormInput>;

export const Default: Story = {
  args: { label: "Email address", placeholder: "you@example.com", required: true }
};

export const WithHint: Story = {
  args: { label: "Display name", hint: "This is shown to learners in reports.", placeholder: "e.g. Ms. Rao" }
};

export const WithError: Story = {
  args: { label: "Email address", defaultValue: "not-an-email", error: "Enter a valid email address." }
};

export const Disabled: Story = {
  args: { label: "Organization ID", defaultValue: "ORG-4471", disabled: true }
};

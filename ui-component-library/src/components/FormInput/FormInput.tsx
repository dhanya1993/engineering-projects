import React, { useId } from "react";

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  /** Helper text shown when there's no error. */
  hint?: string;
  /** Validation error message. When present, the field switches to the error visual state. */
  error?: string;
  /** Marks the field as required and appends an asterisk to the label. */
  required?: boolean;
}

/**
 * Labeled text input with a single, consistent validation-state
 * treatment (hint vs. error) used across every form in the kit's source
 * projects — client onboarding, assignment creation, learner sign-in.
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, hint, error, required, id, className = "", ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium font-body text-ink-800">
          {label}
          {required && <span className="ml-0.5 text-danger-500">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={[
            "rounded-md border bg-white px-3 py-2 text-sm font-body text-ink-900 placeholder:text-ink-300",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            error
              ? "border-danger-500 focus:ring-danger-500/40"
              : "border-ink-200 focus:border-ink-500 focus:ring-ink-500/30",
            rest.disabled ? "bg-ink-50 text-ink-300" : "",
            className
          ].join(" ")}
          {...rest}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-danger-600">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-ink-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-24 text-center">
      <p className="font-display text-lg font-medium text-ink-800">
        Your role doesn't have access to this page
      </p>
      <p className="text-sm text-ink-500">
        If you think this is wrong, ask your manager to review your role permissions.
      </p>
      <Link to="/" className="mt-2 text-sm font-medium text-ink-700 underline underline-offset-2">
        Back to dashboard
      </Link>
    </div>
  );
}

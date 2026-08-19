import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api/client";
import type { Task } from "../types";
import { formatDate } from "../utils/format";

type FilterKey = "all" | "overdue" | "today" | "upcoming" | "completed";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "overdue", label: "Overdue" },
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" }
];

function taskLabel(value: Task["contactId"] | Task["dealId"], fallback: string) {
  if (!value) return fallback;
  if (typeof value === "string") return fallback;
  return "name" in value ? value.name : value.title;
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  function load(f: FilterKey = filter) {
    setLoading(true);
    api
      .get<Task[]>("/tasks", { params: f === "all" ? {} : { status: f } })
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    await api.post("/tasks", { title, dueDate });
    setTitle("");
    setDueDate("");
    setShowForm(false);
    load(filter);
  }

  async function toggleComplete(task: Task) {
    await api.patch(`/tasks/${task._id}`, { completed: !task.completed });
    load(filter);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">Follow-ups and reminders tied to your pipeline.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {showForm ? "Cancel" : "New task"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-4 flex items-end gap-3 rounded-lg border border-slate-100 bg-white p-4"
        >
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-500">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Follow up with Priya"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Due date</label>
            <input
              required
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create
          </button>
        </form>
      )}

      <div className="mt-4 flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === f.key
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 text-slate-600 hover:border-slate-400"
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="mt-4 text-sm text-slate-400">Loading tasks…</p>}
      {!loading && tasks.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">Nothing here for this filter.</p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {tasks.map((task) => {
          const overdue = !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
          return (
            <div
              key={task._id}
              className={[
                "flex items-center gap-3 rounded-lg border bg-white p-3.5",
                overdue ? "border-rose-200" : "border-slate-100"
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
                className="h-4 w-4 accent-slate-900"
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
                  {task.title}
                </p>
                <p className="text-xs text-slate-400">
                  {taskLabel(task.contactId, "")} {taskLabel(task.dealId, "")}
                </p>
              </div>
              <span className={`text-xs font-medium ${overdue ? "text-rose-600" : "text-slate-400"}`}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

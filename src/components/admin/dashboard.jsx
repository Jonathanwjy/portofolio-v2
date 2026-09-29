import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Edit3,
  LoaderCircle,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

/**
 * Table and column names below match the actual Supabase schema:
 * certifications, educations, experiences, projects, tech_stacks.
 *
 * kind:
 *  - (empty)   : text input
 *  - textarea  : textarea
 *  - url       : input url
 *  - list      : jsonb column holding an array of strings (one item per line)
 * touch: true  -> also updates modified_date on update
 * titleKey / subtitleKey : columns used for the mobile card view
 */
const resources = {
  certifications: {
    label: "Certifications",
    singular: "Certification",
    description: "Professional certificates and credentials.",
    titleKey: "title_en",
    subtitleKey: "issuer_en",
    columns: [
      { key: "title_en", label: "Title" },
      { key: "issuer_en", label: "Issuer" },
      { key: "date_en", label: "Date" },
      { key: "link", label: "Link", kind: "url" },
    ],
    fields: [
      { key: "title_en", label: "Title (EN)", required: true },
      { key: "title_id", label: "Title (ID)", required: true },
      { key: "issuer_en", label: "Issuer (EN)", required: true },
      { key: "issuer_id", label: "Issuer (ID)", required: true },
      { key: "date_en", label: "Date (EN)", hint: "Example: March 2025" },
      { key: "date_id", label: "Date (ID)", hint: "Example: Maret 2025" },
      { key: "link", label: "Certificate link", kind: "url", full: true },
    ],
  },
  educations: {
    label: "Education",
    singular: "Education",
    description: "Education history.",
    titleKey: "title_en",
    subtitleKey: "institution",
    columns: [
      { key: "title_en", label: "Degree" },

      { key: "institution", label: "Institution" },
      { key: "period", label: "Period" },
    ],
    fields: [
      { key: "institution", label: "Institution", required: true },
      { key: "title_en", label: "Degree (EN)", required: true },
      { key: "title_id", label: "Degree (ID)", required: true },
      {
        key: "period",
        label: "Period",
        hint: "Example: 2021 - 2025",
        full: true,
      },
      { key: "description_en", label: "Description (EN)", kind: "textarea" },
      { key: "description_id", label: "Description (ID)", kind: "textarea" },
    ],
  },
  experiences: {
    label: "Experience",
    singular: "Experience",
    description: "Work and internship experience.",
    titleKey: "title",
    subtitleKey: "institution",
    columns: [
      { key: "title", label: "Position" },
      { key: "institution", label: "Company" },
      { key: "period_en", label: "Period" },
      { key: "modified_date", label: "Modified", kind: "datetime" },
    ],
    touch: true,
    fields: [
      { key: "title", label: "Position", required: true },
      { key: "institution", label: "Company / organization", required: true },
      {
        key: "period_en",
        label: "Period (EN)",
        hint: "Example: Jan 2025 - Jun 2025",
      },
      {
        key: "period_id",
        label: "Period (ID)",
        hint: "Example: Jan 2025 - Jun 2025",
      },
      { key: "description_en", label: "Description (EN)", kind: "textarea" },
      { key: "description_id", label: "Description (ID)", kind: "textarea" },
    ],
  },
  projects: {
    label: "Projects",
    singular: "Project",
    description: "Featured projects in the portfolio.",
    titleKey: "title",
    subtitleKey: "shortdesc_en",
    columns: [
      { key: "title", label: "Project" },
      { key: "shortdesc_en", label: "Short description" },
      { key: "tags", label: "Tags", kind: "list" },
      { key: "demo_url", label: "Demo", kind: "url" },
    ],
    touch: true,
    fields: [
      { key: "title", label: "Project name", required: true, full: true },
      {
        key: "shortdesc_en",
        label: "Short description (EN)",
        kind: "textarea",
      },
      {
        key: "short_desc_id",
        label: "Short description (ID)",
        kind: "textarea",
      },
      {
        key: "description_en",
        label: "Full description (EN)",
        kind: "textarea",
      },
      {
        key: "description_id",
        label: "Full description (ID)",
        kind: "textarea",
      },
      {
        key: "images",
        label: "Image URLs",
        kind: "list",
        hint: "One URL per line.",
      },
      {
        key: "tags",
        label: "Tags / technologies",
        kind: "list",
        hint: "One tag per line.",
      },
      { key: "github_url", label: "GitHub URL", kind: "url" },
      { key: "demo_url", label: "Demo URL", kind: "url" },
    ],
  },
  tech_stacks: {
    label: "Tech Stack",
    singular: "Tech stack item",
    description: "Technologies and tools I use.",
    titleKey: "name",
    subtitleKey: "icon",
    columns: [
      { key: "name", label: "Name" },
      { key: "icon", label: "Icon" },
    ],
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "icon", label: "Icon URL / name", full: true },
    ],
  },
};

function emptyForm(resource) {
  return Object.fromEntries(resource.fields.map((field) => [field.key, ""]));
}

function recordToForm(record, resource) {
  return Object.fromEntries(
    resource.fields.map((field) => {
      const value = record[field.key];
      if (field.kind === "list") {
        return [
          field.key,
          Array.isArray(value)
            ? value
                .map((item) =>
                  typeof item === "string" ? item : JSON.stringify(item),
                )
                .join("\n")
            : "",
        ];
      }
      return [field.key, value ?? ""];
    }),
  );
}

function formToRecord(form, resource) {
  return Object.fromEntries(
    resource.fields.map((field) => {
      const value = form[field.key];
      if (field.kind === "list") {
        return [
          field.key,
          String(value ?? "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        ];
      }
      return [field.key, String(value ?? "").trim() || null];
    }),
  );
}

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [access, setAccess] = useState("checking");
  const [activeType, setActiveType] = useState("certifications");
  const activeTypeRef = useRef(activeType);
  const checkedUserIdRef = useRef(null);
  const [records, setRecords] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState(() => emptyForm(resources.certifications));
  const [isSaving, setIsSaving] = useState(false);

  const resource = resources[activeType];
  const isFormOpen = editingRecord !== null;

  const loadRecords = useCallback(async (type) => {
    setIsLoadingRecords(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from(type)
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      setRecords([]);
      setError(queryError.message);
    } else {
      setRecords(data ?? []);
    }
    setIsLoadingRecords(false);
  }, []);

  const checkAccess = useCallback(
    async (currentSession) => {
      if (!currentSession) {
        checkedUserIdRef.current = null;
        setAccess("signed-out");
        setRecords([]);
        return;
      }

      setAccess("checking");
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentSession.user.id)
        .maybeSingle();

      if (profileError) {
        setAccess("setup-error");
        setError(profileError.message);
        return;
      }

      if (data?.role !== "admin") {
        setAccess("forbidden");
        return;
      }

      checkedUserIdRef.current = currentSession.user.id;
      setError("");
      setAccess("allowed");
      await loadRecords(activeTypeRef.current);
    },
    [loadRecords],
  );

  useEffect(() => {
    // Supabase's client re-checks the token whenever the tab regains focus and
    // fires onAuthStateChange again even though nothing actually changed. We
    // only want to re-run the admin check (and reset the screen) on a real
    // sign-in/sign-out — i.e. when the user id actually changes — not on every
    // background token refresh, or the current tab and its data get reset
    // every time the browser tab is refocused.
    const updateSession = (nextSession, { force = false } = {}) => {
      setSession(nextSession);
      const nextUserId = nextSession?.user?.id ?? null;
      if (force || nextUserId !== checkedUserIdRef.current) {
        checkAccess(nextSession);
      }
    };

    supabase.auth
      .getSession()
      .then(({ data }) => updateSession(data.session, { force: true }));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) =>
      updateSession(nextSession),
    );
    return () => subscription.unsubscribe();
  }, [checkAccess]);

  const stats = useMemo(() => ({ total: records.length }), [records.length]);

  async function handleSignIn(event) {
    event.preventDefault();
    setError("");
    setIsSigningIn(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) setError(signInError.message);
    setIsSigningIn(false);
  }

  function selectType(type) {
    setActiveType(type);
    activeTypeRef.current = type;
    setEditingRecord(null);
    setNotice("");
    loadRecords(type);
  }

  function openCreate() {
    setEditingRecord({ id: null });
    setForm(emptyForm(resource));
    setError("");
  }

  function openEdit(record) {
    setEditingRecord(record);
    setForm(recordToForm(record, resource));
    setError("");
  }

  function closeForm() {
    setEditingRecord(null);
    setForm(emptyForm(resource));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);

    const payload = formToRecord(form, resource);
    let query;
    if (editingRecord.id) {
      if (resource.touch) payload.modified_date = new Date().toISOString();
      query = supabase
        .from(activeType)
        .update(payload)
        .eq("id", editingRecord.id)
        .select();
    } else {
      query = supabase.from(activeType).insert(payload).select();
    }

    const { data, error: saveError } = await query;
    setIsSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }
    // When RLS blocks an update/delete, Supabase returns no error, just 0 rows.
    if (!data || data.length === 0) {
      setError(
        "Data was not saved. Check this table's RLS policy (it must allow admin writes).",
      );
      return;
    }

    setNotice(`${resource.singular} saved successfully.`);
    closeForm();
    loadRecords(activeType);
  }

  async function handleDelete(record) {
    if (!window.confirm(`Delete this ${resource.singular.toLowerCase()}?`))
      return;
    setError("");
    setNotice("");
    const { data, error: deleteError } = await supabase
      .from(activeType)
      .delete()
      .eq("id", record.id)
      .select();

    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    if (!data || data.length === 0) {
      setError(
        "Data was not deleted. Check this table's RLS policy (it must allow admin writes).",
      );
      return;
    }
    setNotice(`${resource.singular} deleted successfully.`);
    loadRecords(activeType);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setNotice("");
  }

  if (access === "checking")
    return <LoadingScreen label="Checking admin access..." />;

  if (access === "signed-out") {
    return (
      <main className="min-h-screen bg-muted px-4 py-10 text-foreground">
        <section className="mx-auto w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
          <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold">Admin dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with a Supabase account that has the admin role.
          </p>
          {error && <Message type="error">{error}</Message>}
          <form className="mt-6 space-y-4" onSubmit={handleSignIn}>
            <Field label="Email">
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input"
              />
            </Field>
            <Field label="Password">
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input"
              />
            </Field>
            <button
              disabled={isSigningIn}
              className="primary-button w-full cursor-pointer"
              type="submit"
            >
              {isSigningIn ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}{" "}
              Sign in
            </button>
          </form>
          <a
            className="mt-5 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            href="/"
          >
            <ArrowLeft className="size-4" /> Back to portfolio
          </a>
        </section>
      </main>
    );
  }

  if (access === "forbidden" || access === "setup-error") {
    return (
      <main className="grid min-h-screen place-items-center bg-muted p-4 text-foreground">
        <section className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl">
          <AlertCircle className="size-10 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Admin access unavailable</h1>
          <p className="mt-2 text-muted-foreground">
            {access === "forbidden"
              ? "This account does not have the admin role. Ask an administrator to assign it."
              : "The profiles table has not been set up. Run the admin setup SQL in the Supabase SQL Editor."}
          </p>
          {error && <Message type="error">{error}</Message>}
          <button
            className="primary-button mt-6 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Portfolio CMS
            </p>
            <h1 className="text-xl font-bold">Admin dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session?.user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="icon-button cursor-pointer"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[15rem_1fr] sm:px-6">
        <aside className="rounded-2xl border bg-card p-3 lg:h-fit">
          <p className="px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Manage content
          </p>
          <nav className="space-y-1">
            {Object.entries(resources).map(([type, item]) => (
              <button
                key={type}
                onClick={() => selectType(type)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${activeType === type ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
              >
                {item.label}
                <ChevronRight className="size-4" />
              </button>
            ))}
          </nav>
        </aside>

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">{resource.label}</h2>
              <p className="mt-1 text-muted-foreground">
                {resource.description} · {stats.total} items
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadRecords(activeType)}
                className="secondary-button"
                title="Refresh"
              >
                <RefreshCw
                  className={`size-4 ${isLoadingRecords ? "animate-spin" : ""}`}
                />{" "}
                Refresh
              </button>
              <button onClick={openCreate} className="primary-button">
                <Plus className="size-4" /> Add {resource.singular}
              </button>
            </div>
          </div>
          {error && <Message type="error">{error}</Message>}
          {notice && <Message type="success">{notice}</Message>}
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            {isLoadingRecords ? (
              <LoadingScreen label="Loading data..." compact />
            ) : records.length === 0 ? (
              <EmptyState onCreate={openCreate} label={resource.singular} />
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="w-14 px-4 py-3 font-medium">ID</th>
                        {resource.columns.map((column) => (
                          <th
                            key={column.key}
                            className="px-4 py-3 font-medium"
                          >
                            {column.label}
                          </th>
                        ))}
                        <th className="w-24 px-4 py-3 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {records.map((record) => (
                        <tr
                          key={record.id}
                          className="align-top transition hover:bg-accent/40"
                        >
                          <td className="px-4 py-3 text-muted-foreground">
                            {record.id}
                          </td>
                          {resource.columns.map((column, index) => (
                            <td key={column.key} className="px-4 py-3">
                              <CellValue
                                column={column}
                                value={record[column.key]}
                                strong={index === 0}
                              />
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEdit(record)}
                                className="icon-button"
                                title="Edit"
                              >
                                <Edit3 className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(record)}
                                className="delete-button"
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y md:hidden">
                  {records.map((record) => (
                    <article
                      key={record.id}
                      className="flex items-start justify-between gap-4 p-4 sm:p-5"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {record[resource.titleKey] || "(untitled)"}
                        </h3>
                        {record[resource.subtitleKey] && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {record[resource.subtitleKey]}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          ID: {record.id}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => openEdit(record)}
                          className="icon-button"
                          title="Edit"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
                          className="delete-button"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {isFormOpen && (
        <FormModal
          resource={resource}
          record={editingRecord}
          form={form}
          setForm={setForm}
          onClose={closeForm}
          onSubmit={handleSave}
          isSaving={isSaving}
        />
      )}
    </main>
  );
}

function CellValue({ column, value, strong }) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return <span className="text-muted-foreground">-</span>;
  }
  if (column.kind === "list") {
    return (
      <div className="flex max-w-xs flex-wrap gap-1">
        {value.slice(0, 4).map((item, index) => (
          <span key={index} className="rounded-md bg-muted px-2 py-0.5 text-xs">
            {typeof item === "string" ? item : JSON.stringify(item)}
          </span>
        ))}
        {value.length > 4 && (
          <span className="text-xs text-muted-foreground">
            +{value.length - 4}
          </span>
        )}
      </div>
    );
  }
  if (column.kind === "url") {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="block max-w-[12rem] truncate text-primary hover:underline"
      >
        {value}
      </a>
    );
  }
  if (column.kind === "datetime") {
    return (
      <span className="whitespace-nowrap text-muted-foreground">
        {new Date(value).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    );
  }
  return (
    <div
      className={`line-clamp-2 max-w-xs ${strong ? "font-semibold" : "text-muted-foreground"}`}
    >
      {value}
    </div>
  );
}

function FormModal({
  resource,
  record,
  form,
  setForm,
  onClose,
  onSubmit,
  isSaving,
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
      <div className="mx-auto my-8 w-full max-w-2xl rounded-2xl border bg-card p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              {record.id
                ? `Edit ${resource.singular}`
                : `Add ${resource.singular}`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the fields below.
            </p>
          </div>
          <button onClick={onClose} className="icon-button" title="Close">
            <X className="size-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          {resource.fields.map((field) => (
            <FormField
              key={field.key}
              field={field}
              value={form[field.key]}
              onChange={(value) =>
                setForm((current) => ({ ...current, [field.key]: value }))
              }
            />
          ))}
          <div className="flex justify-end gap-2 pt-2 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="secondary-button"
            >
              Cancel
            </button>
            <button
              disabled={isSaving}
              type="submit"
              className="primary-button"
            >
              {isSaving && <LoaderCircle className="size-4 animate-spin" />}{" "}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ field, value, onChange }) {
  const isBig = field.kind === "textarea" || field.kind === "list";
  const control = isBig ? (
    <textarea
      rows={field.kind === "list" ? 5 : 4}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="input resize-y"
      required={field.required}
    />
  ) : (
    <input
      type={field.kind === "url" ? "url" : "text"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="input"
      required={field.required}
    />
  );
  return (
    <Field
      label={field.label}
      hint={field.hint}
      className={isBig || field.full ? "sm:col-span-2" : ""}
    >
      {control}
    </Field>
  );
}

function Field({ label, hint, className = "", children }) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
function Message({ type, children }) {
  return (
    <div
      className={`my-4 flex gap-2 rounded-lg border p-3 text-sm ${type === "error" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"}`}
    >
      {type === "error" ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      )}
      {children}
    </div>
  );
}
function LoadingScreen({ label, compact = false }) {
  return (
    <div
      className={`grid place-items-center gap-3 text-muted-foreground ${compact ? "min-h-48" : "min-h-screen bg-muted"}`}
    >
      <LoaderCircle className="size-6 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
function EmptyState({ label, onCreate }) {
  return (
    <div className="grid min-h-56 place-items-center p-8 text-center">
      <div>
        <p className="font-semibold">No {label.toLowerCase()} yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first entry to get started.
        </p>
        <button onClick={onCreate} className="primary-button mt-4">
          <Plus className="size-4" /> Add entry
        </button>
      </div>
    </div>
  );
}

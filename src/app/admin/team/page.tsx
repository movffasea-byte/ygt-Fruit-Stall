import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { addTeamMember, removeTeamMember, updateTeamMember } from "./actions";

export const metadata = { title: "Team | Yandaki Fruit Stall" };

type Member = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "staff";
  whatsapp_number: string | null;
  on_duty: boolean;
};

const field = "mt-1 w-full rounded border border-brand-green/40 bg-white px-3 py-2";
const button = "rounded bg-brand-green px-4 py-2 text-sm font-semibold text-white";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user?.id ?? "").maybeSingle();

  if (me?.role !== "admin") {
    return <p className="py-8">Only admins can manage the team.</p>;
  }

  const { data } = await supabase.from("profiles").select("id, full_name, email, role, whatsapp_number, on_duty").order("created_at");
  const members = (data ?? []) as Member[];
  const canInvite = createAdminClient() !== null;

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold text-brand-green">Team</h1>
      <p className="mt-1 text-sm text-foreground/70">
        Add staff, set their role and WhatsApp number (with country code, e.g. 2348012345678), and switch who is on duty.
        New orders only go to people who are on duty.
      </p>

      <ul className="mt-6 space-y-4">
        {members.map((m) => (
          <li key={m.id} className="rounded-lg border border-brand-green/30 p-4">
            <form action={updateTeamMember} className="grid gap-3 sm:grid-cols-4">
              <input type="hidden" name="id" value={m.id} />
              <label className="text-sm font-semibold">
                Name
                <input name="full_name" defaultValue={m.full_name ?? ""} className={field} />
              </label>
              <label className="text-sm font-semibold">
                WhatsApp number
                <input name="whatsapp_number" defaultValue={m.whatsapp_number ?? ""} inputMode="numeric" className={field} />
              </label>
              <label className="text-sm font-semibold">
                Role
                <select name="role" defaultValue={m.role} disabled={m.id === user?.id} className={field}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="flex items-center gap-2 pt-6 text-sm font-semibold">
                <input type="checkbox" name="on_duty" defaultChecked={m.on_duty} /> On duty
              </label>
              <p className="text-xs text-foreground/60 sm:col-span-2">{m.email ?? "No email on file"}</p>
              <div className="flex gap-2 sm:col-span-2 sm:justify-end">
                <button className={button}>Save</button>
              </div>
            </form>
            {m.id !== user?.id && (
              <form action={removeTeamMember} className="mt-2 text-right">
                <input type="hidden" name="id" value={m.id} />
                <button className="text-sm text-red-700 underline">Remove access</button>
              </form>
            )}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-bold text-brand-green">Add a team member</h2>
      {!canInvite && (
        <p className="mt-1 text-sm text-red-700">
          Adding people is switched off until SUPABASE_SERVICE_ROLE_KEY is set on the server.
        </p>
      )}
      <form action={addTeamMember} className="mt-3 grid gap-3 sm:grid-cols-4">
        <label className="text-sm font-semibold">
          Name
          <input name="full_name" className={field} />
        </label>
        <label className="text-sm font-semibold">
          Email
          <input name="email" type="email" required className={field} />
        </label>
        <label className="text-sm font-semibold">
          WhatsApp number
          <input name="whatsapp_number" inputMode="numeric" className={field} />
        </label>
        <label className="text-sm font-semibold">
          Role
          <select name="role" className={field}>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <div className="sm:col-span-4">
          <button className={button} disabled={!canInvite}>
            Send invite
          </button>
        </div>
      </form>
    </main>
  );
}

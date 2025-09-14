import { useNavigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useMemo, useState } from "react";

const client = generateClient<Schema>();

export function OrgOnboarding() {
  const { user } = useAuthenticator((c) => [c.user]);
  const navigate = useNavigate();
  const userId = user!.userId;
  const now = useMemo(() => new Date().toISOString(), []);

  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    try {
      setBusy(true);
      setErr(null);

      // (optionally: check unique slug via listOrgBySlug)
      const orgId = crypto.randomUUID();
      const org = await client.models.Organization.create({
        id: orgId,
        displayName,
        slug,
        createdAt: now,
        updatedAt: now,
      });

      await client.models.Membership.create({
        id: crypto.randomUUID(),
        userId,
        orgId: org.data!.id,
        roles: ["ADMIN"],
        createdAt: now,
        updatedAt: now,
      });

      navigate(`/organization/${org.data!.id}`, { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Failed to create organization");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Create your organization</h2>
      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <label>
          <div>Name</div>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Acme Inc."
          />
        </label>
        <label>
          <div>Slug</div>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="acme"
          />
        </label>
        {err && <div style={{ color: "crimson" }}>{err}</div>}
        <button disabled={busy || !displayName || !slug} onClick={submit}>
          {busy ? "Creating..." : "Create organization"}
        </button>
      </div>
    </div>
  );
}

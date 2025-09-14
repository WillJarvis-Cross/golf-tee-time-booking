// src/OrganizationPages/OrganizationApp.tsx
import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  Link,
  Outlet,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const client = generateClient<Schema>();

export default function OrganizationApp() {
  const { orgId = "" } = useParams();
  const { user, signOut } = useAuthenticator((c) => [c.user, c.signOut]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [org, setOrg] = useState<{
    id: string;
    displayName: string;
    slug?: string;
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const now = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Load organization basics
        const orgRes = await client.models.Organization.get(
          { id: orgId },
          { selectionSet: ["id", "displayName", "slug"] }
        );
        if (!orgRes.data) throw new Error("Organization not found");
        setOrg({
          id: orgRes.data.id,
          displayName: orgRes.data.displayName,
          slug: orgRes.data.slug ?? undefined,
        });

        // 2) Verify membership + role for the current user
        const mems = await client.models.Membership.listMembershipByUser(
          { userId: user!.userId },
          { selectionSet: ["orgId", "roles"] }
        );
        const mine = mems.data.find((m) => m.orgId === orgId);
        if (!mine)
          throw new Error("You do not have access to this organization.");
        setIsAdmin((mine.roles ?? []).includes("ADMIN"));
      } catch (e: any) {
        setError(e?.message ?? "Failed to load organization");
      } finally {
        setLoading(false);
      }
    })();
  }, [orgId, user?.userId]);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ p: 6 }}>
        <CircularProgress />
      </Stack>
    );
  }
  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  if (!org)
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Organization unavailable.
      </Alert>
    );

  return (
    <>
      {/* Top bar */}
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {org.displayName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isAdmin && (
              <Button
                color="inherit"
                component={Link}
                to={`/organization/${org.id}/settings`}
              >
                Admin
              </Button>
            )}
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={signOut}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Org nav tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth={false}>
          <Tabs 
            value={false} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: { xs: 'auto', sm: 160 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}
          >
            <Tab
              icon={<DashboardIcon fontSize="small" />}
              iconPosition="start"
              label="Dashboard"
              component={Link}
              to={`/organization/${org.id}/dashboard`}
            />
            <Tab
              icon={<AccessTimeIcon fontSize="small" />}
              iconPosition="start"
              label="Tee Times"
              component={Link}
              to={`/organization/${org.id}/tee-times`}
            />
            <Tab
              icon={<SettingsIcon fontSize="small" />}
              iconPosition="start"
              label="Settings"
              component={Link}
              to={`/organization/${org.id}/settings`}
            />
          </Tabs>
        </Container>
      </Box>

      {/* Nested pages */}
      <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          <Routes>
            <Route path="/" element={<Navigate to={`dashboard`} replace />} />
            <Route path="dashboard" element={<OrgDashboard orgId={org.id} />} />
            <Route
              path="tee-times"
              element={<OrgTeeTimes orgId={org.id} isAdmin={isAdmin} />}
            />
            <Route
              path="settings"
              element={<OrgSettings orgId={org.id} isAdmin={isAdmin} />}
            />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
      </Container>
    </>
  );
}

/** ----- Pages ----- */

function OrgDashboard({ orgId }: { orgId: string }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Welcome to your dashboard</Typography>
      <Typography variant="body1">
        From here you’ll see quick stats (upcoming tee times, recent bookings,
        etc.).
      </Typography>
    </Stack>
  );
}

function OrgTeeTimes({ orgId, isAdmin }: { orgId: string; isAdmin: boolean }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Tee Times</Typography>
      <Typography variant="body2">
        (Coming soon) List, filter, and manage tee times.{" "}
        {isAdmin ? "You can upload and edit tee times." : ""}
      </Typography>
      {isAdmin && <Button variant="contained">Upload Tee Times (CSV)</Button>}
      {/* Later: table of tee times and actions */}
    </Stack>
  );
}

function OrgSettings({ orgId, isAdmin }: { orgId: string; isAdmin: boolean }) {
  if (!isAdmin)
    return (
      <Alert severity="warning">
        Only organization admins can access Settings.
      </Alert>
    );
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Organization Settings</Typography>
      <Typography variant="body2">
        Update org profile, billing, marketplace visibility, etc.
      </Typography>
      <Button variant="outlined">Edit Organization Profile</Button>
    </Stack>
  );
}

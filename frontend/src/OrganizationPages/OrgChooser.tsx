import { useNavigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  CircularProgress,
  Chip,
  Box,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";

const client = generateClient<Schema>();

export function OrgChooser() {
  const { user, signOut } = useAuthenticator((c) => [c.user, c.signOut]);
  const navigate = useNavigate();
  const userId = user!.userId;

  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<
    { id: string; name: string; roles: string[] }[]
  >([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await client.models.Membership.listMembershipByUser(
        { userId },
        {
          selectionSet: [
            "id",
            "userId",
            "orgId",
            "roles",
            "org.id",
            "org.displayName",
            "org.slug",
          ],
        }
      );

      const memberships = res.data;
      const mapped = memberships.map((m) => ({
        id: m.org?.id ?? m.orgId,
        name: m.org?.displayName ?? "Organization",
        roles: (m.roles ?? []).filter(
          (r): r is string => typeof r === "string"
        ),
      }));
      setOrgs(mapped);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading organizations…</Typography>
      </Container>
    );
  }

  if (orgs.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
        <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom>No organizations yet</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create your first organization to get started
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate("/organizations/new")}
        >
          Create organization
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Select an organization
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={signOut}
        >
          Logout
        </Button>
      </Box>
      
      <Stack spacing={2} sx={{ mb: 4 }}>
        {orgs.map((o) => (
          <Card key={o.id} sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BusinessIcon color="primary" />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{o.name}</Typography>
                </Box>
                {o.roles.includes("ADMIN") && (
                  <Chip label="Admin" color="primary" size="small" />
                )}
              </Box>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate(`/organization/${o.id}`)}
              >
                Open
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
      
      <Button
        variant="outlined"
        size="large"
        startIcon={<AddIcon />}
        onClick={() => navigate("/organizations/new")}
        fullWidth
      >
        Create new organization
      </Button>
    </Container>
  );
}

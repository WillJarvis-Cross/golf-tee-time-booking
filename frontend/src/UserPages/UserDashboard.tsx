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
  Box,
  Grid,
  Chip,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LogoutIcon from "@mui/icons-material/Logout";

const client = generateClient<Schema>();

export function UserDashboard() {
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
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading dashboard…</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Welcome back, {user?.signInDetails?.loginId?.split('@')[0] || 'User'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={signOut}
        >
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* My Tee Times Section */}
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AccessTimeIcon color="primary" />
                <Typography variant="h6">My Upcoming Tee Times</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                No upcoming tee times found. Book through your organizations below.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid xs={12} md={4}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/organizations")}
                  sx={{ mb: 1 }}
                >
                  Browse Organizations
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* My Organizations */}
        <Grid xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            My Organizations ({orgs.length})
          </Typography>
          {orgs.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  You're not a member of any organizations yet.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/organizations")}
                >
                  Browse Organizations
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {orgs.slice(0, 3).map((org) => (
                <Grid xs={12} sm={6} md={4} key={org.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <BusinessIcon color="primary" />
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {org.name}
                        </Typography>
                        {org.roles.includes("ADMIN") && (
                          <Chip label="Admin" color="primary" size="small" />
                        )}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/organization/${org.id}`)}
                      >
                        Open
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              {orgs.length > 3 && (
                <Grid xs={12}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/organizations")}
                  >
                    View all organizations ({orgs.length})
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
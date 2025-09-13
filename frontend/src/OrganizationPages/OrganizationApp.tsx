import React from "react";
import { Container, Typography, Box } from "@mui/material";

const OrganizationApp: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box mt={8} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Hi
        </Typography>
      </Box>
    </Container>
  );
};

export default OrganizationApp;

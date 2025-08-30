import { Container, Typography, Paper } from "@mui/material";
import { UsersGrid } from "../../components/tables/UsersGrid";

function UsersPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        sx={{ mb: 3 }}
      >
        User Dashboard Page - Vegam
      </Typography>

      <Paper elevation={3}>
        <UsersGrid />
      </Paper>
    </Container>
  );
}

export default UsersPage;

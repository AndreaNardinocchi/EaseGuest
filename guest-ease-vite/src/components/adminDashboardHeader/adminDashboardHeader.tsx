import { Box, Container, Typography } from "@mui/material";

const AdminDashboardHeader: React.FC = () => {
  return (
    <Container sx={{ pb: 0, overflow: "visible" }}>
      <Box my={4}>
        <Typography variant="h3" component={"h1"} sx={{ textAlign: "center" }}>
          Admin Dashboard
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminDashboardHeader;

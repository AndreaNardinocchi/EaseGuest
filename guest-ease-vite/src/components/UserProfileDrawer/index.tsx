import React, { useContext } from "react";
// https://mui.com/material-ui/react-drawer/
//  https://mui.com/material-ui/react-divider/
//  https://www.codingeasypeasy.com/blog/mastering-material-ui-drawer-a-comprehensive-guide-with-examples
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
  Link as MuiLink,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import type { User } from "../../types/interfaces";

interface UserProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  open,
  onClose,
}) => {
  const auth = useContext(AuthContext);
  const supabaseUser = auth?.user;

  // Safely extract user info
  const user: User | null = supabaseUser
    ? {
        id: supabaseUser.id || "",
        first_name: supabaseUser.first_name || "User",
        last_name: supabaseUser.last_name || "User",
        email: supabaseUser.email || "user@example.com",
        role: supabaseUser.role || "guest",
        avatarUrl: supabaseUser.avatarUrl || "",
        created_at: supabaseUser.created_at || "",
        country: supabaseUser.country || "Unknown",
        zip_code: supabaseUser.zip_code || "",
      }
    : null;

  if (!user) return null;

  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(
    0
  )}`.toUpperCase();

  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 320, padding: 3 } }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">User Profile</Typography>
        <IconButton onClick={onClose} aria-label="Close drawer">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        {user.avatarUrl ? (
          <Avatar
            src={user.avatarUrl}
            alt={`${user.first_name} ${user.last_name}`}
            sx={{ width: 80, height: 80, mb: 2 }}
          />
        ) : (
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: "#e26d5c",
              fontSize: 32,
            }}
          >
            {initials}
          </Avatar>
        )}
        <Typography variant="h6" align="center">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {user.email}
        </Typography>
        {/* FIXED ROLE CHECK */}
        {auth?.user?.role === "admin" && (
          <MuiLink
            component={Link}
            to="/admin/bookings"
            underline="hover"
            sx={{ mt: 1, color: "#472d30;", fontWeight: 500 }}
            onClick={onClose}
          >
            View Admin Dashboard
          </MuiLink>
        )}

        <MuiLink
          component={Link}
          to="/account"
          underline="hover"
          sx={{ mt: 1, color: "#472d30;", fontWeight: 500 }}
          onClick={onClose}
        >
          View Account as a guest
        </MuiLink>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Role:
        </Typography>
        <Typography variant="body1">{user.role}</Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Account Created:
        </Typography>
        <Typography variant="body1">{formattedDate}</Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          Country:
        </Typography>
        <Typography variant="body1">{user.country}</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Button
        variant="contained"
        sx={{
          bgcolor: "#472d30;",
          color: "#ffffff",
          "&:hover": { bgcolor: "#e26d5c" },
        }}
        startIcon={<LogoutIcon />}
        fullWidth
        onClick={() => {
          auth?.signout?.();
          onClose();
        }}
      >
        Log Out
      </Button>
    </Drawer>
  );
};

export default UserProfileDrawer;

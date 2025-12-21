// import React, { useContext } from "react";
// // https://mui.com/material-ui/react-drawer/
// // https://mui.com/material-ui/react-divider/
// // https://www.codingeasypeasy.com/blog/mastering-material-ui-drawer-a-comprehensive-guide-with-examples
// import {
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   Divider,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { AuthContext } from "../../context/authContext";

// // import { useTranslation } from "react-i18next";
// // import i18n from "../../i18n/i18n";

// // Props expected by the UserProfileDrawer component
// interface UserProfileDrawerProps {
//   // Whether the drawer is open or not. It is controlled by the parent siteHeader
//   open: boolean;
//   // Function to close the drawer. Called when the user clicks outside or on the close button.
//   onClose: () => void;
// }

// const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
//   open,
//   onClose,
// }) => {
//   const auth = useContext(AuthContext);

//   /**
//    * We are using the translation hook gets the t function and i18n instance inside our functional component.
//    * However, i18n is already embedded into the <LanguageSwitcher /> component
//    * https://react.i18next.com/latest/usetranslation-hook
//    */
//   // const { t } = useTranslation();
//   // console.log("Current language:", i18n.language);

//   // Fallback user info from localStorage if context doesn't have it
//   const userFirstName = localStorage.getItem("userFirstName") || "User";
//   const userLastName = localStorage.getItem("userLastName") || "User";
//   const userEmail = localStorage.getItem("userEmail") || "user@example.com";
//   // const userRole = localStorage.getItem("userRole") || t("viewer");
//   const userRole = localStorage.getItem("userRole") || "viewer";
//   // Destructure signout safely
//   const signout = auth?.signout;

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{ sx: { width: 320, padding: 3 } }}
//     >
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h5">
//           User Profile
//           {/* {t("user_profile")} */}
//         </Typography>
//         <IconButton onClick={onClose} aria-label="Close drawer">
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <Box mb={2}>
//         <Typography variant="subtitle1" fontWeight="bold">
//           Name:
//           {/* {t("name_user")}: */}
//         </Typography>
//         <Typography variant="body1">
//           {/* Display first and last name from context if available.
//           Fallback to localStorage if context data is missing. */}
//           {auth?.user?.firstName || userFirstName}{" "}
//           {auth?.user?.lastName || userLastName}
//         </Typography>
//       </Box>

//       <Box mb={2}>
//         <Typography variant="subtitle1" fontWeight="bold">
//           Email:
//           {/* {t("email")}: */}
//         </Typography>
//         <Typography variant="body1">
//           {/* Display email from context if available.
//           Fallback to localStorage if context data is missing. */}
//           {auth?.user?.email || userEmail}
//         </Typography>
//       </Box>

//       <Box mb={3}>
//         <Typography variant="subtitle1" fontWeight="bold">
//           Role:
//           {/* {t("role")}: */}
//         </Typography>
//         <Typography variant="body1">
//           {/* Display role from context if available.
//           Fallback to localStorage if context data is missing. */}
//           {auth?.user?.role || userRole}
//         </Typography>
//       </Box>

//       <Divider sx={{ mb: 3 }} />

//       <Button
//         variant="contained"
//         sx={{
//           bgcolor: "#8E4585",
//           color: "#ffffff",
//         }}
//         startIcon={<LogoutIcon />}
//         fullWidth
//         onClick={() => {
//           if (signout) signout();
//           onClose();
//         }}
//       >
//         Log Out
//         {/* {t("log_out")} */}
//       </Button>
//     </Drawer>
//   );
// };

// export default UserProfileDrawer;

// import React, { useContext } from "react";
// // https://mui.com/material-ui/react-drawer/
// // https://mui.com/material-ui/react-divider/
// // https://www.codingeasypeasy.com/blog/mastering-material-ui-drawer-a-comprehensive-guide-with-examples
// import {
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   Divider,
//   Avatar,
//   Link as MuiLink, // Added for account link
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { AuthContext } from "../../context/authContext";
// import { Link } from "react-router-dom"; // Added for navigation to account page
// // import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Optional icon if needed later

// // import { useTranslation } from "react-i18next";
// // import i18n from "../../i18n/i18n";

// // Props expected by the UserProfileDrawer component
// interface UserProfileDrawerProps {
//   // Whether the drawer is open or not. It is controlled by the parent siteHeader
//   open: boolean;
//   // Function to close the drawer. Called when the user clicks outside or on the close button.
//   onClose: () => void;
// }

// const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
//   open,
//   onClose,
// }) => {
//   const auth = useContext(AuthContext);

//   /**
//    * We are using the translation hook gets the t function and i18n instance inside our functional component.
//    * However, i18n is already embedded into the <LanguageSwitcher /> component
//    * https://react.i18next.com/latest/usetranslation-hook
//    */
//   // const { t } = useTranslation();
//   // console.log("Current language:", i18n.language);

//   // Fallback user info from localStorage if context doesn't have it
//   const userFirstName =
//     auth?.user?.firstName || localStorage.getItem("userFirstName") || "User";
//   const userLastName =
//     auth?.user?.lastName || localStorage.getItem("userLastName") || "User";
//   const userEmail =
//     auth?.user?.email ||
//     localStorage.getItem("userEmail") ||
//     "user@example.com";
//   // const userRole = localStorage.getItem("userRole") || t("viewer");
//   const userRole =
//     auth?.user?.role || localStorage.getItem("userRole") || "viewer";
//   // Destructure signout safely
//   const signout = auth?.signout;

//   // Added: user avatar support (image or initials)
//   const userAvatar = auth?.user?.avatarUrl || ""; // Optional: URL for user avatar image
//   const initials = `${userFirstName.charAt(0)}${userLastName.charAt(
//     0
//   )}`.toUpperCase();

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{ sx: { width: 320, padding: 3 } }}
//     >
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h5">
//           User Profile
//           {/* {t("user_profile")} */}
//         </Typography>
//         <IconButton onClick={onClose} aria-label="Close drawer">
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       {/* Added: Avatar section */}
//       <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
//         {userAvatar ? (
//           <Avatar
//             src={userAvatar}
//             alt={`${userFirstName} ${userLastName}`}
//             sx={{ width: 80, height: 80, mb: 2 }}
//           />
//         ) : (
//           <Avatar
//             sx={{
//               width: 80,
//               height: 80,
//               mb: 2,
//               bgcolor: "#8E4585",
//               fontSize: 32,
//             }}
//           >
//             {initials}
//           </Avatar>
//         )}

//         <Typography variant="h6" align="center">
//           {userFirstName} {userLastName}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" align="center">
//           {userEmail}
//         </Typography>

//         {/* Added: Link to account page */}
//         <MuiLink
//           component={Link}
//           to="/account"
//           underline="hover"
//           sx={{ mt: 1, color: "#8E4585", fontWeight: 500 }}
//           onClick={onClose}
//         >
//           View Account
//         </MuiLink>
//       </Box>

//       <Divider sx={{ mb: 3 }} />

//       <Box mb={2}>
//         <Typography variant="subtitle1" fontWeight="bold">
//           Name:
//           {/* {t("name_user")}: */}
//         </Typography>
//         <Typography variant="body1">
//           {/* Display first and last name from context if available.
//           Fallback to localStorage if context data is missing. */}
//           {auth?.user?.firstName || userFirstName}{" "}
//           {auth?.user?.lastName || userLastName}
//         </Typography>
//       </Box>

//       <Box mb={2}>
//         <Typography variant="subtitle1" fontWeight="bold">
//           Email:
//           {/* {t("email")}: */}
//         </Typography>
//         <Typography variant="body1">
//           {/* Display email from context if available.
//           Fallback to localStorage if context data is missing. */}
//           {auth?.user?.email || userEmail}
//         </Typography>
//       </Box>

//       <Box mb={3}>
//         <Typography variant="subtitle1" fontWeight="bold">
//           Role:
//           {/* {t("role")}: */}
//         </Typography>
//         <Typography variant="body1">
//           {/* Display role from context if available.
//           Fallback to localStorage if context data is missing. */}
//           {auth?.user?.role || userRole}
//         </Typography>
//       </Box>

//       <Divider sx={{ mb: 3 }} />

//       <Button
//         variant="contained"
//         sx={{
//           bgcolor: "#8E4585",
//           color: "#ffffff",
//         }}
//         startIcon={<LogoutIcon />}
//         fullWidth
//         onClick={() => {
//           if (signout) signout();
//           onClose();
//         }}
//       >
//         Log Out
//         {/* {t("log_out")} */}
//       </Button>
//     </Drawer>
//   );
// };

// export default UserProfileDrawer;

import React, { useContext } from "react";
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
        firstName: supabaseUser.firstName || "User",
        lastName: supabaseUser.lastName || "User",
        email: supabaseUser.email || "user@example.com",
        role: supabaseUser.role || "guest",
        avatarUrl: supabaseUser.avatarUrl || "",
        createdAt: supabaseUser.createdAt || "",
        country: supabaseUser.country || "Unknown",
        zipCode: supabaseUser.zipCode || "",
      }
    : null;

  if (!user) return null;

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
    0
  )}`.toUpperCase();

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
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
            alt={`${user.firstName} ${user.lastName}`}
            sx={{ width: 80, height: 80, mb: 2 }}
          />
        ) : (
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: "#8E4585",
              fontSize: 32,
            }}
          >
            {initials}
          </Avatar>
        )}
        <Typography variant="h6" align="center">
          {user.firstName} {user.lastName}
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
            sx={{ mt: 1, color: "#8E4585", fontWeight: 500 }}
            onClick={onClose}
          >
            View Admin Dashboard
          </MuiLink>
        )}

        <MuiLink
          component={Link}
          to="/account"
          underline="hover"
          sx={{ mt: 1, color: "#8E4585", fontWeight: 500 }}
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
          bgcolor: "#8E4585",
          color: "#ffffff",
          "&:hover": { bgcolor: "#7A3E74" },
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

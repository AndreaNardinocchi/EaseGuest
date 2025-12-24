/**
 * Material Ui allow us to define a style theme for the app which all components inherit -
 * it provides a default if none is declared. The useTheme hook gives components access to the theme.
 * Material UI provides the useMediaQuery hook to simplify the implementation of media queries, i.e.
 * to query properties of the browser/device running the app. We are querying the browser’s viewport
 * dimensions, checking if they are in the medium (md) or smaller category - a mobile device.
 * const isMobile = useMediaQuery(theme.breakpoints.down(“md”))
 * The Theme object includes helper methods that generate the query string necessary to express the media query,
 * e.g. theme.breakpoints.down().
 * When the browser/device is a mobile type, the site header should render the drop-down menu;
 * otherwise, the standard navigation links should render.
 */

import React, { useState, type MouseEvent, useEffect, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
//import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import { AuthContext } from "../../context/authContext";
import UserProfileDrawer from "../UserProfileDrawer";

// import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
// import LanguageSwitcher from "../languageSwitcher";
// import UserProfileDrawer from "../UserProfileDrawer";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader: React.FC = () => {
  const [userName, setUserName] = useState("User");

  const { token } = useContext(AuthContext) || {};
  const { user } = useContext(AuthContext) || {};

  useEffect(
    () => {
      // You can remove this or set it from somewhere else if needed
      setUserName(user?.first_name ?? "User");
    }, // Run this effect every time `token` changes ensuring the 'userFirstName' is up-to-date
    [token, user]
  );

  console.log("SiteHeader token:", token);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  //   const [drawerOpen, setDrawerOpen] = useState(false);

  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  // const [movieMenuAnchorEl, setMovieMenuAnchorEl] =
  //   useState<null | HTMLElement>(null);

  const mobileMenuOpen = Boolean(mobileAnchorEl);
  // const isMovieMenuOpen = Boolean(movieMenuAnchorEl);

  const handleMobileMenu = (event: MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  // const handleMovieMenu = (event: MouseEvent<HTMLElement>) => {
  //   setMovieMenuAnchorEl(event.currentTarget);
  // };

  const handleMenuClose = () => {
    setMobileAnchorEl(null);
    setMovieMenuAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const mobileMenuOptions = [
    { label: "Home", path: "/" },
    { label: "About us", path: "/about-us" },
    { label: "Rooms", path: "/rooms" },
    { label: "Facilities", path: "/facilities" },
    // { label: "Contact us", path: "/contact-us" },
  ];

  /**
   * 'drawerOpen' state has been set for the logged in user state. The reason behind that is
   * that to manage the open/close state of the UserProfileDrawer 'UserProfileDrawer/index.tsx',
   * a side panel (also known as a drawer) that slides in from the edge of the screen, a boolean
   * state variable that tracks whether the drawer is currently visible (true) or hidden (false)
   * was needed
   */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isHomePage = location.pathname === "/";
  const isRoomDetailsPage = location.pathname.startsWith("/room/");
  const isBookingConfirmationPage = location.pathname.startsWith(
    "/booking-confirmation/"
  );
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{ bgcolor: "#472d30;" }}
      >
        <Toolbar sx={{ color: "white" }}>
          <Link onClick={() => navigate("/")} to={""} rel="noopener"></Link>

          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            <img
              src="/assets/GuestEaseLogo.svg"
              alt="GuestEase logo"
              style={{
                height: "80px",
                width: "auto",
                marginLeft: "2%",
              }}
            />
          </Link>

          {isMobile ? (
            <>
              {/* <LanguageSwitcher /> */}
              <IconButton
                aria-label="menu"
                onClick={handleMobileMenu}
                color="inherit"
                size="large"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="mobile-menu"
                anchorEl={mobileAnchorEl}
                open={mobileMenuOpen}
                onClose={handleMenuClose}
                sx={{ color: "white" }}
              >
                {mobileMenuOptions.map((opt) => (
                  <MenuItem
                    key={opt.label}
                    onClick={() => handleNavigate(opt.path)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}

                <MenuItem onClick={() => setDrawerOpen(true)}>
                  {/* <MenuItem> */}
                  Welcome {userName}!{" "}
                  {/*<SkateboardingIcon sx={{ ml: 1 }} /> */}
                </MenuItem>
                <MenuItem onClick={() => navigate("/login")}>
                  Login <LoginIcon sx={{ ml: 1 }} />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* <LanguageSwitcher /> */}
              <Button
                sx={{ textTransform: "none" }}
                color="inherit"
                onClick={() => handleNavigate("/")}
              >
                Home
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                color="inherit"
                onClick={() => handleNavigate("/about-us")}
              >
                About us
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                color="inherit"
                onClick={() => handleNavigate("/rooms")}
              >
                Rooms
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                color="inherit"
                onClick={() => handleNavigate("/facilities")}
              >
                Facilities
              </Button>

              {token ? (
                <>
                  <Button
                    sx={{ textTransform: "none" }}
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                  >
                    Welcome {userName}!
                  </Button>
                </>
              ) : (
                <Button
                  sx={{ textTransform: "none" }}
                  color="inherit"
                  onClick={() => navigate("/login")}
                >
                  Login <LoginIcon sx={{ ml: 1 }} />
                </Button>
              )}
            </>
          )}
        </Toolbar>

        <UserProfileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </AppBar>
      {/* Only add Offset if not on the homepage */}
      {/* Only add Offset if not on the homepage or RoomDetails page */}
      {!isHomePage && !isRoomDetailsPage && !isBookingConfirmationPage && (
        <Offset />
      )}{" "}
    </>
  );
};

export default SiteHeader;

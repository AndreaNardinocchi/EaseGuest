// import React, { useState, useContext, useEffect } from "react";
// import { AuthContext } from "../context/authContext";
// // https://v5-0-6.mui.com/components/text-fields/?
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Container,
//   /**
//    * Input Adornments in Material-UI's mui textfield offer a flexible way
//    * to incorporate additional elements like prefixes, suffixes, or
//    * interactive icons directly within the text field.
//    * https://www.php.cn/faq/1796604601.html?
//    * https://v5-0-6.mui.com/components/text-fields/?
//    * */
//   InputAdornment,
// } from "@mui/material";
// import KeyIcon from "@mui/icons-material/Key";
// import EmailIcon from "@mui/icons-material/Email";
// import { useLocation, useNavigate } from "react-router-dom";
// // import { useTranslation } from "react-i18next";
// // import i18n from "../i18n/i18n";
// import { supabase } from "../supabaseClient";

// const LoginPage: React.FC = () => {
//   /**
//    * We are using the translation hook gets the t function and i18n instance inside our functional component.
//    * However, i18n is already embedded into the <LanguageSwitcher /> component
//    * https://react.i18next.com/latest/usetranslation-hook
//    */
//   //   const { t } = useTranslation();
//   //   console.log("Current language:", i18n.language);

//   const location = useLocation();

//   /**
//    * This is the browser title
//    * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
//    */
//   useEffect(() => {
//     // document.title = `${t("login")} | MoviesApp`;
//     document.title = `Login | GuestEase`;
//     //   }, [t]);
//   });

//   const { authenticate } = useContext(AuthContext) || {};

//   // useSate() hooks for storing user input from the login form.
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   /**
//    * As we would like to handle empty field errors, we will set an error and
//    * handle it in the handleSignUp function below.
//    * https://muhimasri.com/blogs/mui-validation/
//    */
//   const [emailError, setEmailError] = useState(false);
//   const [passwordError, setPasswordError] = useState(false);

//   /**
//    * As we would like to handle incorrect data inputted by the user,
//    * we will set an error and handle it in the handleSignUp function below.
//    */
//   const [loginError, setLoginError] = useState("");

//   /**
//    * Handles login logic when the user submits the form.
//    * If an 'authenticate' function is available (from context),
//    * it is called with the current email and password values.
//    * This triggers authentication logging and checking credentials
//    */
//   const login = async () => {
//     // Create a boolean variable which indicates whether the error exists or not
//     let hasError = false;
//     // The email field can't be empty
//     if (email.trim() === "") {
//       setEmailError(true);
//       hasError = true;
//     } else {
//       setEmailError(false);
//     }

//     // The password field can't be empty
//     if (password.trim() === "") {
//       setPasswordError(true);
//       hasError = true;
//     } else {
//       setPasswordError(false);
//     }

//     // Error message
//     if (hasError) {
//       // setLoginError(t("incorrect_credentials"));
//       setLoginError("Incorrect Credentials");
//     }

//     // The below async function sends a request to Supabase using the uesr credentials
//     // https://supabase.com/docs/reference/javascript/auth-signinwithpassword
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     // If error, an error message will be shown
//     if (error) {
//       console.error("Login error:", error.message);
//       //   setLoginError(t("incorrect_credentials"));
//       setLoginError("Incorrect Credentials");
//       return setLoginError;
//     }

//     console.log("Login successful:", data);
//     setLoginError("");
//     if (authenticate) {
//       // 'data. wuill include both `user` and `session`
//       authenticate(data);
//     }

//     /**
//      *
//      * After a user logs in successfully, we want to redirect them back to the page
//      * they originally tried to visit (before being redirected to the login page).
//      * When a user hits a protected page without being authenticated, we store the intended
//      * destination inside `location.state.intent`. Once they log in, we extract that original
//      * route and redirect them to it.
//      * https://www.robinwieruch.de/react-router-authentication/?
//      * https://www.reddit.com/r/reactjs/comments/uwx8h0/need_help_how_to_access_user_requested_route/
//      */
//     const redirectPath =
//       location.state?.intent?.pathname || location.state?.intent || "/";
//     navigate(redirectPath, {
//       replace: true,
//       state: { path: location.pathname },
//     });

//     // // navigate("/");

//     // location;
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           minHeight: "50vh",
//           padding: 10,
//           margin: 0,
//           backgroundColor: "#ffffff",
//         }}
//       >
//         <Container maxWidth="sm">
//           <Typography variant="h4" gutterBottom>
//             {/* {t("login_header")} */}
//             Have a nice stay!
//             {/* Let's go to the cinema tonight! */}
//           </Typography>

//           <Box component="form" noValidate autoComplete="off">
//             {/* Email Field
//         https://muhimasri.com/blogs/mui-validation/*/}
//             <TextField
//               fullWidth
//               required
//               id="outlined-required"
//               label="Email"
//               //   label={t("email")}
//               type="email"
//               margin="normal"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               error={emailError}
//               //   helperText={emailError ? t("email_text") : ""}
//               helperText={emailError ? "Please enter your email" : ""}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <EmailIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Password Field
//         https://muhimasri.com/blogs/mui-validation/*/}
//             <TextField
//               fullWidth
//               required
//               id="outlined-required"
//               //   label={t("password")}
//               label="Password"
//               type="password"
//               margin="normal"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               error={passwordError}
//               //   helperText={passwordError ? t("password_text") : ""}

//               helperText={passwordError ? "Please enter your password" : ""}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <KeyIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Submit Button */}
//             <Button
//               variant="contained"
//               // color="primary"
//               fullWidth
//               onClick={login}
//               sx={{
//                 mt: 3,
//                 bgcolor: "#472d30;",
//                 color: "#ffffff",
//                 "&:hover": { bgcolor: "#e26d5c" },
//               }}
//             >
//               Submit
//               {/* {t("login_cta")} */}
//             </Button>
//             <Button
//               onClick={() => navigate("/signup")}
//               sx={{
//                 color: "#472d30;",
//               }}
//             >
//               Don't have an account? Sign up
//               {/* {t("login_text")} */}
//             </Button>
//             {loginError && (
//               <Typography color="error" sx={{ mt: 2 }}>
//                 {loginError}
//               </Typography>
//             )}
//           </Box>
//         </Container>
//       </Box>
//     </>
//   );
// };

// export default LoginPage;

import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
// https://v5-0-6.mui.com/components/text-fields/?
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  /**
   * Input Adornments in Material-UI's mui textfield offer a flexible way
   * to incorporate additional elements like prefixes, suffixes, or
   * interactive icons directly within the text field.
   * https://www.php.cn/faq/1796604601.html?
   * https://v5-0-6.mui.com/components/text-fields/?
   * */
  InputAdornment,
  IconButton,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import { useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import i18n from "../i18n/i18n";
import { supabase } from "../supabaseClient";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage: React.FC = () => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  //   const { t } = useTranslation();
  //   console.log("Current language:", i18n.language);

  const location = useLocation();

  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    // document.title = `${t("login")} | MoviesApp`;
    document.title = `Login | GuestEase`;
    //   }, [t]);
  });

  const { authenticate } = useContext(AuthContext) || {};
  const { resetPassword } = useContext(AuthContext);

  // useSate() hooks for storing user input from the login form.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  /**
   * As we would like to handle empty field errors, we will set an error and
   * handle it in the handleSignUp function below.
   * https://muhimasri.com/blogs/mui-validation/
   */
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  /**
   * As we would like to handle incorrect data inputted by the user,
   * we will set an error and handle it in the handleSignUp function below.
   */
  const [loginError, setLoginError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handles login logic when the user submits the form.
   * If an 'authenticate' function is available (from context),
   * it is called with the current email and password values.
   * This triggers authentication logging and checking credentials
   */
  const login = async () => {
    // Create a boolean variable which indicates whether the error exists or not
    let hasError = false;
    // The email field can't be empty
    if (email.trim() === "") {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    // The password field can't be empty
    if (password.trim() === "") {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    // Error message
    if (hasError) {
      // setLoginError(t("incorrect_credentials"));
      setLoginError("Incorrect Credentials");
    }

    // The below async function sends a request to Supabase using the uesr credentials
    // https://supabase.com/docs/reference/javascript/auth-signinwithpassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If error, an error message will be shown
    if (error) {
      console.error("Login error:", error.message);
      //   setLoginError(t("incorrect_credentials"));
      setLoginError("Incorrect Credentials");
      return setLoginError;
    }

    console.log("Login successful:", data);
    setLoginError("");
    if (authenticate) {
      // 'data. wuill include both `user` and `session`
      authenticate(data);
    }

    /**
     *
     * After a user logs in successfully, we want to redirect them back to the page
     * they originally tried to visit (before being redirected to the login page).
     * When a user hits a protected page without being authenticated, we store the intended
     * destination inside `location.state.intent`. Once they log in, we extract that original
     * route and redirect them to it.
     * https://www.robinwieruch.de/react-router-authentication/?
     * https://www.reddit.com/r/reactjs/comments/uwx8h0/need_help_how_to_access_user_requested_route/
     */
    const redirectPath =
      location.state?.intent?.pathname || location.state?.intent || "/";
    navigate(redirectPath, {
      replace: true,
      state: { path: location.pathname },
    });
  };

  return (
    <>
      {/* TWO COLUMN LAYOUT */}
      <Box
        sx={{
          // minHeight: "80vh",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          backgroundColor: "#ffffff",
          py: 8,
          mt: 10,

          px: {
            xs: 0,
            md: 4,
            lg: 8,
          },
        }}
      >
        {/* LEFT COLUMN — your full login form */}
        <Box
          sx={{
            // padding: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
              {/* {t("login_header")} */}
              Have a nice stay!
            </Typography>

            <Box component="form" noValidate autoComplete="off">
              {/* Email Field 
        https://muhimasri.com/blogs/mui-validation/*/}
              <TextField
                fullWidth
                required
                id="outlined-required"
                label="Email"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? "Please enter your email" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Field 
        https://muhimasri.com/blogs/mui-validation/*/}

              <TextField
                fullWidth
                required
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordError ? "Passwords do not match" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Submit Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={login}
                sx={{
                  mt: 3,
                  bgcolor: "#472d30",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#e26d5c" },
                }}
              >
                Submit
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  onClick={async () => {
                    if (!email) {
                      setEmailError(true);
                      return;
                    }

                    const result = await resetPassword(email);

                    if (result?.error) {
                      setLoginError(result.error);
                    } else {
                      setLoginError(
                        "Password reset email sent. Check your inbox."
                      );
                    }
                  }}
                  sx={{ color: "#472d30", textTransform: "uppercase" }}
                >
                  Forgot your password?
                </Button>

                <Typography component="span" sx={{ mx: 1, color: "#999" }}>
                  •
                </Typography>

                <Button
                  onClick={() => navigate("/signup")}
                  sx={{ color: "#472d30", textTransform: "uppercase" }}
                >
                  Dont' have an account? Sign up
                </Button>
              </Box>

              {loginError && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {loginError}
                </Typography>
              )}
            </Box>
          </Container>
        </Box>

        {/* RIGHT COLUMN — IMAGE */}
        <Container
          sx={{
            maxWidth: { xs: "lg", sm: "sm", lg: "lg" },
            mb: { sm: 6, xs: 6 },
          }}
        >
          <Box
            component="img"
            src="/assets/view-of-an-irish-bed-and-breakfast-with-eight-rooms-a.jpg"
            alt="Irish Bed and Breakfast"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: { md: "block", xs: "block" },
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              mt: {
                lg: 0,
                md: 0,
                sm: 6,
                xs: 6,
              },

              mb: {
                lg: 0,
                md: 0,
                sm: 6,
                xs: 6,
              },
            }}
          />
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;

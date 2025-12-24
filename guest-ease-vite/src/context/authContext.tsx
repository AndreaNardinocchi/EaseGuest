// import React, { useState, createContext, useEffect, useCallback } from "react";
// // import fakeAuth from "../util";
// import { useLocation, useNavigate } from "react-router-dom";
// import type { AuthContextInterface, User } from "../types/interfaces";
// // import { useTranslation } from "react-i18next";
// // import i18n from "../i18n/i18n";
// import { supabase } from "../supabaseClient";
// // We are importing 'Session' and 'User from the @supabase/supabase-js package
// // User is renamed to SupabaseUser using the as keyword to avoid naming conflicts with any other User
// // We are importing 'Session' and 'User from the @supabase/supabase-js package
// // User is renamed to SupabaseUser using the as keyword to avoid naming conflicts with any other User
// import type { Session, User as SupaUser } from "@supabase/supabase-js";

// // eslint-disable-next-line react-refresh/only-export-components
// export const AuthContext = createContext<AuthContextInterface | null>(null);

// const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
//   /**
//    * We are using the translation hook gets the t function and i18n instance inside our functional component.
//    * However, i18n is already embedded into the <LanguageSwitcher /> component
//    * https://react.i18next.com/latest/usetranslation-hook
//    */
//   // const { t } = useTranslation();
//   //console.log("Current language:", i18n.language);

//   const [token, setToken] = useState<string | null>(null);

//   /**
//    * Declare a state variable `user` with a default value "User"
//    * `setUser` is the function used to update this state
//    * */
//   // const [user, setUser] = useState<User>({
//   //   firstName: "User",
//   //   lastName: "User",
//   //   email: "user@example.com",
//   //   role: "guest",
//   //   // role: t("viewer"),
//   // });

//   const [user, setUser] = useState<User | null>(null);

//   const location = useLocation();
//   const navigate = useNavigate();

//   /**
//    * Authenticates the user using Supabase login data and updates the app state.
//    * supabaseData is an object containing the authenticated `user` and `session` from Supabase.
//    * Typescript prompted the use of useCallback()
//    * https://react.dev/reference/react/useCallback
//    */
//   const authenticate = useCallback(
//     async (supabaseData: { user: SupaUser; session: Session }) => {
//       // Destructure the user and session from the Supabase response.
//       // user and session are feched from Supabase
//       const { user, session } = supabaseData;

//       if (!user || !session) {
//         console.error("Missing user or session");
//         return;
//       }

//       // Extract the user data from Supabase's user metadata as seen in the console
//       // Fallback values are provided in case some fields are missing.
//       const newUser: User = {
//         firstName: user.user_metadata.first_name || "User",
//         lastName: user.user_metadata.last_name || "User",
//         email: user.user_metadata.email || "user@example.com",
//         //  role: user.user_metadata.role || t("viewer"), // or assign "viewer" by default
//         role: user.user_metadata.role || "guest",
//         id: "",
//         createdAt: user.created_at || "time",
//         country: user.user_metadata.country || "country",
//       };

//       // Update the user state in the AuthContext
//       setUser(newUser);
//       // Store the access token for authenticated requests
//       // https://supabase.com/docs/reference/javascript/auth-setsession
//       setToken(session.access_token || null);

//       /**
//        * Since we have now added the getSession() function, we need to ensure that
//        * the 'origin' redirection does occur if 'origin' is there and avoid a fallback to '/'
//        * Without the 'if' condition, it won't work
//        */
//       const origin = location.state?.intent?.pathname;
//       if (origin) {
//         navigate(origin);
//       }
//     },
//     // [t, location, navigate] // dependencies used inside authenticate with useCallback()
//     [location, navigate]
//   );

//   useEffect(() => {
//     /**
//      * This async function tries to restore an existing user session on page load or refresh.
//      * If a valid session is found, it will `authenticate()` to set user state and token again
//      * The session data will be fetched from the localStorage and the session will be resumed.
//      */
//     async function fetchSession() {
//       // https://supabase.com/docs/reference/javascript/auth-getsession
//       // https://github.com/orgs/supabase/discussions/32783
//       const { data, error } = await supabase.auth.getSession();

//       if (error) {
//         console.error("Failed to restore session");
//         return;
//       }

//       console.log("getSession(): ", data.session, error);

//       // We create a const variable called 'session'
//       const session = data.session;

//       // If the session and user of that session exist, then, we will authenticate them again and
//       // the session will be restored (authenticate() takes the 2 values as per 'const { user, session } = supabaseData;')
//       if (session && session.user) {
//         authenticate({ user: session.user, session });
//       }
//     }

//     fetchSession();
//   }, [authenticate]);

//   // We do need to create an async function to use the Supabase signOut() function
//   const signout = async () => {
//     // https://supabase.com/docs/reference/javascript/auth-signout
//     const { error } = await supabase.auth.signOut();

//     if (error) {
//       console.error("Failed to restore session");
//       return;
//     }

//     setToken(null);
//     navigate("/");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         authenticate,
//         signout,
//       }}
//     >
//       {props.children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContextProvider;

import React, { useState, createContext, useEffect, useCallback } from "react";
// import fakeAuth from "../util";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthContextInterface, User } from "../types/interfaces";
// import { useTranslation } from "react-i18next";
// import i18n from "../i18n/i18n";
import { supabase } from "../supabaseClient";
// We are importing 'Session' and 'User from the @supabase/supabase-js package
// User is renamed to SupabaseUser using the as keyword to avoid naming conflicts with any other User
// We are importing 'Session' and 'User from the @supabase/supabase-js package
// User is renamed to SupabaseUser using the as keyword to avoid naming conflicts with any other User
import type { Session, User as SupaUser } from "@supabase/supabase-js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.react-i18next.com/latest/usetranslation-hook
   */
  // const { t } = useTranslation();
  //console.log("Current language:", i18n.language);

  const [token, setToken] = useState<string | null>(null);

  /**
   * Declare a state variable `user` with a default value "User"
   * `setUser` is the function used to update this state
   * */
  // const [user, setUser] = useState<User>({
  //   firstName: "User",
  //   lastName: "User",
  //   email: "user@example.com",
  //   role: "guest",
  //   // role: t("viewer"),
  // });

  const [user, setUser] = useState<User | null>(null);

  // ------------------------
  // >>> ADDED loading state <<<
  // ------------------------
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Authenticates the user using Supabase login data and updates the app state.
   * supabaseData is an object containing the authenticated `user` and `session` from Supabase.
   * Typescript prompted the use of useCallback()
   * https://react.dev/reference/react/useCallback
   */
  const authenticate = useCallback(
    async (supabaseData: { user: SupaUser; session: Session }) => {
      const { user, session } = supabaseData;

      // if (!user || !session) {
      //   console.error("Missing user or session");
      //   return;
      // }

      if (!user || !session) {
        // Session not ready yet — this is normal during page load
        return;
      }

      const metadata = user.user_metadata || {};

      const newUser: User = {
        id: user.id,
        first_name: metadata.first_name || "User",
        last_name: metadata.last_name || "User",
        email: user.email || "user@example.com",
        role: metadata.role || "guest",
        created_at: user.created_at || new Date().toISOString(),
        country: metadata.country || "Unknown",
        zip_code: metadata.zip_code || "Unknown",
      };

      // <<< THIS IS WHERE THE USER STATE IS UPDATED >>>
      setUser(newUser); // <--- Updates user data in the context
      setToken(session.access_token || null);

      const origin = location.state?.intent?.pathname;
      if (origin) {
        navigate(origin);
      }
    },
    [location, navigate]
  );

  // Add this function inside your AuthContextProvider, alongside `signout`
  const deleteUser = async () => {
    if (!user) {
      console.error("No user logged in to delete");
      return;
    }

    try {
      // Call your local Node server to delete the user
      const response = await fetch("http://localhost:3000/delete_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete failed:", data);
        alert("Failed to delete account: " + (data.error || "Unknown error"));
        return;
      }

      // // After deletion, log out user locally
      await supabase.auth.signOut();

      // authContext.tsx
      localStorage.removeItem("supabase.auth.token"); // or however you store the session
      setUser(null); // reset user state

      setUser(null);
      setToken(null);
      navigate("/");

      console.log("User deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting user:", err.message);
    }
  };

  // const deleteUser = async () => {
  //   if (!user) {
  //     console.error("No user logged in to delete");
  //     return;
  //   }

  //   try {
  //     // Option 1: Sign the user out first (client-side)
  //     await supabase.auth.signOut();

  //     // Option 2: Call a Supabase Function / Admin API to delete user
  //     const { error } = await supabase.functions.invoke("delete-user", {
  //       body: { userId: user.id },
  //     });

  //     if (error) {
  //       console.error("Failed to delete user:", error.message);
  //       return;
  //     }

  //     // Clear local state
  //     setUser(null);
  //     setToken(null);

  //     // Redirect to home
  //     navigate("/");

  //     console.log("User deleted successfully!");
  //   } catch (err) {
  //     console.error("Error deleting user:", err);
  //   }
  // };

  useEffect(() => {
    /**
     * This async function tries to restore an existing user session on page load or refresh.
     * If a valid session is found, it will `authenticate()` to set user state and token again
     * The session data will be fetched from the localStorage and the session will be resumed.
     */
    async function fetchSession() {
      // https://supabase.com/docs/reference/javascript/auth-getsession
      // https://github.com/orgs/supabase/discussions/32783
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to restore session");
        setLoading(false); // <<< ADDED
        return;
      }

      console.log("getSession(): ", data.session, error);

      // We create a const variable called 'session'
      const session = data.session;

      // If the session and user of that session exist, then, we will authenticate them again and
      // the session will be restored (authenticate() takes the 2 values as per 'const { user, session } = supabaseData;')
      if (session && session.user) {
        await authenticate({ user: session.user, session });
      }

      // ------------------------
      // >>> ADDED setLoading(false) <<<
      // ------------------------
      setLoading(false);
    }

    fetchSession();

    /**
     * Add listener for auth state changes (login, logout, token refresh)
     * This ensures the user state and token stay updated automatically
     */
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          authenticate({ user: session.user, session });
        } else {
          setUser(null);
          setToken(null);
        }
      }
    );

    return () => subscription?.subscription.unsubscribe();
  }, [authenticate]);

  // We do need to create an async function to use the Supabase signOut() function
  const signout = async () => {
    // https://supabase.com/docs/reference/javascript/auth-signout
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Failed to restore session");
      return;
    }

    setToken(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading, // <<< ADDED
        deleteUser, // <<< newly added
        authenticate,
        signout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { createClient } from "@supabase/supabase-js";
import AdminSubNav from "../components/adminSubNav/adminSubNav";

import type { User } from "../types/interfaces";
import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";
import UserFilterUI from "../userFilterUI/userFilterUI";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const BASE_URL = "http://localhost:3000";

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [openUserModal, setOpenUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    email: "",
    first_name: "",
    last_name: "",
    country: "",
    role: "",
    created_at: "",
  });

  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    country: "",
    zip_code: "",
    email: "",
    role: "guest",
  });

  // -----------------------------
  // Fetch Users
  // -----------------------------
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setUsers(data || []);
  };

  useEffect(() => {
    (async () => {
      await fetchUsers();
      setLoading(false);
    })();
  }, []);

  // -----------------------------
  // Modal Handlers
  // -----------------------------
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      first_name: "",
      last_name: "",
      email: "",
      role: "guest",
      country: "",
      zip_code: "",
    });
    setOpenUserModal(true);
  };

  const handleOpenUpdateUser = (u: User) => {
    setEditingUser(u);
    setUserForm({
      first_name: u.first_name ?? "",
      last_name: u.last_name ?? "",
      email: u.email ?? "",
      role: u.role || "guest",
      country: u.country ?? "",
      zip_code: u.zip_code ?? "",
    });
    setOpenUserModal(true);
  };

  // -----------------------------
  // Save User
  // -----------------------------
  const handleSaveUser = async () => {
    const endpoint = editingUser
      ? `${BASE_URL}/api/admin/update_user`
      : `${BASE_URL}/api/admin/create_user`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to save user");
      return;
    }

    setOpenUserModal(false);
    fetchUsers();
  };

  // -----------------------------
  // Delete User
  // -----------------------------
  const handleDeleteUser = async (id: string, role: string | null) => {
    if (role === "admin") {
      alert("Cannot delete admin user!");
      return;
    }

    if (!confirm("Delete this user?")) return;

    const res = await fetch(`${BASE_URL}/admin/delete_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    fetchUsers();
  };

  /** Apply all active filters to the bookings list */
  const filteredUsers = users.filter((u) => {
    /** Normalize the global search text */
    const search = filters.search.toLowerCase();

    /** Build a combined string so the global search can match any field */
    const searchString = [
      u.email,
      u.first_name,
      u.last_name,
      u.country,
      u.zip_code,
      u.role,
      new Date(u.created_at).toLocaleString(),
    ]
      .join(" ")
      .toLowerCase();

    /** Global search filter */
    const matchesSearch = searchString.includes(search);

    /** Room filter (exact match) */
    const matchesEmail = filters.email
      ? String(u.email) === String(filters.email)
      : true;

    /** First name filter (partial match) */
    const matchesFirst = filters.first_name
      ? u.first_name?.toLowerCase().includes(filters.first_name.toLowerCase())
      : true;

    /** Last name filter (partial match) */
    const matchesLast = filters.last_name
      ? u.last_name?.toLowerCase().includes(filters.last_name.toLowerCase())
      : true;

    /** Email filter (partial match) */
    const matchesCountry = filters.country
      ? u.country?.toLowerCase().includes(filters.country.toLowerCase())
      : true;

    // /** Guests filter (exact numeric match) */
    // const matchesZipCode = filters.zip_code
    //   ? u.zip_code === filters.zip_code
    //   : true;

    /** Guests filter (exact numeric match) */
    const matchesRole = filters.role ? u.role === filters.role : true;

    /** Created‑at filter (exact day match) */
    const matchesCreatedAt = filters.created_at
      ? new Date(u.created_at).toDateString() ===
        new Date(filters.created_at).toDateString()
      : true;

    /** Only include bookings that match ALL filters */
    return (
      matchesSearch &&
      matchesEmail &&
      matchesFirst &&
      matchesLast &&
      matchesCountry &&
      matchesRole &&
      matchesCreatedAt
    );
  });

  // -----------------------------
  // Loading State
  // -----------------------------
  if (loading)
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );

  // -----------------------------
  // Page UI
  // -----------------------------
  return (
    <>
      <AdminDashboardHeader />
      <AdminSubNav />
      <Container sx={{ pb: 8, overflow: "visible" }}>
        <Box my={4} display="flex" justifyContent="space-between">
          <Typography variant="h4">Users</Typography>
          <Button
            variant="contained"
            onClick={handleOpenCreateUser}
            sx={{ backgroundColor: "#e26d5c" }}
          >
            + Create User
          </Button>
        </Box>

        <UserFilterUI filters={filters} setFilters={setFilters} />
        <TableContainer
          component={Paper}
          sx={{
            mb: 6,
            overflowX: "auto",
            borderRadius: 2,
            boxShadow: 3,
            "&::-webkit-scrollbar": { height: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bbb",
              borderRadius: 4,
            },
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>

                {/* Hide on mobile */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Country
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Zip Code
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>

                {/* Hide on mobile */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Created At
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow
                  key={u.id}
                  sx={{
                    "&:hover": { backgroundColor: "#fafafa" },
                    transition: "0.2s",
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{u.id}</TableCell>

                  {/* WRAPPED EMAIL */}
                  <TableCell
                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    {u.email}
                  </TableCell>

                  <TableCell>{u.first_name}</TableCell>
                  <TableCell>{u.last_name}</TableCell>

                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {u.country}
                  </TableCell>

                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {u.zip_code}
                  </TableCell>

                  <TableCell>{u.role}</TableCell>

                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {new Date(u.created_at).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenUpdateUser(u)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteUser(u.id, u.role)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* User Modal */}
        <Dialog
          open={openUserModal}
          onClose={() => setOpenUserModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editingUser ? "Update User" : "Create User"}
          </DialogTitle>

          <DialogContent>
            <TextField
              margin="dense"
              label="First Name"
              fullWidth
              value={userForm.first_name}
              onChange={(e) =>
                setUserForm({ ...userForm, first_name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Last Name"
              fullWidth
              value={userForm.last_name}
              onChange={(e) =>
                setUserForm({ ...userForm, last_name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              disabled={!!editingUser}
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Role"
              fullWidth
              value={userForm.role}
              onChange={(e) =>
                setUserForm({ ...userForm, role: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Country"
              fullWidth
              value={userForm.country}
              onChange={(e) =>
                setUserForm({ ...userForm, country: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Zip Code"
              fullWidth
              value={userForm.zip_code}
              onChange={(e) =>
                setUserForm({ ...userForm, zip_code: e.target.value })
              }
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenUserModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveUser}>
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminUsersPage;

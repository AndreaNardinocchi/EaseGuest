import { useState } from "react";
import {
  Box,
  Button,
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

import type { User } from "../../types/interfaces";
import type { SupabaseClient } from "@supabase/supabase-js";

type Props = {
  users: User[];
  fetchUsers: () => Promise<void>;
  BASE_URL: string;
  supabase: SupabaseClient;
};

export default function AdminUsers({
  users,
  fetchUsers,
  BASE_URL,
  supabase,
}: Props) {
  const [openUserModal, setOpenUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    country: "",
    zip_code: "",
    email: "",
    role: "guest",
  });

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
    if (!res.ok) throw new Error(data.error || "Failed to create user");

    setOpenUserModal(false);
    fetchUsers();
  };

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

  return (
    <>
      <Box my={4} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleOpenCreateUser}>
          + Create User
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Zip Code</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.first_name}</TableCell>
                <TableCell>{u.last_name}</TableCell>
                <TableCell>{u.country}</TableCell>
                <TableCell>{u.zip_code}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{new Date(u.created_at).toLocaleString()}</TableCell>
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
        <DialogTitle>{editingUser ? "Update User" : "Create User"}</DialogTitle>
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
            value={userForm.email}
            disabled={!!editingUser}
            onChange={(e) =>
              setUserForm({ ...userForm, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Role"
            fullWidth
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
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
    </>
  );
}

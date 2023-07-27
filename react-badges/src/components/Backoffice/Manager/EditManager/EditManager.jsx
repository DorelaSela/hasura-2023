import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  EDIT_MANAGER_NAME,
  ADD_RELATION,
  LOAD_MANAGERS
} from "../../../../containers/state/ManagersQueries";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Button
} from "@mui/material";
import { useParams } from "react-router-dom";

const EditManager = () => {
  const [name, setName] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [editManagersName] = useMutation(EDIT_MANAGER_NAME, {
    refetchQueries: [{ query: LOAD_MANAGERS }]
  });
  const { loading, error, data } = useQuery(LOAD_MANAGERS);

  const manager = data?.managers?.find(
    (manager) => manager.id === parseInt(id)
  );

  useEffect(() => {
    if (data?.managers && manager?.name) {
      setName(manager?.name);
    }
  }, [data?.managers, manager]);

  const handleEdit = () => {
    editManagersName({
      variables: {
        id: id,
        name: name
      }
    });
    navigate("/managers");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Card sx={{ padding: "16px", width: "400px", textAlign: "center" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Typography variant="h5" gutterBottom>
            Enter Your Name
          </Typography>
          <TextField
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField value={manager?.id} label="ID" disabled />
          <TextField value={manager?.is_deleted} label="Is deleted" disabled />
          <Button variant="contained" onClick={handleEdit} color="success">
            Save
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditManager;

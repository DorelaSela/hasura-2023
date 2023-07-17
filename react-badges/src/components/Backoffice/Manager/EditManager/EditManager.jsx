import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  EDIT_MANAGER_NAME,
  ADD_RELATION,
  LOAD_MANAGERS
} from "../../../../containers/state/ManagersQueries";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useParams } from "react-router-dom";

const EditManager = () => {
  const [name, setName] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [editManagersName] = useMutation(EDIT_MANAGER_NAME, {
    refetchQueries: [{ query: LOAD_MANAGERS }]
  });
  const { loading, error, data } = useQuery(LOAD_MANAGERS);

  const manager = data.managers.find((manager) => manager.id === parseInt(id));

  useEffect(() => {
    setName(manager.name);
  }, [manager.name]);

  console.log(data.managers);

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
    <div>
      <TextField
        type="text"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button variant="contained" onClick={handleEdit}>
        Done
      </Button>
    </div>
  );
};

export default EditManager;

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
    <div>
      <br /> <br />
      <TextField
        type="text"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /> <br />
      <TextField value={manager?.id} label="ID" disabled />
      <br /> <br />
      <TextField value={manager?.is_deleted} label="Is deleted" disabled />
      <br /> <br />
      <Button variant="contained" onClick={handleEdit}>
        Done
      </Button>
    </div>
  );
};

export default EditManager;

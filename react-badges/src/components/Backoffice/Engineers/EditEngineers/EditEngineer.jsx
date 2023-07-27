import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_ENGINEERS,
  LOAD_ENGINEERS
} from "../../../../containers/state/EngineersQueries";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const EditEngineer = () => {
  const [name, setName] = useState("");
  const [updateEngineers, { loading: updateLoading, error }] = useMutation(
    UPDATE_ENGINEERS,
    {
      refetchQueries: [{ query: LOAD_ENGINEERS }]
    }
  );
  const { data, loading } = useQuery(LOAD_ENGINEERS);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const currEngineer = data.engineers.find((item) => item.id == id);
      if (currEngineer) {
        setName(currEngineer.name);
      }
    }
  }, [data]);

  const handleSaveEdit = () => {
    updateEngineers({
      variables: {
        id: id,
        name: name
      }
    });
    navigate("/engineers");
  };

  if (loading || updateLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const getEngineerbyId = (() => {
    const engineerArray = [...data?.engineers];
    const findEngineer = engineerArray.find(
      (engineer) => engineer.id === parseInt(id)
    );
    return findEngineer;
  })();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
    >
      <Typography variant="h1" sx={{ marginBottom: "1rem" }}>
        Edit Engineers
      </Typography>
      <div className="edit-textfield">
        <br />
        <TextField
          value={name}
          type="text"
          label="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <br /> <br />
        <TextField value={getEngineerbyId.id} label="ID" disabled />
        <br /> <br />
        <TextField
          value={getEngineerbyId.is_deleted}
          label="Is deleted"
          disabled
        />
        <br /> <br />
        <Button onClick={handleSaveEdit} variant="contained" color="success">
          Save
        </Button>
      </div>
    </Box>
  );
};

export default EditEngineer;

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_ENGINEERS,
  LOAD_ENGINEERS
} from "../../../../containers/state/EngineersQueries";
import { Button, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const EditEngineer = () => {
  const [name, setName] = useState("");
  const [updateEngineers, { loading, error }] = useMutation(UPDATE_ENGINEERS, {
    refetchQueries: [{ query: LOAD_ENGINEERS }]
  });
  const { data } = useQuery(LOAD_ENGINEERS);
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("Dataaaaa", data);
  console.log("ID", id);

  const findEngineer = data.engineers.find(
    (engineer) => engineer.id === parseInt(id)
  );

  useEffect(() => {
    setName(findEngineer.name);
  }, [findEngineer.name]);

  const handleSaveEdit = () => {
    updateEngineers({
      variables: {
        id: id,
        name: name
      }
    });
    navigate("/engineers");
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
        value={name}
        type="text"
        label="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleSaveEdit}>Save</Button>
    </div>
  );
};

export default EditEngineer;

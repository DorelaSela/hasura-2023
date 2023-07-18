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
  const [updateEngineers, { loading: updateLoading, error }] = useMutation(
    UPDATE_ENGINEERS,
    {
      refetchQueries: [{ query: LOAD_ENGINEERS }]
    }
  );
  const { data, loading } = useQuery(LOAD_ENGINEERS);
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("Dataaaaa", data);
  console.log("ID", id);

  const findEngineer = data.engineers.find(
    (engineer) => engineer.id === parseInt(id)
  );

  useEffect(() => {
    setName(findEngineer.name);
    console.log(findEngineer);
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

  // if (loading || updateLoading) {
  //   return <p>Loading...</p>;
  // }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <br />
      <TextField
        value={name}
        type="text"
        label="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br /> <br />
      <TextField value={findEngineer.id} label="ID" disabled />
      <br /> <br />
      <TextField value={findEngineer.is_deleted} label="Is deleted" disabled />
      <br /> <br />
      <Button onClick={handleSaveEdit}>Save</Button>
    </div>
  );
};

export default EditEngineer;

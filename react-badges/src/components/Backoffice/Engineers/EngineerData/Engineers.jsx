import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useQuery, gql } from "@apollo/client";
import { LOAD_ENGINEERS } from "../GraphQl/Queries";
import { CREATE_ENGINEERS_MUTATION } from "../GraphQl/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const Engineers = () => {
  const { loading, data } = useQuery(LOAD_ENGINEERS);
  const [engineers, setEngineers] = useState([]);
  const [name, setName] = useState("");
  const [insert_engineers, { error }] = useMutation(CREATE_ENGINEERS_MUTATION);
  // const navigate = useNavigate();

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (data) {
      console.log(data);
      setEngineers(data.engineers);
    }
  }, [data]);

  const addEngineer = () => {
    insert_engineers({
      variables: {
        name: name
      }
    });
    setName("");
  };

  return (
    <div>
      {engineers.map((engineer, index) => {
        return <h3 key={index}>{engineer.name}</h3>;
      })}
      <button onClick={addEngineer}>Create New</button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addEngineer();
        }}
      >
        <br />
        <TextField
          type="text"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
};

export default Engineers;

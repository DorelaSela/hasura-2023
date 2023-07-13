import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useQuery } from "@apollo/client";
import { LOAD_ENGINEERS } from "../GraphQl/Queries";
import { DELETE_ENGINEERS } from "../GraphQl/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const Engineers = () => {
  const { loading, data, error } = useQuery(LOAD_ENGINEERS);
  const [engineers, setEngineers] = useState([]);
  const [deleteRelationEngineers] = useMutation(DELETE_ENGINEERS, {
    refetchQueries: [{ query: LOAD_ENGINEERS }]
  });
  const navigate = useNavigate();

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (data) {
      console.log(data);
      setEngineers(data.engineers);
    }
  }, [data]);

  const deleteEngineers = (id) => {
    deleteRelationEngineers({
      variables: {
        id
      }
    });
  };

  const handleNavigate = () => {
    navigate("/engineers/create");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {engineers.map((engineer, index) => {
        return (
          <div key={index}>
            <h3>{engineer.name}</h3>
            <Button onClick={() => deleteEngineers(engineer.id)}>Delete</Button>
          </div>
        );
      })}
      <button onClick={handleNavigate}>Create New</button>
    </div>
  );
};

export default Engineers;

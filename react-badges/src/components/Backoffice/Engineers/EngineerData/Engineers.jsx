import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useQuery } from "@apollo/client";
import { LOAD_ENGINEERS } from "../../../../containers/state/EngineersQueries";
import { DELETE_ENGINEERS } from "../../../../containers/state/EngineersQueries";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import TableForm from "../../TableForm";

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
      <h2>Engineers List</h2>
      <TableForm
        data={engineers}
        onDelete={deleteEngineers}
        dataType="engineer"
      />
      <Button color="error" onClick={handleNavigate}>
        Create New
      </Button>
    </div>
  );
};

export default Engineers;

import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useQuery } from "@apollo/client";
import {
  LOAD_ENGINEERS,
  DELETE_ENGINEERS,
  DELETE_RELATIONS
} from "../../../../containers/state/EngineersQueries";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import TableForm from "../../TableForm";

const Engineers = () => {
  const { loading, data, error } = useQuery(LOAD_ENGINEERS);
  const [engineers, setEngineers] = useState([]);
  const [deleteRelationEngineers] = useMutation(DELETE_ENGINEERS, {
    refetchQueries: [{ query: LOAD_ENGINEERS }]
  });
  const [deleteRelations] = useMutation(DELETE_RELATIONS, {
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
      console.log(data.engineers);
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
    navigate("/engineers/create/");
  };

  const handleEdit = (id) => {
    navigate(`/engineers/edit/${id}`);
  };

  const handleDeleteRelations = (engineerId, managerId) => {
    deleteRelations({
      variables: {
        idE: engineerId,
        idM: managerId
      }
    });
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
        onEdit={handleEdit}
        onDeleteRelations={handleDeleteRelations}
      />
      <Button
        variant="contained"
        onClick={handleNavigate}
        className="createnew-button"
      >
        Create New Engineer
      </Button>
    </div>
  );
};

export default Engineers;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_MANAGERS,
  ADD_RELATIONS,
  GET_MANAGERS_BY_ENGINEER
} from "../../../../containers/state/EngineersQueries";
import { useQuery, useMutation } from "@apollo/client";
import { Button, Checkbox, FormControlLabel } from "@mui/material";

const AddRelations = () => {
  const [managerIds, setManagerIds] = useState([]);
  const [addRelation, { loading, error }] = useMutation(ADD_RELATIONS);
  const { id: engineerId } = useParams();
  const navigate = useNavigate();
  const [
    getManagersByEngineer,
    { data: teamsData, loading: teamsLoading, error: teamsError }
  ] = useMutation(GET_MANAGERS_BY_ENGINEER);

  useEffect(() => {
    getManagersByEngineer({
      variables: { id: parseInt(engineerId) }
    });
  }, []);

  const {
    data: managersData,
    loading: managersLoading,
    error: managersError
  } = useQuery(GET_MANAGERS);

  const handleCheckboxChange = (managerId) => {
    if (managerIds.includes(managerId)) {
      setManagerIds(managerIds.filter((id) => id !== managerId));
    } else {
      setManagerIds([...managerIds, managerId]);
    }
  };

  const handleSubmit = () => {
    if (managerIds.length > 0) {
      managerIds.forEach((managerId) => {
        if (managerId !== engineerId) {
          addRelation({
            variables: {
              engineer: parseInt(engineerId),
              manager: managerId
            }
          });
        }
      });
      navigate("/engineers");
    } else {
      navigate("/engineers");
      console.log("No manager selected");
    }
  };

  if (teamsLoading || managersLoading) {
    return <p>Loading...</p>;
  }

  if (teamsError || managersError) {
    return <p>Error: {teamsError?.message || managersError?.message}</p>;
  }

  const teams = teamsData?.get_managers_by_engineer;
  const managers = managersData?.managers;
  const filteredManagers = managers?.filter((manager) =>
    teams?.every((team) => team.id !== manager.id)
  );

  return (
    <div className="add-relation">
      <h2>Available Managers</h2>
      {filteredManagers ? (
        filteredManagers.map((record) => {
          const isDifferentEngineer = parseInt(engineerId) !== record.id;
          if (!isDifferentEngineer) {
            return null;
          }
          return (
            <div key={record.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={managerIds.includes(record.id)}
                    onChange={() => handleCheckboxChange(record.id)}
                  />
                }
                label={record.name}
              />
            </div>
          );
        })
      ) : (
        <p>No managers available</p>
      )}
      <Button onClick={handleSubmit} color="success" variant="contained">
        Submit
      </Button>
    </div>
  );
};

export default AddRelations;

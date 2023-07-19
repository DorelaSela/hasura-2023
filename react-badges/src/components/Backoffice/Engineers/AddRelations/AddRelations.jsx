import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_MANAGERS,
  ADD_RELATIONS,
  GET_MANAGERS_BY_ENGINEER
} from "../../../../containers/state/EngineersQueries";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@mui/material";

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
        addRelation({
          variables: {
            engineer: parseInt(engineerId),
            manager: managerId
          }
        });
      });
      navigate("/engineers");
    } else {
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
    <div>
      <h4>Engineers</h4>
      {filteredManagers ? (
        filteredManagers.map((record) => (
          <div key={record.id}>
            <input
              type="checkbox"
              id={record.id}
              value={record.id}
              onChange={(e) => handleCheckboxChange(e.target.value)}
            />
            <label htmlFor={record.id}>{record.name}</label>
          </div>
        ))
      ) : (
        <p>No managers available</p>
      )}
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default AddRelations;

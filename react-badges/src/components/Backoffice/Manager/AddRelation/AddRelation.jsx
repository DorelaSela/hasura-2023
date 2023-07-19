import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_RELATION,
  GET_ENGINEERS,
  GET_ENGINEERS_BY_MANAGER
} from "../../../../containers/state/ManagersQueries";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";

const AddRelation = () => {
  const [engineerIds, setEngineerIds] = useState([]);
  const [addRelation] = useMutation(ADD_RELATION);
  const { id: managerId } = useParams();
  const navigate = useNavigate();

  const [
    getEngineersByManager,
    { data: teamsData, loading: teamsLoading, error: teamsError }
  ] = useMutation(GET_ENGINEERS_BY_MANAGER);

  useEffect(() => {
    getEngineersByManager({
      variables: { id: parseInt(managerId) }
    });
  }, []);

  const {
    data: engineersData,
    loading: engineersLoading,
    error: engineersError
  } = useQuery(GET_ENGINEERS);

  const handleCheckboxChange = (engineerId) => {
    if (engineerIds.includes(engineerId)) {
      setEngineerIds(engineerIds.filter((id) => id !== engineerId));
    } else {
      setEngineerIds([...engineerIds, engineerId]);
    }
  };

  const handleSubmit = () => {
    if (engineerIds.length > 0) {
      engineerIds.forEach((engineerId) => {
        addRelation({
          variables: {
            manager: parseInt(managerId),
            engineer: engineerId
          }
        });
      });
      navigate("/managers");
    } else {
      console.log("No engineer selected");
    }
  };

  if (teamsLoading || engineersLoading) {
    return <p>Loading...</p>;
  }

  if (teamsError || engineersError) {
    return <p>Error: {teamsError?.message || engineersError?.message}</p>;
  }

  const teams = teamsData?.get_engineers_by_manager;
  const engineers = engineersData?.engineers;
  const filteredEngineers = engineers?.filter((engineer) =>
    teams?.every((team) => team.id !== engineer.id)
  );

  return (
    <div>
      <h4>Managers</h4>
      {filteredEngineers ? (
        filteredEngineers.map((record) => (
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

export default AddRelation;

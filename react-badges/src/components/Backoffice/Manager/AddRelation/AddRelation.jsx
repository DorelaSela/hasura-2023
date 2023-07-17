import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_RELATION,
  GET_ENGINEERS,
  GET_ENGINEER_TEAM
} from "../../../../containers/state/ManagersQueries";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { LOAD_MANAGERS } from "../../../../containers/state/ManagersQueries";
import { useParams } from "react-router-dom";

const AddRelation = () => {
  const [engineerIds, setEngineerIds] = useState([]);
  const [addRelation, { loading, error }] = useMutation(ADD_RELATION, {
    refetchQueries: [{ query: LOAD_MANAGERS }]
  });
  const { id: managerId } = useParams();
  const navigate = useNavigate();

  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError
  } = useQuery(GET_ENGINEER_TEAM, {
    variables: { managerId: parseInt(managerId) }
  });

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

  const teams = teamsData?.engineering_teams[0]?.items;
  const engineers = engineersData?.engineers;
  const filteredEngineers = engineers.filter((engineer) =>
    teams.every((team) => team.id !== engineer.id)
  );

  return (
    <div>
      <h4>Engineers</h4>
      {filteredEngineers.map((record) => (
        <div key={record.id}>
          <input
            type="checkbox"
            id={record.id}
            value={record.id}
            onChange={(e) => handleCheckboxChange(e.target.value)}
          />
          <label htmlFor={record.id}>{record.name}</label>
        </div>
      ))}
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default AddRelation;

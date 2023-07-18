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
  const { data: managersData } = useQuery(GET_MANAGERS);
  const [managerIds, setManagerIds] = useState([]);
  const { id: engineerId } = useParams();

  console.log(engineerId);

  const [getManagersByEngineer] = useMutation(GET_MANAGERS_BY_ENGINEER);

  

  const { data } = getManagersByEngineer({
    variables: { engineerId }
  });
  console.log(data);

  console.log(getManagersByEngineer.get_managers_by_engineer);
  const [addRelation] = useMutation(ADD_RELATIONS);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (managersData) {
  //     const filteredManagers = managersData.managers.filter(
  //       (manager) => !relatedManagers.includes(manager.id)
  //     );
  //     setFilteredManagers(filteredManagers);
  //   }
  // }, [managersData, engineerId]);

  const handleCheckboxChange = (managerId) => {
    if (managerIds.includes(managerId)) {
      setManagerIds(managerIds.filter((id) => id !== managerId));
    } else {
      setManagerIds([...managerIds, managerId]);
    }
  };

  const handleSubmit = async () => {
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

  const teams = getManagersData?.getManagersByEngineer[0]?.items;
  const managers = managersData?.managers;
  const filteredManagers = managers.filter((manager) => {
    teams.every((team) => team.id !== manager.id);
  });

  return (
    <div>
      <h4>Managers</h4>
      {filteredManagers.map((record) => (
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

export default AddRelations;

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  EDIT_RELATIONS,
  GET_MANAGERS,
  LOAD_ENGINEERS,
  USER_RELATION,
  GET_MANAGERS_WITH_ID
} from "../../../../containers/state/EngineersQueries";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const EditRelations = () => {
  const [editRelations, { loading }] = useMutation(EDIT_RELATIONS);
  const { data: engineersData } = useQuery(LOAD_ENGINEERS);

  const { data: managersData, loading: managerLoading } =
    useQuery(GET_MANAGERS);
  const { id: engineerId } = useParams();
  const { managerId: managerId } = useParams();
  const { data: currentManager } = useQuery(GET_MANAGERS_WITH_ID, {
    variables: {
      id: parseInt(managerId)
    }
  });
  const navigate = useNavigate();
  const [selectedManagerId, setSelectedManagerId] = useState([]);

  console.log(currentManager);

  const { data: userData, loading: userLoading } = useQuery(USER_RELATION, {
    variables: {
      id: parseInt(engineerId)
    }
  });

  if (userLoading || managerLoading || loading) {
    return <p>Loading...</p>;
  }

  const engineer = engineersData?.engineers?.find(
    (engineer) => engineer.id === parseInt(engineerId)
  );

  console.log(engineer.id, engineerId);

  const managers = managersData?.managers;
  console.log(managers);

  const users = userData?.users_relations;
  console.log(users);

  const managerInUsers = users?.map((user) => user.manager) || [];
  const filteredManagers = managers?.filter(
    (manager) => !managerInUsers.includes(manager.id)
  );
  console.log(filteredManagers);

  const handleEditRelations = () => {
    editRelations({
      variables: {
        idE: parseInt(engineerId),
        oldM: parseInt(managerId),
        newM: parseInt(selectedManagerId)
      }
    });
    navigate("/engineers");
  };

  console.log(selectedManagerId);

  return (
    <div>
      <h2>Edit Relations</h2>
      <h3>Engineer: {engineer.name}</h3>
      <h3>Current Manager: {currentManager?.managers[0].name}</h3>
      {filteredManagers.length > 0 ? (
        <div>
          <h3>Choose a new Manager:</h3>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="manager-select-label">Select a manager:</InputLabel>
            <Select
              className="manager-select"
              value={selectedManagerId}
              onChange={(e) => setSelectedManagerId(e.target.value)}
              label="Select a manager:"
            >
              {filteredManagers.map((manager) => {
                const isDifferentEngineer = parseInt(engineerId) !== manager.id;
                if (!isDifferentEngineer) {
                  return null;
                }
                return (
                  <MenuItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      ) : (
        <h2>No managers available</h2>
      )}
      <Button
        variant="contained"
        color="success"
        onClick={handleEditRelations}
        className="button-save"
      >
        Save
      </Button>
    </div>
  );
};

export default EditRelations;

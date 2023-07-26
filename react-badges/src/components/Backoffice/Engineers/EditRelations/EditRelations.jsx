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
  Select,
  Alert
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const EditRelations = () => {
  const { data: engineersData } = useQuery(LOAD_ENGINEERS);
  const { data: managersData, loading: managerLoading } =
    useQuery(GET_MANAGERS);
  const { id: engineerId } = useParams();
  const { managerId: managerId } = useParams();
  const {
    data: currentManager,
    loading: currentManagerLoading,
    error: errorManagers
  } = useQuery(GET_MANAGERS_WITH_ID, {
    variables: {
      id: parseInt(managerId)
    }
  });
  const [editRelations, { loading, error }] = useMutation(EDIT_RELATIONS, {
    refetchQueries: [
      { query: LOAD_ENGINEERS },
      { query: GET_MANAGERS },
      { query: GET_MANAGERS_WITH_ID, variables: { id: parseInt(managerId) } },
      { query: USER_RELATION, variables: { id: parseInt(engineerId) } }
    ]
  });
  const navigate = useNavigate();
  const [selectedManagerId, setSelectedManagerId] = useState([]);

  const { data: userData, loading: userLoading } = useQuery(USER_RELATION, {
    variables: {
      id: parseInt(engineerId)
    }
  });
  console.log(currentManager);

  if (userLoading || managerLoading || currentManagerLoading || loading) {
    return <p>Loading...</p>;
  }

  if (error || errorManagers) {
    return <p>Error: {error?.message || errorManagers?.message}</p>;
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
    if (filteredManagers.length > 0 && !selectedManagerId) {
      editRelations({
        variables: {
          idE: parseInt(engineerId),
          oldM: parseInt(managerId),
          newM: parseInt(selectedManagerId)
        }
      });
      navigate("/engineers");
    } else {
      navigate("/engineers");
    }
  };

  console.log(selectedManagerId);

  return (
    <div className="edit-relations">
      <h2>Edit Relations</h2>
      <h3>Engineer: {engineer.name}</h3>
      <h3>Current Manager: {currentManager?.managers[0].name}</h3>
      {filteredManagers && filteredManagers.length > 0 ? (
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
        <Alert variant="outlined" severity="info">
          No managers available
        </Alert>
      )}
      <Button
        variant="contained"
        onClick={handleEditRelations}
        className="button-save"
      >
        Save
      </Button>
    </div>
  );
};

export default EditRelations;

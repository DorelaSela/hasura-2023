import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_RELATIONS } from "../../../../containers/state/EngineersQueries";
import { useParams } from "react-router-dom";

const EditRelations = () => {
  const [editRelations, { data, loading, error }] = useMutation(EDIT_RELATIONS);
  const { data: managerData } = useQuery(GET_MANAGERS);
  const { id: engineerId } = useParams();
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [getManagers] = useQuery(GET_MANAGERS_BY_ENGINEER, {
    variables: { engineer_id: parseInt(engineerId) }
  });

  const handleEditRelations = (engineerId, oldManagerId, newManagerId) => {
    editRelations({
      variables: {
        idE: engineerId,
        oldM: oldManagerId,
        newM: newManagerId
      }
    });
  };

  return (
    <div>
      <h2>Edit Relations</h2>
      <h3>Related Manager:</h3>
      <p>{managerData?.get_managers_by_engineer[0]?.name}</p>

      <h3>Choose a new Manager:</h3>
      <select
        value={selectedManagerId}
        onChange={(e) => setSelectedManagerId(e.target.value)}
      >
        {filteredManagers.map((manager) => (
          <option key={manager.id} value={manager.id}>
            {manager.name}
          </option>
        ))}
      </select>

      <Button onClick={handleEditRelations}>Save</Button>
    </div>
  );
};

export default EditRelations;

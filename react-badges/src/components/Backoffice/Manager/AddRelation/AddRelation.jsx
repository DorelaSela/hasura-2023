import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_RELATION,
  GET_ENGINEERS
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
  const r1 = useQuery(GET_ENGINEERS);
  const { id: managerId } = useParams();
  const navigate = useNavigate();

  const handleCheckboxChange = (engineerId) => {
    if (engineerIds.includes(engineerId)) {
      setEngineerIds(engineerIds.filter((id) => id !== engineerId));
    } else {
      setEngineerIds([...engineerIds, engineerId]);
    }
  };

  const handleSubmit = () => {
    if (engineerIds.length > 0) {
      const uniqueEngineerIds = engineerIds.filter(
        (engineerId) =>
          !r1.data?.engineers?.some(
            (engineer) =>
              engineer.id === engineerId &&
              engineer.relations.some((relation) => relation.managerId === id)
          )
      );
      uniqueEngineerIds.forEach((engineerId) => {
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

  if (loading || !r1.data?.engineers) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h4>Engineers</h4>
      {r1.data.engineers.map((record) => (
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

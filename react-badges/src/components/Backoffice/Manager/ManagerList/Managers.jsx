import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  LOAD_MANAGERS,
  DELETE_MANAGER,
  DELETE_RELATION
} from "../../../../containers/state/ManagersQueries";
import { useNavigate } from "react-router-dom";
import TableForm from "../../TableForm";

const Managers = () => {
  const { loading, data, error } = useQuery(LOAD_MANAGERS);
  const [managers, setManagers] = useState([]);
  const [deleteManager] = useMutation(DELETE_MANAGER);
  const [deleteRelations] = useMutation(DELETE_RELATION, {
    refetchQueries: [{ query: LOAD_MANAGERS }]
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setManagers(data.managers);
      console.log(data.managers);
    }
  }, [data]);

  const handleDelete = async (id) => {
    try {
      const { data } = await deleteManager({
        variables: { id }
      });
      setManagers(managers.filter((manager) => manager.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRelation = (idManager, idEngineer) => {
    deleteRelations({
      variables: {
        idM: idManager,
        idE: idEngineer
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/managers/${id}/edit`);
  };

  const handleNavigate = () => {
    navigate("/managers/create");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>Managers List</h2>
      <TableForm
        data={managers}
        onDelete={handleDelete}
        dataType="manager"
        onEdit={handleEdit}
        onDeleteRelation={handleDeleteRelation}
      />
      <button onClick={handleNavigate}>Create Manager</button>
    </div>
  );
};

export default Managers;

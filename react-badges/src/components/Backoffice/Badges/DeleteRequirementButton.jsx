import { Button, Tooltip } from "@mui/material";
import React from "react";
import { useMutation } from "@apollo/client";
import { DELETE_REQUIREMENT, LOAD_BADGES } from "../../../containers/state/BadgesQueries";

const DeleteRequirementButton = ({ requirementId, badgeId, onDelete }) => {
  const [deleteRequirement] = useMutation(DELETE_REQUIREMENT, {
    refetchQueries: [{ query: LOAD_BADGES }]
  });

  const handleDelete = async () => {
    try {
      await deleteRequirement({
        variables: {
          id: parseInt(requirementId),
          badgeId: badgeId
        }
      });
      onDelete();
    } catch (error) {
      console.log("Error deleting requirement:", error);
    }
  };

  return (
    <Tooltip title="Remove Requirement">
      <Button variant="outlined" color="primary" onClick={handleDelete}>
        -
      </Button>
    </Tooltip>
  );
};

export default DeleteRequirementButton;

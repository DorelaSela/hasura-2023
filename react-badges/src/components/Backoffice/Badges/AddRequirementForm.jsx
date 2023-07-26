import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { TextField, Button, Tooltip } from "@mui/material";

const AddRequirementForm = ({ addNewRequirement, control }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddRequirement = () => {
    addNewRequirement(newTitle, newDescription);
    setNewTitle("");
    setNewDescription("");
  };

  return (
    <>
      <Controller
        name="newRequirementTitle"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            label="New Requirement Title"
            multiline
            rows={1}
            {...field}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ marginBottom: "16px", width: "100%" }}
          />
        )}
      />
      <Controller
        name="newRequirementDescription"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            label="New Requirement Description"
            multiline
            rows={2}
            {...field}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            style={{ marginBottom: "16px", width: "100%" }}
          />
        )}
      />
      <Tooltip title="Add Requirement">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddRequirement}
        >
          Add
        </Button>
      </Tooltip>
    </>
  );
};

export default AddRequirementForm;

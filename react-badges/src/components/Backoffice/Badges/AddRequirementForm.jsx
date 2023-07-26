import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Tooltip,
  Card,
  CardContent,
  CardActions
} from "@mui/material";

const AddRequirementForm = ({ addNewRequirement, control }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddRequirement = () => {
    addNewRequirement(newTitle, newDescription);
    setNewTitle("");
    setNewDescription("");
  };

  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      <div
        style={{ marginBottom: "16px", flexBasis: "50%", marginRight: "5px" }}
      >
        <Card variant="outlined" style={{ borderColor: "#333" }}>
          <CardContent>
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
                  style={{ marginBottom: "8px", width: "100%" }}
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
                  style={{ marginBottom: "8px", width: "100%" }}
                />
              )}
            />
          </CardContent>
          <CardActions style={{ justifyContent: "center" }}>
            <Tooltip title="Add Requirement">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddRequirement}
              >
                Add
              </Button>
            </Tooltip>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default AddRequirementForm;

import { Button, TextField, TextareaAutosize, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGES,
  LOAD_REQUIREMENT,
  LOAD_BADGE,
  UPDATE_REQUIREMENTS_MUTATION
} from "../../../containers/state/BadgesQueries";
import { EDIT_BADGE } from "../../../containers/state/BadgesQueries";

const EditStep2 = ({ setCurrentStep, badgeId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const [UpdateRequirements, { loading: editLoading, error: editError }] =
    useMutation(UPDATE_REQUIREMENTS_MUTATION, {
      refetchQueries: [{ query: LOAD_BADGES }]
    });

  const { data, loading } = useQuery(LOAD_BADGE, {
    variables: {
      id: badgeId
    }
  });

  useEffect(() => {
    if (data && data.badges_versions_last) {
      const { description, requirements } = data?.badges_versions_last[0];
      setValue("requirements", requirements);
      setValue("description", description);
      console.log(data);
    }
  }, [data]);

  const secondStepSubmit = async (formData) => {
    try {
      await UpdateRequirements({
        variables: {
          badgeId: badgeId,
          newTitle: formData.newTitle,
          newDescription: formData.newDescription
        }
      });
      console.log(formData);
      setCurrentStep(2);
    } catch (error) {
      console.log("Error updating badge:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(secondStepSubmit)}>
        <TextField
          label="Title"
          name="requirements"
          multiline
          rows={5}
          {...register("requirements", { required: true })}
          style={{ marginBottom: "16px", width: "100%" }}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={1}
          {...register("description", { required: true })}
          style={{ marginBottom: "16px", width: "100%" }}
        />
        <Tooltip title="Submit">
          <Button
            className="button"
            type="submit"
            variant="outlined"
            color="primary"
          >
            Finish
          </Button>
        </Tooltip>
      </form>
    </>
  );
};
export default EditStep2;

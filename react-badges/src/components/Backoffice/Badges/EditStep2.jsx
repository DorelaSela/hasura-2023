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
      const {  description, requirements } =
        data?.badges_versions_last[0];
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
    {data ? (
      <form onSubmit={handleSubmit(secondStepSubmit)}>
        {Object.keys(data?.badges_versions_last[0]?.requirements).map((key, index) => {
          const requirement = data?.badges_versions_last[0]?.requirements[key];
          return (
            <div key={index}>
              <TextField
                label={`Requirement ${index + 1} Title`}
                name={`requirements.${key}.title`}
                multiline
                rows={1}
                defaultValue={requirement.title}
                {...register(`requirements.${key}.title`, { required: true })}
                style={{ marginBottom: "16px", width: "100%" }}
              />
              <TextField
                label={`Requirement ${index + 1} Description`}
                name={`requirements.${key}.description`}
                multiline
                rows={1}
                defaultValue={requirement.description}
                {...register(`requirements.${key}.description`, { required: true })}
                style={{ marginBottom: "16px", width: "100%" }}
              />
            </div>
          );
        })}
        <TextField
          label="Description"
          name="description"
          multiline
          rows={1}
          defaultValue={data?.badges_versions_last[0]?.description}
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
    ) : (
      <p>Loading...</p>
    )}
  </>
  );
};
export default EditStep2;

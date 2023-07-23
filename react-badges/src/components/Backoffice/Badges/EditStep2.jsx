import { Button, TextField, TextareaAutosize, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGES,
  LOAD_BADGE
} from "../../../containers/state/BadgesQueries";
import { EDIT_BADGE } from "../../../containers/state/BadgesQueries";

const EditStep2 = ({ setCurrentStep, badgeId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const [EditBadge, { loading: editLoading, error: editError }] = useMutation(
    EDIT_BADGE,
    {
      refetchQueries: [{ query: LOAD_BADGES }]
    }
  );

  const { data, loading } = useQuery(LOAD_BADGE, {
    variables: {
      id: badgeId
    }
  });

  useEffect(() => {
    if (data && data.badges_versions_last) {
      const { requirements } = data?.badges_versions_last[0];
      setValue("requirements", requirements);
    }
  }, [data]);
  console.log(data);
  if (loading) {
    return <p>Loading...</p>;
  }

  const secondStepSubmit = async (formData) => {
    try {
      await EditBadge({
        variables: {
          requirements: formData.requirements
        }
      });
      console.log(formData);
      setCurrentStep(2);
    } catch (error) {
      console.log("Error updating badge:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(secondStepSubmit)}>
        <TextField
          label="Title"
          name="requirements"
          multiline
          rows={1}
          {...register("requirements", { required: true })}
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

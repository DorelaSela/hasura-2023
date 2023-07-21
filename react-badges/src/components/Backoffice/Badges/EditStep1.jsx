import { Button, TextField, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGES,
  LOAD_BADGE
} from "../../../containers/state/BadgesQueries";
import { EDIT_BADGE } from "../../../containers/state/BadgesQueries";

const EditStep1 = ({ setCurrentStep, badgeId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
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
      const { title, description } = data?.badges_versions_last[0];
      setValue("title", title);
      setValue("description", description);
      console.log(data);
    }
  }, [data]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const firstStepSubmit = async (formData) => {
    try {
      await EditBadge({
        variables: {
          id: 1,
          title: formData.title,
          description: formData.description
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
      <form onSubmit={handleSubmit(firstStepSubmit)}>
        <TextField
          label="Title"
          name="title"
          {...register("title", { required: true })}
        />
        <TextField
          label="Description"
          name="description"
          {...register("description", { required: true })}
        />
        <Tooltip title="Next">
          <Button
            className="button"
            type="submit"
            variant="outlined"
            color="primary"
          >
            Next
          </Button>
        </Tooltip>
      </form>
    </>
  );
};
export default EditStep1;

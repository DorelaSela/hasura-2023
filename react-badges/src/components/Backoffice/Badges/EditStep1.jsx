import { Card, CardContent, Button, Tooltip, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGES,
  LOAD_BADGE,
  EDIT_BADGE
} from "../../../containers/state/BadgesQueries";

const EditStep1 = ({ setCurrentStep, badgeId }) => {
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
      const { title, description } = data?.badges_versions_last[0];
      setValue("title", title);
      setValue("description", description);
      console.log(data);
    }
  }, [data]);

  const firstStepSubmit = async (formData) => {
    try {
      await EditBadge({
        variables: {
          id: badgeId,
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(firstStepSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh"
        }}
      >
        <TextField
          label="Title"
          name="title"
          multiline
          rows={2}
          {...register("title", { required: true })}
          style={{ marginBottom: "16px", width: "50%" }}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={6}
          {...register("description", { required: true })}
          style={{ marginBottom: "16px", width: "50%" }}
        />
        <div style={{ position: "fixed", bottom: "16px", right: "16px" }}>
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
        </div>
      </form>
    </>
  );
};
export default EditStep1;

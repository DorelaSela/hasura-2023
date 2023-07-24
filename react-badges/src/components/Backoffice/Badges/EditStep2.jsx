import { Button, TextField, TextareaAutosize, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGES,
  LOAD_BADGE,
  UPDATE_REQUIREMENTS_MUTATION
} from "../../../containers/state/BadgesQueries";
import { useNavigate } from "react-router-dom";

const EditStep2 = ({ setCurrentStep, badgeId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();

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
      const { title, description, requirements } =
        data?.badges_versions_last[0];
      setValue("title", title);
      setValue("description", description);
      if (requirements) {
        const parsedRequirements = JSON.parse(requirements);
        parsedRequirements.forEach((requirement, index) => {
          setValue(`requirements[${index}].title`, requirement.title);
          setValue(
            `requirements[${index}].description`,
            requirement.description
          );
        });
      }
    }
    // console.log(data?.badges_versions_last[0]?.requirements);
  }, [data]);

  const secondStepSubmit = async (formData) => {
    try {
      // First, update the badge's title and description
      await UpdateRequirements({
        variables: {
          id: badgeId,
          title: formData.title,
          description: formData.description
        }
      });

      // Next, prepare the requirements data for the mutation
      const requirementsData = formData.requirements.map((req) => ({
        id: req.id,
        title: req.title,
        description: req.description
      }));

      // Finally, update the requirements with the new data
      await UpdateRequirements({
        variables: {
          badgeId: badgeId,
          requirements: requirementsData
        }
      });

      console.log("Badge and Requirements updated:", formData);
      setCurrentStep(2);
      navigate("/badges");
    } catch (error) {
      console.log("Error updating badge and requirements:", error);
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
          name="title"
          multiline
          rows={1}
          {...register("title", { required: true })}
          style={{ marginBottom: "16px", width: "100%" }}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={5}
          {...register("description", { required: true })}
          style={{ marginBottom: "16px", width: "100%" }}
        />
        {/* Render the input fields for requirements */}
        {watch("requirements", []).map((req, index) => (
          <React.Fragment key={index}>
            <TextField
              label={`Requirement ${index + 1} Title`}
              name={`requirements[${index}].title`}
              multiline
              rows={1}
              {...register(`requirements[${index}].title`, { required: true })}
              style={{ marginBottom: "16px", width: "100%" }}
            />
            <TextField
              label={`Requirement ${index + 1} Description`}
              name={`requirements[${index}].description`}
              multiline
              rows={1}
              {...register(`requirements[${index}].description`, {
                required: true
              })}
              style={{ marginBottom: "16px", width: "100%" }}
            />
          </React.Fragment>
        ))}
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

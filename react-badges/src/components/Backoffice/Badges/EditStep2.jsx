import {
  Button,
  TextField,
  Tooltip,
  Grid,
  Box,
  Typography,
  Fab
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGE,
  UPDATE_REQUIREMENTS_MUTATION,
  LOAD_REQUIREMENT_ID,
  LOAD_BADGES,
  DELETE_REQUIREMENT,
  INSERT_REQUIREMENT_MUTATION
} from "../../../containers/state/BadgesQueries";
import { useNavigate } from "react-router-dom";

const EditStep2 = ({ setCurrentStep, badgeId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    control
  } = useForm();
  const navigate = useNavigate();

  const [requirementId, setRequirementId] = useState([]);

  const [updateRequirements] = useMutation(UPDATE_REQUIREMENTS_MUTATION, {
    refetchQueries: [{ query: LOAD_BADGES }]
  });

  const [insertRequirement] = useMutation(INSERT_REQUIREMENT_MUTATION, {
    refetchQueries: [{ query: LOAD_BADGES }]
  });

  const [deleteRequirements] = useMutation(DELETE_REQUIREMENT, {
    refetchQueries: [{ query: LOAD_BADGES }]
  });

  const { data: reqData, loading: reqLoading } = useQuery(LOAD_REQUIREMENT_ID, {
    variables: {
      badge_id: badgeId
    }
  });

  const { data, loading } = useQuery(LOAD_BADGE, {
    variables: {
      id: badgeId
    }
  });

  const createRequirement = async (formData) => {
    const { description, title } = formData;
    try {
      await insertRequirement({
        variables: {
          badgeId: badgeId,
          title: title,
          description: description
        }
      });

      console.log("Requirement created:", { title, description });
    } catch (error) {
      console.log("Error creating requirement:", error);
    }
  };

  const deleteReq = (id) => {
    deleteRequirements({
      variables: {
        id
      }
    });
  };

  const { fields, remove, append } = useFieldArray({
    control,
    name: "requirements"
  });

  useEffect(() => {
    append({});
  }, [append]);

  useEffect(() => {
    if (reqData && reqData.requirements_definitions) {
      const ids = reqData.requirements_definitions.map((req) => req.id);
      setRequirementId(ids);
    }
  }, [reqData]);

  useEffect(() => {
    if (data && data.badges_versions_last) {
      const { requirements } = data.badges_versions_last[0];
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
  }, [data]);

  const secondStepSubmit = async (formData) => {
    try {
      requirementId.forEach(async (id, index) => {
        const description = formData.requirements[index].description;
        const title = formData.requirements[index].title;

        await updateRequirements({
          variables: {
            id: id,
            description: description,
            title: title
          }
        });
      });
      console.log(formData.requirements[0].title);
      console.log("Badge and Requirements updated:", formData);
      setCurrentStep(2);
      navigate("/badges");
    } catch (error) {
      console.log("Error updating badge and requirements:", error);
    }
  };

  if (loading || reqLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(secondStepSubmit)}>
        {fields.map((req, index) => (
          <Box key={req.id} mb={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  label={`Requirement ${index + 1} Title`}
                  name={`requirements[${index}].title`}
                  multiline
                  rows={1}
                  {...register(`requirements[${index}].title`, {
                    required: true
                  })}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label={`Requirement ${index + 1} Description`}
                  name={`requirements[${index}].description`}
                  multiline
                  rows={2}
                  {...register(`requirements[${index}].description`, {
                    required: true
                  })}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2} sm={1}>
                <Tooltip title="Remove Requirement">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      deleteReq(getValues(`requirements[${index}].id`));
                      remove(index);
                    }}
                    style={{ width: "100%" }}
                  >
                    Remove
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box mt={2}>
          <Typography
            variant="h4"
            sx={{
              margin: "auto",
              marginTop: "-10px",
              width: "fit-content",
              cursor: "pointer"
            }}
            onClick={() => append({ title: "", description: "" })}
          >
            <Fab
              color="primary"
              aria-label="add"
              style={{
                position: "fixed",
                bottom: "16px",
                right: "16px"
              }}
            >
              <h1>+</h1>
            </Fab>
          </Typography>
        </Box>
        <Box mt={2}>
          <Grid container justifyContent="center">
            <Tooltip title="Submit">
              <Button
                className="button"
                type="submit"
                variant="outlined"
                color="primary"
              >
                Submit
              </Button>
            </Tooltip>
          </Grid>
        </Box>
      </form>
    </>
  );
};
export default EditStep2;

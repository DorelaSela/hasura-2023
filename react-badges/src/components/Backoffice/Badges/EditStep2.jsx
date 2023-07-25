import { Button, TextField, Tooltip, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGE,
  UPDATE_REQUIREMENTS_MUTATION,
  LOAD_REQUIREMENT_ID,
  LOAD_BADGES,
  DELETE_REQUIREMENT
} from "../../../containers/state/BadgesQueries";
import { useNavigate } from "react-router-dom";
import { getVariableValues } from "graphql";

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

  const [UpdateRequirements] = useMutation(UPDATE_REQUIREMENTS_MUTATION, {
    refetchQueries: [{ query: LOAD_BADGES }]
  });
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (reqData && reqData.requirements_definitions) {
      const ids = reqData?.requirements_definitions?.map((req) => req.id);
      setRequirementId(ids);
    }
  }, [reqData?.requirements_definitions]);

  console.log(requirementId);

  const { fields, remove, append } = useFieldArray({
    control, // Replace "control" with your actual form control object
    name: "requirements"
  });

  useEffect(() => {
    if (data && data.badges_versions_last) {
      const { requirements } = data?.badges_versions_last[0];
      if (requirements) {
        const parsedRequirements = JSON.parse(requirements);
        parsedRequirements.forEach((requirement, index) => {
          setValue(`requirements[${index}].title`, requirement?.title);
          setValue(
            `requirements[${index}].description`,
            requirement?.description
          );
        });
      }
    }
  }, []);

  const deleteReq = (id) => {
    deleteRequirements({
      variables: {
        id
      }
    });
  };

  const secondStepSubmit = async (formData) => {
    try {
      setIsLoading(true);

      for (let index = 0; index < requirementId.length; index++) {
        const id = requirementId[index];
        const newDescription = formData.requirements[index].description;
        const newTitle = formData.requirements[index].title;

        // Simulate a delay based on the index (500ms for the first item, 1000ms for the second, 1500ms for the third, and so on...)
        await new Promise((resolve) => setTimeout(resolve, (index + 1) * 1));

        await UpdateRequirements({
          variables: {
            id: id,
            badgeId: badgeId,
            newDescription: newDescription,
            newTitle: newTitle
          }
        });

        console.log(`Requirement with id ${id} updated.`);
      }

      console.log("Badge and Requirements updated:", formData);
      setTimeout(() => {
        setCurrentStep(2);
        navigate("/badges");
      }, 600);
    } catch (error) {
      console.log("Error updating badge and requirements:", error);
    }
  };

  useEffect(() => {
    append({});
  }, [append]);

  if (loading || reqLoading) {
    return <p>Loading...</p>;
  }
  console.log(fields);
  return (
    <>
      <form onSubmit={handleSubmit(secondStepSubmit)}>
        {fields.map((req, index) => {
          if (index < fields.length - 1) {
            return (
              <React.Fragment key={req.id}>
                <TextField
                  label={`Requirement ${index + 1} Title`}
                  name={`requirements[${index}].title`}
                  multiline
                  rows={1}
                  {...register(`requirements[${index}].title`, {
                    required: true
                  })}
                  style={{ marginBottom: "16px", width: "100%" }}
                />
                <TextField
                  label={`Requirement ${index + 1} Description`}
                  name={`requirements[${index}].description`}
                  multiline
                  rows={2}
                  {...register(`requirements[${index}].description`, {
                    required: true
                  })}
                  style={{ marginBottom: "16px", width: "100%" }}
                />
                <Tooltip title="Remove Requirement">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      remove(index);
                      deleteReq(req.id);
                    }}
                  >
                    -
                  </Button>
                </Tooltip>
              </React.Fragment>
            );
          }
          return null;
        })}
        <Tooltip title="Add Requirement" onClick={() => append({})}>
          <Button variant="outlined" color="primary">
            Add Requirement
          </Button>
        </Tooltip>
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
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px"
          }}
        >
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default EditStep2;

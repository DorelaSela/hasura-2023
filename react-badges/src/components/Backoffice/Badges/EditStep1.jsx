import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Step,
  StepLabel,
  Stepper,
  Tooltip
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EditStep1 = ({ setCurrentStep, badges }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (badges) {
      setTitle(badges.title);
      setDescription(badges.description);
    }
  }, [badges]);

  const firstStepSubmit = (data) => {
    setCurrentStep(2);
    // submitData(data, currentStep);
  };

  return (
    <>
      <form onSubmit={handleSubmit(firstStepSubmit)}>
        <TextField
          label="Title"
          name="title"
          defaultValue={title}
          {...register("title", { required: true })}
        />
        <TextField
          label="Description"
          name="description"
          defaultValue={description}
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

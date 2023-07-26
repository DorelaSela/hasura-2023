import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  CREATE_BADGE_MUTATION,
  LOAD_BADGES,
  CREATE_BADGE_VERSION
} from "../../../containers/state/BadgesQueries";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const CreateBadge = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const [insert_badges_definitions, { loading, error, data }] = useMutation(
    CREATE_BADGE_MUTATION,
    { refetchQueries: [{ query: LOAD_BADGES }] }
  );
  const [create_badge_version] = useMutation(CREATE_BADGE_VERSION, {
    refetchQueries: [{ query: LOAD_BADGES }]
  });

  useEffect(() => {
    if (data) {
      create_badge_version({
        variables: {
          id: data?.insert_badges_definitions?.returning[0]?.id
        }
      });
      navigate("/badges");
    }
  }, [data]);

  const onSubmit = (formData) => {
    const { title, description, requirementTitle, requirementDescription } =
      formData;
    insert_badges_definitions({
      variables: {
        title: title,
        description: description,
        requirementTitle: requirementTitle,
        requirementDescription: requirementDescription
      }
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh" // Adjust the height as needed
      >
        <Card
          sx={{
            padding: "16px",
            marginBottom: "16px",
            width: "50%"
          }}
        >
          <CardContent>
            <Typography sx={{ marginBottom: "8px" }} variant="h1">
              Create Badge
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  justifyContent: "space-evenly"
                }}
              >
                <TextField
                  label="Title"
                  name="title"
                  {...register("title", {
                    required: "Title is required"
                  })}
                  sx={{ marginBottom: "8px" }}
                />
                {errors.title && (
                  <Typography variant="body2" color="error">
                    {errors.title.message}
                  </Typography>
                )}
                <TextField
                  label="Description"
                  name="description"
                  {...register("description", {
                    required: "Description is required"
                  })}
                  sx={{ marginBottom: "8px" }}
                />
                {errors.description && (
                  <Typography variant="body2" color="error">
                    {errors.description.message}
                  </Typography>
                )}
                <TextField
                  label="Requirement Title"
                  name="requirementTitle"
                  {...register("requirementTitle", {
                    required: "Requirement Title is required"
                  })}
                  sx={{ marginBottom: "8px" }}
                />
                {errors.requirementTitle && (
                  <Typography variant="body2" color="error">
                    {errors.requirementTitle.message}
                  </Typography>
                )}
                <TextField
                  label="Requirement Description"
                  name="requirementDescription"
                  {...register("requirementDescription", {
                    required: "Requirement Description is required"
                  })}
                  sx={{ marginBottom: "8px" }}
                />
                {errors.requirementDescription && (
                  <Typography variant="body2" color="error">
                    {errors.requirementDescription.message}
                  </Typography>
                )}
                <Box display="flex" justifyContent="center">
                  {" "}
                  {/* Center the button */}
                  <Button type="submit">Add</Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default CreateBadge;

import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Card sx={{ padding: "16px", marginBottom: "16px", margin: "16px" }}>
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
                required: true
              })}
              sx={{ marginBottom: "8px" }}
            />
            <TextField
              label="Description"
              name="description"
              {...register("description", {
                required: true
              })}
              sx={{ marginBottom: "8px" }}
            />
            <TextField
              label="Requirement Title"
              name="requirementTitle"
              {...register("requirementTitle", {
                required: true
              })}
              sx={{ marginBottom: "8px" }}
            />
            <TextField
              label="Requirement Title"
              name="requirementDescription"
              {...register("requirementDescription", {
                required: true
              })}
              sx={{ marginBottom: "8px" }}
            />
            <Box>
              <Button type="submit">Add</Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateBadge;

import { InputLabel, TextField } from "@mui/material";
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
  const [create_badges_version] = useMutation(CREATE_BADGE_VERSION, {
    refetchQueries: [{ query: LOAD_BADGES }]
  });

  useEffect(() => {
    if (data) {
      create_badges_version({
        variables: {
          id: data?.insert_badges_definitions?.returning[0]?.id
        }
      });
      navigate("/badges");
    }
  }, [data]);

  const onSubmit = (formData) => {
    const { title, description, id } = formData;
    insert_badges_definitions({
      variables: {
        title: title,
        description: description
      }
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  // console.log("dataaaaaa", data);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextField
            label="Title"
            name="title"
            {...register("title", {
              required: true
            })}
          />
          <TextField
            label="Description"
            name="description"
            {...register("description", {
              required: true
            })}
          />

          <button type="submit">Add</button>
        </div>
      </form>
    </>
  );
};
export default CreateBadge;

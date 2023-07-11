import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { LOAD_ENGINEERS } from "../GraphQl/Queries";
import { CREATE_ENGINEERS_MUTATION } from "../GraphQl/Mutations";
import { useMutation } from "@apollo/client";

const Engineers = () => {
  const { loading, data } = useQuery(LOAD_ENGINEERS);
  const [engineers, setEngineers] = useState([]);
  const [name, setName] = useState("");
  const [insert_engineers, { error }] = useMutation(CREATE_ENGINEERS_MUTATION);

  // const addEngineers = () => {
  //   insert_engineers({
  //     variables: {
  //       name: name
  //     }
  //   });
  // };

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (data) {
      setEngineers(data.engineers);
    }
  }, [data]);

  return (
    <div>
      {engineers.map((engineer, index) => {
        return <h3 key={index}>{engineer.name}</h3>;
      })}
      {/* <button onClick={addEngineers}>Create New</button> */}
    </div>
  );
};

export default Engineers;

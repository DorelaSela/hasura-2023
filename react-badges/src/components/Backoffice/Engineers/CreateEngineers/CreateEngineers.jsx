import React, { useState } from "react";

const CreateEngineers = () => {
  const [name, setName] = useState("");

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </form>
    </div>
  );
};

export default CreateEngineers;

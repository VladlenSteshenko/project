import React from "react";
import { useSelector } from "react-redux";

const StoredDataDisplay = () => {
  const authData = useSelector((state) => state.auth);

  return (
    <div>
      <h2>Stored Data</h2>
      <pre>{JSON.stringify(authData, null, 2)}</pre>
    </div>
  );
};

export default StoredDataDisplay;

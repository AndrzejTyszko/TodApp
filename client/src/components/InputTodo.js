import React, { Fragment, useState } from "react";

const InputTodo = () => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (description.trim() === "") {
      setError("Task description cannot be empty");
      return;
    }
    try {
      const body = { description };
      await fetch("http://localhost:5001/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          placeholder="Submit your reminder"
          value={description}
          onChange={e => {
            setDescription(e.target.value);
            setError(""); // Reset error message on input change
          }}
        />
        <button className="btn btn-success" type="submit">Add</button>
      </form>
      {error && <div className="text-danger mt-2">{error}</div>}
    </Fragment>
  );
};

export default InputTodo;
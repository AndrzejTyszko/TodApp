import React, { Fragment, useState } from "react";

const EditTodo = ({ todo }) => {
  const [description, setDescription] = useState(todo.description);
  const [error, setError] = useState("");

  const updateDescription = async (e) => {
    e.preventDefault();
    if (description.trim() === "") {
      setError("Description cannot be empty");
      return;
    }
    try {
      const body = { description };
      await fetch(
        `http://localhost:5001/todos/${todo.todo_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${todo.todo_id}`}
      >
        Edit
      </button>

      <div
        className="modal"
        id={`id${todo.todo_id}`}
        onClick={() => {
          setDescription(todo.description);
          setError(""); // Reset error message when modal is opened
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Todo</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => setDescription(todo.description)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  setError("Task description cannot be empty"); // Reset error message on input change
                }}
              />
              {error && <div className="text-danger mt-2">{error}</div>}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                onClick={e => updateDescription(e)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => setDescription(todo.description)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditTodo;
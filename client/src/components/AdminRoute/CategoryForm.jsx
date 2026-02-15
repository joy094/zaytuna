//src/components/AdminRoute/CategoryForm.jsx


import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="enter new category"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className="btn-primary">submit</button>
      </form>
    </div>
  );
};

export default CategoryForm;

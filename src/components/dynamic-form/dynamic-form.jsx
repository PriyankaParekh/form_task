import React from "react";

const DynamicForm = ({ field, data, handleInputChange, err, setData }) => {
  return (
    <div key={field.name} className="mb-4">
    {field?.field_type === "textarea" ? (
      <>
        <label
          htmlFor={field?.name}
          className="label flex flex-col text-gray-500 font-medium text-lg mb-2"
        >
          {field?.label}
        </label>
        <textarea
          id={field?.name}
          name={field?.name}
          rows={4}
          className="border uppercase rounded w-full py-2 px-3 text-gray-700"
          placeholder={field?.placeholder}
          value={data[field?.name]}
            onChange={(e) => handleInputChange(field?.name, e.target.value)}
          />
          {err[field?.name] && (
            <p className="text-red-500 text-sm">Invalid input</p>
          )}
        </>
      ) : field?.field_type === "select" ? (
        <>
          <label
            htmlFor={field?.name}
            className="label flex flex-col text-gray-500 font-medium text-lg mb-2"
          >
          {field?.label}
        </label>
        <select
          id={field?.name}
          name={field?.name}
          value={data[field?.name]}
          onChange={(e) =>
            setData((prevData) => ({
              ...prevData,
              [field?.name]: e.target.value,
            }))
          }
          className="label border uppercase rounded w-full py-3 px-2 text-gray-700 bg-white"
        >
            <option value="">Select</option>
          {field?.options?.map((option, optionIndex) => (
            <option key={optionIndex} value={option}>
              {option}
            </option>
          ))}
        </select>
        {err[field?.name] && (
          <p className="text-red-500 text-sm">This is Required field.. Please select anyone</p>
        )}
      </>
    ) : field?.field_type === "checkbox" ? (
      <div className="">
        <label
          htmlFor={field?.name}
          className="label flex flex-col text-gray-500 font-medium text-lg mb-2"
        >
          {field?.label}
        </label>
        <div className="flex flex-wrap">
          {field?.options && field?.options?.length !== 0 ? (
            field?.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2 mr-4">
                <input
                  className="mr-2 uppercase ms-5"
                  type="checkbox"
                  id={`${field?.name}-${optionIndex}`}
                  name={field?.name}
                  value={option}
                  checked={data[field?.name]?.includes(option)}
                  onChange={(e) =>
                    setData((prevData) => {
                      const isChecked = e.target.checked;
                      const currentValue = prevData[field?.name] || [];

                      const updatedValue = isChecked
                        ? [...currentValue, option]
                        : currentValue.filter((item) => item !== option);

                      return {
                        ...prevData,
                        [field?.name]: updatedValue,
                      };
                    })
                  }
                />
                <label
                  className="text-lg text-gray-700"
                  htmlFor={`${field?.name}-${optionIndex}`}
                >
                  {option}
                </label>
                {err[field?.name] && (
                  <p className="text-red-500 text-sm">This is Required field.. Please select anyone</p>
                )}
              </div>
            ))
          ) : (
            <div className="mb-2 mr-4">
              <input
                type="checkbox"
                className="mr-3 ms-4 uppercase"
                id={field?.name}
                name={field?.name}
                checked={data[field?.name] || false}
                onChange={(e) =>
                  handleInputChange(field?.name, e.target.value)
                }
              />
              {err[field?.name] && (
                <p className="text-red-500 text-sm">This is Required field.. Please select checkbox</p>
              )}
            </div>
          )}
        </div>
      </div>
    ) : field?.field_type === "radio" ? (
      <div className="flex flex-wrap">
        <label
          htmlFor={field?.name}
          className="label flex flex-col text-gray-500 font-medium text-lg mb-2"
        >
          {field?.label}
        </label>
        {field?.options?.map((option, optionIndex) => (
          <div key={optionIndex} className="mb-2">
            <input
              className="mr-2 ms-5 uppercase"
              type="radio"
              id={`${field?.name}-${optionIndex}`}
              name={field?.name}
              value={option}
              checked={data[field?.name] === option}
              onChange={(e) =>
                handleInputChange(field?.name, e.target.value)
              }
            />
            <label
              className="text-lg text-gray-700"
              htmlFor={`${field?.name}-${optionIndex}`}
            >
              {option}
            </label>
          </div>
        ))}
        {err[field?.name] && (
          <p className="text-red-500 text-sm">This is Required field. Please select anyone</p>
        )}
      </div>
    ) : (
      <>
        <label
          htmlFor={field?.name}
          className="label flex flex-col text-gray-500 font-medium text-lg mb-2"
        >
          {field?.label}
        </label>
        <input
          type={field?.field_type}
          id={field?.name}
          name={field?.name}
          placeholder={field?.placeholder}
          className="label uppercase border rounded w-full py-2 px-3 mb-3 text-gray-700"
          value={data[field?.name]}
          onChange={(e) => handleInputChange(field?.name, e.target.value)}
        />
        {err[field?.name] && (
          <p className="text-red-500 text-sm">Invalid input</p>
        )}
      </>
    )}
  </div>
  );
};

export default DynamicForm;

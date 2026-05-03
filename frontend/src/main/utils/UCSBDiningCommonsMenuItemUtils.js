import { toast } from "react-toastify";

const cellToAxiosParamsDelete = (cell) => {
  return {
    url: "/api/UCSBDiningCommonsMenuItem",
    method: "DELETE",
    params: {
      id: cell.row.original.id,
    },
  };
};

const onDeleteSuccess = (response) => {
  console.log(response);
  toast(response.message);
};

export { cellToAxiosParamsDelete, onDeleteSuccess };

import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBDiningCommonsMenuItemUtils";
import { toast } from "react-toastify";
import { vi } from "vitest";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

describe("UCSBDiningCommonsMenuItemUtils", () => {
  test("cellToAxiosParamsDelete", () => {
    const cell = { row: { original: { id: 1 } } };

    expect(cellToAxiosParamsDelete(cell)).toEqual({
      url: "/api/UCSBDiningCommonsMenuItem",
      method: "DELETE",
      params: {
        id: 1,
      },
    });
  });

  test("onDeleteSuccess", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    onDeleteSuccess({ message: "Menu Item deleted" });

    expect(consoleSpy).toHaveBeenCalledWith({ message: "Menu Item deleted" });
    expect(toast).toHaveBeenCalledWith("Menu Item deleted");

    consoleSpy.mockRestore();
  });
});

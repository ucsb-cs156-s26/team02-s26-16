import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/recommendationRequestUtils";
import { toast } from "react-toastify";
import { vi } from "vitest";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

describe("recommendationRequestUtils", () => {
  test("cellToAxiosParamsDelete", () => {
    const cell = { row: { original: { id: 2 } } };
    expect(cellToAxiosParamsDelete(cell)).toEqual({
      url: "/api/recommendationrequests",
      method: "DELETE",
      params: {
        id: 2,
      },
    });
  });

  test("onDeleteSuccess", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    onDeleteSuccess({ message: "Recommendation request deleted" });
    expect(consoleSpy).toHaveBeenCalledWith({ message: "Recommendation request deleted" });
    expect(toast).toHaveBeenCalledWith("Recommendation request deleted");
    consoleSpy.mockRestore();
  });
});

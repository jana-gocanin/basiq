import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import ProgressIndicator from "../components/ProgressIndicator";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("ProgressIndicator", () => {
  it("renders steps", () => {
    useSelector.mockReturnValue({
      transaction: {
        currentStep: "verifying",
      },
      error: null,
    });

    render(<ProgressIndicator />);

    const stepElements = screen.getAllByTestId("step");
    expect(stepElements).toHaveLength(4);
    expect(stepElements[0]).toHaveTextContent("waiting for a user");
    expect(stepElements[1]).toHaveTextContent("verifying");
    expect(stepElements[2]).toHaveTextContent("fetching data");
    expect(stepElements[3]).toHaveTextContent("done");
  });
});

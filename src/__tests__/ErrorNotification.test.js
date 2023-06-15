import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import ErrorNotification from "../components/ErrorNotification";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("ErrorNotification", () => {
  test("renders error message", () => {
    const errorMessage = "Something went wrong";
    useSelector.mockReturnValue(errorMessage);

    render(<ErrorNotification />);

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });
});

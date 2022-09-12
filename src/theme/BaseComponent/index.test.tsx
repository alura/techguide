import React from "react";
import { render } from "@src/infra/tests/react-testing-library";
import BaseComponent from "./index";

describe("<BaseComponent />", () => {
  it("renders as expected", () => {
    const { container } = render(<BaseComponent />);
    expect(container).toMatchSnapshot();
  });
});

import React from "react";

import { rest } from "msw";
import { Provider } from "react-redux";
import InboxScreen from "./InboxScreen";
import { MockedState } from "../TaskList/TaskList.stories";
import store from "../../lib/store";
import {
  fireEvent,
  within,
  waitFor,
  waitForElementToBeRemoved,
} from "@storybook/testing-library";

export default {
  component: InboxScreen,
  title: "InboxScreen",
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get(
        "https://jsonplaceholder.typicode.com/todos?userId=1",
        (req, res, ctx) => {
          return res(ctx.json(MockedState.tasks));
        }
      ),
    ],
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Waits for the component to transition from the loading state
  await waitForElementToBeRemoved(await canvas.findByTestId("loading"));
  // Waits for the component to be updated based on the store
  await waitFor(async () => {
    // Simulates pinning the first task
    await fireEvent.click(canvas.getByLabelText("pinTask-1"));
    // Simulates pinning the third task
    await fireEvent.click(canvas.getByLabelText("pinTask-3"));
  });
};

export const Error = Template.bind({});
Error.parameters = {
  msw: {
    handlers: [
      rest.get(
        "https://jsonplaceholder.typicode.com/todos?userId=1",
        (req, res, ctx) => {
          return res(ctx.status(403));
        }
      ),
    ],
  },
};

Error.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Waits for the component to transition from the loading state
  await canvas.findByTestId("error");
  // Waits for the component to be updated based on the store
  //   await waitFor(async () => {
  //     // Simulates pinning the first task
  //     await fireEvent.click(canvas.getByLabelText("pinTask-1"));
  //     // Simulates pinning the third task
  //     await fireEvent.click(canvas.getByLabelText("pinTask-3"));
  //   });
};

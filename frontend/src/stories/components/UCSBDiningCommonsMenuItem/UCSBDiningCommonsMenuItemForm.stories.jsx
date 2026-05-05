import React from "react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";

export default {
  title: "components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm",
  component: UCSBDiningCommonsMenuItemForm,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: ucsbDiningCommonsMenuItemFixtures.oneMenuItem,
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
  },
  buttonLabel: "Update",
};

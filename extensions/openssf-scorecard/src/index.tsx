import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { useState } from "react";

type Values = {
  organization: string;
  repository: string;
};

export default function Command() {
  const [organizationError, setOrganizationError] = useState<string | undefined>();
  const [repositoryError, setRepositoryError] = useState<string | undefined>();

  function dropOrganizationErrorIfNeeded() {
    if (organizationError && organizationError.length > 0) {
      setOrganizationError(undefined);
    }
  }

  function dropRepositoryErrorIfNeeded() {
    if (repositoryError && repositoryError.length > 0) {
      setRepositoryError(undefined);
    }
  }

  const { handleSubmit } = useForm<Values>({
    onSubmit(values) {
      console.log(values);

      if (values.organization.length === 0) {
        setOrganizationError("The field should't be empty!");
      } else {
        dropOrganizationErrorIfNeeded();
      }

      if (values.repository.length === 0) {
        setRepositoryError("The field should't be empty!");
      } else {
        dropRepositoryErrorIfNeeded();
      }

      if (values.repository && values.organization) {
        showToast({
          style: Toast.Style.Success,
          title: "Submitted!",
          message: `${values.organization}/${values.repository} requested`,
        });
      }
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Enter project details:" />
      <Form.TextField
        id="organization"
        title="Organization name"
        placeholder="Enter org/user name"
        defaultValue="Raycast"
        error={organizationError}
        onChange={dropOrganizationErrorIfNeeded}
      />
      <Form.TextField
        id="repository"
        title="Repository name"
        placeholder="Enter repo name"
        defaultValue="Extensions"
        error={repositoryError}
        onChange={dropRepositoryErrorIfNeeded}
      />
    </Form>
    // <Form
    //   actions={
    //     <ActionPanel>
    //       <Action.SubmitForm onSubmit={handleSubmit} />
    //     </ActionPanel>
    //   }
    // >
    //   <Form.Description text="This form showcases all available form elements." />
    //   <Form.TextField id="textfield" title="Text field" placeholder="Enter text" defaultValue="Raycast" />
    //   <Form.TextArea id="textarea" title="Text area" placeholder="Enter multi-line text" />
    //   <Form.Separator />
    //   <Form.DatePicker id="datepicker" title="Date picker" />
    //   <Form.Checkbox id="checkbox" title="Checkbox" label="Checkbox Label" storeValue />
    //   <Form.Dropdown id="dropdown" title="Dropdown">
    //     <Form.Dropdown.Item value="dropdown-item" title="Dropdown Item" />
    //   </Form.Dropdown>
    //   <Form.TagPicker id="tokeneditor" title="Tag picker">
    //     <Form.TagPicker.Item value="tagpicker-item" title="Tag Picker Item" />
    //   </Form.TagPicker>
    // </Form>
  );
}

// function handleSubmit(values: Values) {
//   console.log(values);
//   showToast({ title: "Submitted form", message: "See logs for submitted values" });
// }

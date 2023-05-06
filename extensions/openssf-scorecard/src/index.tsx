import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { useState } from "react";
import got from "got";

type Values = {
  organization: string;
  repository: string;
};

interface DataTypes {
  score: number;
}

export default function Command() {
  const [organizationError, setOrganizationError] = useState<string | undefined>();
  const [repositoryError, setRepositoryError] = useState<string | undefined>();

  function dropOrganizationError() {
    if (organizationError && organizationError.length > 0) {
      setOrganizationError(undefined);
    }
  }

  function dropRepositoryError() {
    if (repositoryError && repositoryError.length > 0) {
      setRepositoryError(undefined);
    }
  }

  const fetchScorecardData = async (values: { organization: string; repository: string }) => {
    try {
      const data = (await got(
        `https://api.securityscorecards.dev/projects/github.com/${values.organization}/${values.repository}`
      ).json()) as DataTypes;

      showToast({
        style: Toast.Style.Success,
        title: `Current score: ${data.score}/10`,
        message: `Check the full report at https://kooltheba.github.io/openssf-scorecard-api-visualizer/#/projects/github.com/${values.organization}/${values.repository}`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Error getting the score 🤨",
        message: String(error),
      });
    }
  };

  const { handleSubmit } = useForm<Values>({
    async onSubmit(values) {
      if (values.organization.length === 0) {
        setOrganizationError("The field should't be empty!");
      } else {
        dropOrganizationError();
      }

      if (values.repository.length === 0) {
        setRepositoryError("The field should't be empty!");
      } else {
        dropRepositoryError();
      }

      if (values.repository && values.organization) {
        await fetchScorecardData(values);
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
      <Form.Description text="Enter project details as read in GitHub:" />
      <Form.TextField
        id="organization"
        title="Organization name"
        placeholder="Enter org/user name"
        defaultValue="nodejs"
        error={organizationError}
        onChange={dropOrganizationError}
      />
      <Form.TextField
        id="repository"
        title="Repository name"
        placeholder="Enter repo name"
        defaultValue="node"
        error={repositoryError}
        onChange={dropRepositoryError}
      />
    </Form>
  );
}

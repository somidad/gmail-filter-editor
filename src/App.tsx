import { useEffect, useState } from "react";
import { apiKey, client_id } from "./credentials";
import { Filter } from "./lib/filter";
import { FilterAddModModal } from "./FilterAddModModal";
import { ActionDescription, ParsedAction, parseAction } from "./lib/actions";
import {
  CriteriaDescription,
  ParsedCriteria,
  parseCriteria,
} from "./lib/criteria";
import { CATEGORY_LABELS, Label } from "./lib/labels";
import { HelpModal } from "./HelpModal";

function App() {
  const [helpOpened, openHelp] = useState(false);
  const [client, setClient] = useState<any>();
  const [authed, setAuthed] = useState(false);
  const [customLabels, setCustomLabels] = useState<Label[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [modalOpened, openModal] = useState(false);

  async function initGoogleApiClient() {
    await gapi.client.init({
      apiKey,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
      ],
    });
  }

  function signIn() {
    if (!client) {
      return;
    }
    if (!gapi.client.getToken()) {
      client.requestAccessToken({ prompt: "consent" });
    } else {
      client.requestAccessToken({ prompt: "" });
    }
  }

  function signOut() {
    const token = gapi.client.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token, () => {});
      gapi.client.setToken(null);
    }
    setAuthed(false);
  }

  function getLabelList() {
    (gapi.client as any).gmail.users.labels
      .list({
        userId: "me",
      })
      .then((response: any) => {
        if (!response.result) {
          throw Error("response.result does not exist");
        }
        const labels = response.result.labels as Label[];
        const customLabels = labels
          .filter(({ id, name }) => id !== name)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (!labels) {
          throw Error("response.result.labels does not exist");
        }
        setCustomLabels(customLabels);
      });
  }

  function getFilterList() {
    (gapi.client as any).gmail.users.settings.filters
      .list({
        userId: "me",
      })
      .then((response: any) => {
        if (!response.result) {
          throw Error("response.result does not exists");
        }
        const filters = response.result.filter as Filter[];
        if (!filters) {
          throw Error("response.result.filter does not exist");
        }
        setFilters(filters);
      })
      .catch((reason: any) => {
        console.error(reason);
      });
  }

  function refresh() {
    getLabelList();
    getFilterList();
  }

  function addFilter() {
    openModal(true);
  }

  function requestToAddFilter(filter: Omit<Filter, "id">) {
    (gapi.client as any).gmail.users.settings.filters
      .create({
        userId: "me",
        ...filter,
      })
      .then((_response: unknown) => {
        openModal(false);
        refresh();
      })
      .catch((reason: unknown) => {
        console.error(reason);
      });
  }

  function deleteFilter(id: string) {
    (gapi.client as any).gmail.users.settings.filters
      .delete({
        userId: "me",
        id,
      })
      .then(() => {
        refresh();
      })
      .catch((reason: any) => {
        console.error(reason);
      });
  }

  useEffect(() => {
    gapi.load("client", initGoogleApiClient);
    const client = google.accounts.oauth2.initTokenClient({
      client_id,
      scope: [
        "https://www.googleapis.com/auth/gmail.settings.basic",
        "https://www.googleapis.com/auth/gmail.labels",
      ].join(" "),
      callback: (resp: any) => {
        if (resp.error) {
          throw resp;
        }
        setAuthed(true);
        refresh();
      },
    });
    setClient(client);
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Gmail Filter Editor</h2>
        <div style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
          <a href="#" onClick={() => openHelp(true)}>
            Help
          </a>
          {authed ? (
            <a href="#" onClick={signOut}>
              Sign out
            </a>
          ) : (
            <a href="#" onClick={signIn}>
              Sign in
            </a>
          )}
        </div>
      </div>
      {authed && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1em",
            marginBottom: "0.5em",
          }}
        >
          <a href="#" onClick={refresh}>
            Refresh
          </a>
          <a href="#" onClick={addFilter}>
            Add
          </a>
        </div>
      )}
      {helpOpened && <HelpModal open={helpOpened} onOpenChange={openHelp} />}
      {modalOpened && (
        <FilterAddModModal
          labels={customLabels}
          open={modalOpened}
          onOpenChange={openModal}
          onSave={requestToAddFilter}
        />
      )}
      <table style={{ width: "100%", minHeight: "80vh" }}>
        <tbody>
          {filters.map(({ id, criteria, action }) => {
            const parsedAction = parseAction(action);
            return (
              <tr key={id}>
                <td>
                  <div>
                    <p>
                      <b>Criteria</b>
                    </p>
                    <ul>
                      {Object.entries(parseCriteria(criteria))
                        .filter(([, value]) => value)
                        .map(([key, value]) => (
                          <li key={key}>
                            {CriteriaDescription[key as keyof ParsedCriteria]}:{" "}
                            {typeof value !== "boolean" && value}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <p>
                      <b>Actions</b>
                    </p>
                    <ul>
                      {Object.entries(parsedAction)
                        .filter(
                          ([key, value]) =>
                            key !== "categorize" &&
                            key !== "labelToAdd" &&
                            value
                        )
                        .map(([key, value]) => (
                          <li key={key}>
                            {ActionDescription[key as keyof ParsedAction]}{" "}
                            {typeof value === "string" && value}
                          </li>
                        ))}
                      {parsedAction.categorize && (
                        <li>
                          Categorize as{" "}
                          {CATEGORY_LABELS[
                            parsedAction.categorize as keyof typeof CATEGORY_LABELS
                          ] ?? "(unknown)"}
                        </li>
                      )}
                      {parsedAction.labelToAdd && (
                        <li>
                          Apply the label:{" "}
                          {customLabels.find(
                            ({ id }) => id === parsedAction.labelToAdd
                          )?.name ?? "(unknown)"}
                        </li>
                      )}
                    </ul>
                  </div>
                </td>
                <td style={{ width: "6em" }}>
                  <a href="#" onClick={() => deleteFilter(id)}>
                    Delete
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <footer style={{ display: "flex", justifyContent: "center", gap: "1em" }}>
        <a
          href="https://github.com/somidad/gmail-filter-editor"
          target="_blank"
        >
          GitHub
        </a>
        <a href="https://buymeacoffee.com/somidad" target="_blank">
          Support me
        </a>
      </footer>
    </div>
  );
}

export default App;

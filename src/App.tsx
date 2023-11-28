import { useEffect, useState } from "react";
import { Trash2, RefreshCw, LogOut } from "lucide-react";
import { apiKey, client_id } from "./credentials";
import { FilterAddModModal } from "./FilterAddModModal";
import { CATEGORY_ID_NAMES, Label } from "./api/labels";
import { H3, UL } from "./components/ui/typography";
import { Button } from "./components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "./components/ui/table";
import { Separator } from "./components/ui/separator";
import { z } from "zod";
import { Filter } from "./api/filter";
import { ActionLabel, ParsedAction, parseAction } from "./api/action";
import { CriteriaLabel } from "./api/criteria";
import { ForwardingAddresss } from "./api/forwardingAddress";

function App() {
  const [client, setClient] = useState<any>();
  const [authed, setAuthed] = useState(false);
  const [categories, setCategories] = useState<z.infer<typeof Label>[]>([]);
  const [customLabels, setCustomLabels] = useState<z.infer<typeof Label>[]>([]);
  const [forwardingAddresses, setForwardingAddresses] = useState<
    z.infer<typeof ForwardingAddresss>[]
  >([]);
  const [filters, setFilters] = useState<z.infer<typeof Filter>[]>([]);
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
    setCategories([]);
    setCustomLabels([]);
    setFilters([]);
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
        const labels = z.array(Label).parse(response.result.labels);

        const categories = labels.filter(
          ({ id, name }) => id === name && id.startsWith("CATEGORY_")
        );
        setCategories(categories);

        const customLabels = labels
          .filter(({ id, name }) => id !== name)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCustomLabels(customLabels);
      });
  }

  function getForwradingAddressList() {
    (gapi.client as any).gmail.users.settings.forwardingAddresses
      .list({
        userId: "me",
      })
      .then((response: any) => {
        if (!response.result) {
          throw Error("response.result does not exist");
        }
        const forwardingAddresses = z
          .array(ForwardingAddresss)
          .parse(response.result.forwardingAddresses)
          .filter(
            ({ verificationStatus }) => verificationStatus === "accepted"
          );
        setForwardingAddresses(forwardingAddresses);
      })
      .catch((reason: any) => {
        console.error(reason);
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
        const filters = z.array(Filter).parse(response.result.filter);
        setFilters(filters);
      })
      .catch((reason: any) => {
        console.error(reason);
      });
  }

  function refresh() {
    getLabelList();
    getForwradingAddressList();
    getFilterList();
  }

  function requestToAddFilter(filter: Omit<z.infer<typeof Filter>, "id">) {
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
    <div className="space-y-4">
      <div className="flex justify-between">
        <H3>Gmail Filter Editor</H3>
        <div className="space-x-2">
          {authed && (
            <Button variant="outline" onClick={signOut}>
              <LogOut />
            </Button>
          )}
        </div>
      </div>
      {!authed && (
        <div className="flex justify-center">
          <Button onClick={signIn}>Login with your Gmail account</Button>
        </div>
      )}
      {authed && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={refresh}>
            <RefreshCw />
          </Button>
          <FilterAddModModal
            categories={categories}
            labels={customLabels}
            forwardingAddresses={forwardingAddresses}
            open={modalOpened}
            onOpenChange={openModal}
            onSave={requestToAddFilter}
          />
        </div>
      )}
      <Table>
        <TableBody>
          {authed && !filters.length && (
            <TableRow>
              <TableCell className="flex justify-center">
                There is no filter yet. Why don't you try adding one?
              </TableCell>
            </TableRow>
          )}
          {filters.map(({ id, criteria, action }) => {
            const parsedAction = parseAction(action);
            return (
              <TableRow key={id}>
                <TableCell>
                  <b>Criteria</b>
                  <UL>
                    {Object.entries(criteria)
                      .filter(
                        ([key, value]) =>
                          key !== "size" && key !== "sizeComparison" && value
                      )
                      .map(([key, value]) => (
                        <li key={key}>
                          {CriteriaLabel[key as keyof typeof CriteriaLabel]}
                          {typeof value === "boolean" ? "" : `: ${value}`}
                        </li>
                      ))}
                    {criteria.sizeComparison !== "unspecified" &&
                      criteria.size && (
                        <li>
                          {criteria.sizeComparison} {criteria.size} bytes
                        </li>
                      )}
                  </UL>
                  <b>Actions</b>
                  <UL>
                    {Object.entries(parsedAction)
                      .filter(
                        ([key, value]) =>
                          key !== "category" && key !== "label" && value
                      )
                      .map(([key, value]) => (
                        <li key={key}>
                          {
                            ActionLabel[
                              key as keyof z.infer<typeof ParsedAction>
                            ]
                          }{" "}
                          {typeof value === "string" && value}
                        </li>
                      ))}
                    {parsedAction.category && (
                      <li>
                        Categorize as{" "}
                        {CATEGORY_ID_NAMES[
                          parsedAction.category as keyof typeof CATEGORY_ID_NAMES
                        ] ?? "(unknown)"}
                      </li>
                    )}
                    {parsedAction.label && (
                      <li>
                        Apply the label:{" "}
                        {customLabels.find(
                          ({ id }) => id === parsedAction.label
                        )?.name ?? "(unknown)"}
                      </li>
                    )}
                  </UL>
                </TableCell>
                <TableCell className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => deleteFilter(id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Separator />
      <div className="flex justify-center space-x-8">
        <div>
          <a href="/#help">Help</a>
        </div>
        <div>
          <a href="/#privacy">Privacy Policy</a>
        </div>
      </div>
      <div>
        <div className="flex justify-center space-x-8">
          <div>
            <a
              href="https://github.com/somidad/gmail-filter-editor"
              target="_blank"
            >
              GitHub
            </a>
          </div>
          <div>
            <a href="https://buymeacoffee.com/somidad" target="_blank">
              Support me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

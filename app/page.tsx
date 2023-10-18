"use client";

import { useEffect, useState } from "react";
import { Trash2, RefreshCw, LogOut } from "lucide-react";
import { FilterAddModModal } from "@/components/FilterAddModModal";
import { CATEGORY_ID_NAMES, Label } from "@/api/labels";
import { H3, UL } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { Filter } from "@/api/filter";
import { ActionLabel, ParsedAction, parseAction } from "@/api/action";
import { CriteriaLabel } from "@/api/criteria";
import { ForwardingAddresss } from "@/api/forwardingAddress";
import { cn } from "@/lib/utils";

const apiKey = process.env.NEXT_PUBLIC_GCP_API_KEY ?? "";
const client_id = process.env.NEXT_PUBLIC_GCP_CLIENT_ID ?? "";

function App() {
  const [client, setClient] = useState<google.accounts.oauth2.TokenClient>();
  const [authed, setAuthed] = useState(false);
  const [numFetches, setNumFetches] = useState(0);
  const [categories, setCategories] = useState<z.infer<typeof Label>[]>([]);
  const [customLabels, setCustomLabels] = useState<z.infer<typeof Label>[]>([]);
  const [forwardingAddresses, setForwardingAddresses] = useState<
    z.infer<typeof ForwardingAddresss>[]
  >([]);
  const [filters, setFilters] = useState<z.infer<typeof Filter>[]>([]);
  const [modalOpened, openModal] = useState(false);

  async function initGoogleApiClient() {
    try {
      await gapi.client.init({
        apiKey,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
        ],
      });
    } catch (error) {
      console.error(error);
    }
    // const access_token = sessionStorage.getItem("access_token");
    // if (access_token) {
    //   gapi.client.setToken({ access_token });
    //   setAuthed(true);
    //   refresh();
    // }
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
      sessionStorage.removeItem("access_token");
    }
    setCategories([]);
    setCustomLabels([]);
    setFilters([]);
    setAuthed(false);
  }

  function getLabelList() {
    setNumFetches((value) => value + 1);
    fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/labels?key=${apiKey}`,
      {
        headers: {
          Authorization: `Bearer ${gapi.client.getToken().access_token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((response: any) => {
        const labels = z.array(Label).parse(response.labels);

        const categories = labels.filter(
          ({ id, name }) => id === name && id.startsWith("CATEGORY_"),
        );
        setCategories(categories);

        const customLabels = labels
          .filter(({ id, name }) => id !== name)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCustomLabels(customLabels);
      })
      .finally(() => {
        setNumFetches((value) => value - 1);
      });
  }

  function getForwradingAddressList() {
    setNumFetches((value) => value + 1);
    fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/settings/forwardingAddresses?key=${apiKey}`,
      {
        headers: {
          Authorization: `Bearer ${gapi.client.getToken().access_token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((response: any) => {
        const forwardingAddresses = z
          .array(ForwardingAddresss)
          .parse(response.forwardingAddresses)
          .filter(
            ({ verificationStatus }) => verificationStatus === "accepted",
          );
        setForwardingAddresses(forwardingAddresses);
      })
      .catch((reason: unknown) => {
        console.error(reason);
      })
      .finally(() => {
        setNumFetches((value) => value - 1);
      });
  }

  function getFilterList() {
    setNumFetches((value) => value + 1);
    fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/settings/filters?key=${apiKey}`,
      {
        headers: {
          Authorization: `Bearer ${gapi.client.getToken().access_token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((response: any) => {
        const filters = z.array(Filter).parse(response.filter);
        setFilters(filters);
      })
      .catch((reason: unknown) => {
        console.error(reason);
      })
      .finally(() => {
        setNumFetches((value) => value - 1);
      });
  }

  function refresh() {
    getLabelList();
    getForwradingAddressList();
    getFilterList();
  }

  function requestToAddFilter(filter: Omit<z.infer<typeof Filter>, "id">) {
    setNumFetches((value) => value + 1);
    (gapi.client as any).gmail.users.settings.filters
      .create({
        userId: "me",
        ...filter,
      })
      .then(() => {
        setNumFetches((value) => value - 1);
        openModal(false);
        refresh();
      })
      .catch((reason: unknown) => {
        console.error(reason);
        setNumFetches((value) => value - 1);
      });
  }

  function deleteFilter(id: string) {
    setNumFetches((value) => value + 1);
    (gapi.client as any).gmail.users.settings.filters
      .delete({
        userId: "me",
        id,
      })
      .then(() => {
        setNumFetches((value) => value - 1);
        refresh();
      })
      .catch((reason: any) => {
        console.error(reason);
        setNumFetches((value) => value - 1);
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
        // sessionStorage.setItem("access_token", resp.access_token);
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
          <Button variant="outline" onClick={refresh} disabled={numFetches > 0}>
            <RefreshCw className={cn({ "animate-spin": numFetches > 0 })} />
          </Button>
          <FilterAddModModal
            categories={categories}
            labels={customLabels}
            forwardingAddresses={forwardingAddresses}
            open={modalOpened}
            onOpenChange={openModal}
            onSave={requestToAddFilter}
            isFetching={numFetches > 0}
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
                          key !== "size" && key !== "sizeComparison" && value,
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
                          key !== "category" && key !== "label" && value,
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
                          ({ id }) => id === parsedAction.label,
                        )?.name ?? "(unknown)"}
                      </li>
                    )}
                  </UL>
                </TableCell>
                <TableCell className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => deleteFilter(id)}
                    disabled={numFetches > 0}
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
          <a href="/help">Help</a>
        </div>
        <div>
          <a href="/privacy">Privacy Policy</a>
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

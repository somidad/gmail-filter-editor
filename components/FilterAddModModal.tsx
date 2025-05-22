import { zodResolver } from "@hookform/resolvers/zod";
import {
  CATEGORY_ID_NAMES,
  IMPORTANT,
  INBOX,
  Label,
  SPAM,
  STARRED,
  TRASH,
  UNREAD,
} from "@/api/labels";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { H3 } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { Filter } from "@/api/filter";
import { Criteria } from "@/api/criteria";
import { ActionInput } from "@/api/action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForwardingAddresss } from "@/api/forwardingAddress";

const FormSchema = Criteria.merge(ActionInput).extend({
  addLabel: z.boolean().default(false),
  toForward: z.boolean().default(false),
  categorize: z.boolean().default(false),
});

type Props = {
  categories: z.infer<typeof Label>[];
  labels: z.infer<typeof Label>[];
  forwardingAddresses: z.infer<typeof ForwardingAddresss>[];
  open: boolean;
  onOpenChange: (opened: boolean) => void;
  onSave: (filter: Omit<z.infer<typeof Filter>, "id">) => void;
  isFetching: boolean;
};

export function FilterAddModModal({
  categories,
  labels,
  forwardingAddresses,
  open,
  onOpenChange,
  onSave,
  isFetching,
}: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: FormSchema.parse({}),
  });
  const sizeComparisonValue = form.watch("sizeComparison");
  const archiveOrDeleteValue = form.watch("archiveOrDelete");
  const addLabelValue = form.watch("addLabel");
  const toForwardValue = form.watch("toForward");
  const importantOrNotValue = form.watch("importantOrNot");
  const categorizeValue = form.watch("categorize");

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const {
      from,
      to,
      subject,
      query,
      negatedQuery,
      hasAttachment,
      excludeChats,
      sizeComparison,
      size,
      archiveOrDelete,
      markAsRead,
      star,
      addLabel,
      label,
      toForward,
      forward,
      notSpam,
      importantOrNot,
      categorize,
      category,
    } = values;

    const addLabelIds: string[] = [];
    const removeLabelIds: string[] = [];
    if (archiveOrDelete.includes("skipInbox")) {
      removeLabelIds.push(INBOX);
    }
    if (markAsRead) {
      removeLabelIds.push(UNREAD);
    }
    if (star) {
      addLabelIds.push(STARRED);
    }
    if (addLabel) {
      addLabelIds.push(label);
    }
    if (archiveOrDelete.includes("deleteIt")) {
      addLabelIds.push(TRASH);
    }
    if (notSpam) {
      removeLabelIds.push(SPAM);
    }
    if (importantOrNot.includes("important")) {
      addLabelIds.push(IMPORTANT);
    }
    if (importantOrNot.includes("notImportant")) {
      removeLabelIds.push(IMPORTANT);
    }
    if (categorize) {
      addLabelIds.push(category);
    }

    const filter: Omit<z.infer<typeof Filter>, "id"> = {
      criteria: {
        from,
        to,
        subject,
        query,
        negatedQuery,
        hasAttachment,
        excludeChats,
        sizeComparison,
        size,
      },
      action: {
        addLabelIds,
        removeLabelIds,
        forward: toForward ? forward : "",
      },
    };
    onSave(filter);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <H3>Add filter</H3>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="criteria">
              <TabsList className="w-full">
                <TabsTrigger value="criteria" className="flex-1">
                  <b>Criteria</b>
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex-1">
                  <b>Actions</b>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="criteria">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <FormLabel className="flex-1">From</FormLabel>
                        <FormControl className="flex-1">
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <FormLabel className="flex-1">To</FormLabel>
                        <FormControl className="flex-1">
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <FormLabel className="flex-1">Subject</FormLabel>
                        <FormControl className="flex-1">
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <FormLabel className="flex-1">Has the words</FormLabel>
                        <FormControl className="flex-1">
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="negatedQuery"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <FormLabel className="flex-1">Doesn't have</FormLabel>
                        <FormControl className="flex-1">
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasAttachment"
                    render={({ field }) => (
                      <FormItem className="flex space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Has attachment</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="excludeChats"
                    render={({ field }) => (
                      <FormItem className="flex space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Don't include chats</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <FormField
                      name="sizeComparison"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size filter" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="unspecified">
                                (no size filter)
                              </SelectItem>
                              <SelectItem value="larger">
                                greater than
                              </SelectItem>
                              <SelectItem value="smaller">less than</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="size"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Size in bytes"
                              {...field}
                              disabled={sizeComparisonValue === "unspecified"}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="actions">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="archiveOrDelete"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value.includes("skipInbox")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      "skipInbox",
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "skipInbox"
                                      ) ?? []
                                    );
                              }}
                              disabled={archiveOrDeleteValue.includes(
                                "deleteIt"
                              )}
                            />
                          </FormControl>
                          <FormLabel>Skip the inbox (Archive it)</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="markAsRead"
                    render={({ field }) => (
                      <FormItem className="flex space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Mark as read</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="star"
                    render={({ field }) => (
                      <FormItem className="flex space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Star it</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between items-center space-x-2">
                    <span>
                      <FormField
                        control={form.control}
                        name="addLabel"
                        render={({ field }) => (
                          <FormItem className="flex space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Apply the label:</FormLabel>
                          </FormItem>
                        )}
                      />
                    </span>
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem className="flex-auto">
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            disabled={!addLabelValue}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select label" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {labels.map(({ id, name }) => (
                                <SelectItem key={id} value={id}>
                                  {name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center space-x-2">
                    <span>
                      <FormField
                        control={form.control}
                        name="toForward"
                        render={({ field }) => (
                          <FormItem className="flex space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Forwarding it to:</FormLabel>
                          </FormItem>
                        )}
                      />
                    </span>
                    <FormField
                      control={form.control}
                      name="forward"
                      render={({ field }) => (
                        <FormItem className="flex-auto">
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            disabled={!toForwardValue}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose an address" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {forwardingAddresses.map(
                                ({ forwardingEmail }) => (
                                  <SelectItem
                                    key={forwardingEmail}
                                    value={forwardingEmail}
                                  >
                                    {forwardingEmail}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="archiveOrDelete"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value.includes("deleteIt")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, "deleteIt"])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "deleteIt"
                                      ) ?? []
                                    );
                              }}
                              disabled={archiveOrDeleteValue.includes(
                                "skipInbox"
                              )}
                            />
                          </FormControl>
                          <FormLabel>Delete it</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notSpam"
                    render={({ field }) => (
                      <FormItem className="flex space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Never sent it to spam</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="importantOrNot"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value.includes("important")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      "important",
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "important"
                                      ) ?? []
                                    );
                              }}
                              disabled={importantOrNotValue.includes(
                                "notImportant"
                              )}
                            />
                          </FormControl>
                          <FormLabel>Always mark it as important</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="importantOrNot"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value.includes("notImportant")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      "notImportant",
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "notImportant"
                                      ) ?? []
                                    );
                              }}
                              disabled={importantOrNotValue.includes(
                                "important"
                              )}
                            />
                          </FormControl>
                          <FormLabel>Never mark it as important</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between items-center space-x-2">
                    <span>
                      <FormField
                        control={form.control}
                        name="categorize"
                        render={({ field }) => (
                          <FormItem className="flex space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Categorize as:</FormLabel>
                          </FormItem>
                        )}
                      />
                    </span>
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex-auto">
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            disabled={!categorizeValue}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map(({ id }) => (
                                <SelectItem key={id} value={id}>
                                  {CATEGORY_ID_NAMES[
                                    id as keyof typeof CATEGORY_ID_NAMES
                                  ] ?? id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <FormMessage />
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isFetching}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

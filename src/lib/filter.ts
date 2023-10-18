import { Action } from "./actions";
import { Criteria } from "./criteria";

export type Filter = {
  id: string;
  criteria: Criteria;
  action: Action;
};

import React, { Reducer, useContext, Dispatch } from "react";
import { Roles, User } from "../types/user";

export enum MeActions {
  LOGIN = 'login'
};

export type MeActionType =
  | { type: MeActions.LOGIN; payload: User; };

export type MeState = User | null;

export const initialMeState: MeState = {
  name: '',
  role: Roles.PARTICIPANT,
};

export const meReducer: Reducer<MeState, MeActionType> = (state, action) => {
  switch (action.type) {
    case MeActions.LOGIN: return action.payload;
  };
};

const dispatch: Dispatch<MeActionType> = () => { };

export const MeContext = React.createContext<[MeState, Dispatch<MeActionType>]>([initialMeState, dispatch]);

export const useMe = () => useContext(MeContext);
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";
import { recoveryFormResponse } from "./recoveryFormResponse.function.ts";

export const showRecoveryFormPage: DropRouteHandler = ({ services, dropId }) =>
    recoveryFormResponse(services, dropId, { typed: "", error: null, shouldAskToConfirm: false });

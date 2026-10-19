import type { ISubmittedForm } from "#application/shared/form-checks/interfaces/ISubmittedForm.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

export interface IRequestRecoveryRequest extends ISubmittedForm {
    readonly dropId: Bytes32Hex;
    readonly typedRecoveryCode: unknown;
}

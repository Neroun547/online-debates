import { SupportDomainInterface } from "src/db/support/interfaces/support.interfaces";

export interface GetSupportItemsResponseInterface {
    count: number;
    data: SupportDomainInterface[];
}

export interface GetSingleSlotsResponseDataItemInterface {
    id: number;
    userId: number;
    subjectId: number;
    slotsTemplateId: number;
    startTime: string;
    endTime: string;
}

export interface GetSingleSlotsResponseInterface {
    isLoadMoreAvailable: boolean;
    data: Array<GetSingleSlotsResponseDataItemInterface>;
}


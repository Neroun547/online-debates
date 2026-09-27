import type { SubjectItem } from "~/store/categories/interfaces/get-subjects-response.interface"

export type UserSessionsFilter = 'all' | 'booked_with_me' | 'my_booking'

export type SessionStatus = 'booked' | 'completed' | 'cancelled'

export interface SessionUserInterface {
  id: number
  username: string
  email: string
  status: 'online' | 'busy' | 'offline'
  timezone: string
  avatarFilename: string
}

export interface SessionSlotInterface {
  id: number
  startTime: string
  endTime: string
  userId: number
  subjectId: number
  subject?: SubjectItem;
  slotsTemplateId: number | null
}

export interface UserSessionInterface {
  id: number
  slotId: number
  status: SessionStatus
  creatorId: number
  customerId: number
  createdAt: string;
  isAnotherUserInSession: boolean;
  creator?: SessionUserInterface
  customer?: SessionUserInterface
  slot?: SessionSlotInterface
}

export interface GetUserSessionsRequestInterface {
  page: number
  limit: number
  dateFrom: string
  dateTo: string
  status: UserSessionsFilter
}

export type GetUserSessionsResponseInterface = UserSessionInterface[]

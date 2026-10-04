import { DateTime } from 'luxon'
import { useSessionsStore } from '~/store/sessions/sessions.store'
import { useSlotsStore } from '~/store/slots/slots.store'
import type { GetSlotsForBookingResponseInterface } from '~/store/slots/interfaces/get-slots-for-booking-response.interface'
import type { GetUsersBySubjectResponseInterface } from '~/store/user/interfaces/get-users-by-subject-response.interface'

interface UseBookSessionParams {
  categoryId?: number;
  subjectId?: number;
  currentCalendarState: Ref<{ year: number; month: number }>;
}

export function useBookSession(params: UseBookSessionParams) {
  const { t } = useI18n()
  const toast = useToast()

  const sessionsStore = useSessionsStore()
  const slotsStore = useSlotsStore()

  const availableDatesForBookingCalendar = ref();

  const isSlotsLoading = ref(false)
  const isBookingButtonLoading = ref(false)
  const isBookSessionModalOpen = ref(false)
  const activeBookingUser = ref<GetUsersBySubjectResponseInterface>()
  const bookingSlots = ref<GetSlotsForBookingResponseInterface[]>([])

  const currentSubjectId = ref();
  const currentUserId = ref();
  const defaultSelectedDate = ref();

  async function openBookSessionModal(user: GetUsersBySubjectResponseInterface, subjectId?: number) {
    if(!subjectId && !params.subjectId) {
      return;
    }
    const { dateFrom, dateTo } = getDateFromAndDateToForGetBookingAvailableSlots(
      params.currentCalendarState.value.year,
      params.currentCalendarState.value.month,
    );

    availableDatesForBookingCalendar.value = await getAvailableDates(
      dateFrom,
      dateTo,
      Number(subjectId ? subjectId : params.subjectId),
      user.id,
    );
    activeBookingUser.value = user
    isBookSessionModalOpen.value = true

    currentSubjectId.value = Number(subjectId ? subjectId : params.subjectId);
    currentUserId.value = user.id;

    if(availableDatesForBookingCalendar.value.length) {
      const date = DateTime.fromFormat(availableDatesForBookingCalendar.value[0].date, "yyyy-MM-dd");
   
      defaultSelectedDate.value = {
        year: date.year,
        month: date.month,
        day: date.day
      }
    }
  }

  async function loadSlots(date: string, subjectId?: number) {
    if (!activeBookingUser.value || (!subjectId && !params.subjectId)) {
      return
    }
    
    isSlotsLoading.value = true

    const currentDate = DateTime.now().toFormat('yyyy-MM-dd')
    const response = await slotsStore.getSlotsForBooking({
      dateFrom:
        date
        + ' '
        + (currentDate === date
          ? DateTime.now().toFormat('HH:mm:ss')
          : '00:00:00'),
      dateTo: date + ' 23:59:59',
      subjectId: params.subjectId ? params.subjectId : Number(subjectId),
      userId: activeBookingUser.value.id
    })

    if (response) {
      bookingSlots.value = response
    }
    isSlotsLoading.value = false
  }

  async function bookSession(data: {
    date: string
    slot: GetSlotsForBookingResponseInterface
  }) {
    isBookingButtonLoading.value = true

    const currentUserDateTime = DateTime.now().toFormat('yyyy-MM-dd HH:mm')
    await slotsStore.bookSession({
      slot: data.slot,
      currentUserDateTime
    })

    if (slotsStore.isError) {
      toast.add({
        title: t('subjects.error'),
        description: slotsStore.errorMessage,
        progress: {
          color: 'error'
        }
      })
    } else {
      toast.add({
        title: t('subjects.success'),
        description: t('subjects.sessionBookedSuccessfully'),
        progress: {
          color: 'success'
        }
      })

      isBookSessionModalOpen.value = false
    }
    isBookingButtonLoading.value = false
  }

  async function startSessionNow(userId: number, subjectId?: number, categoryId?: number) {
    if(!categoryId && !params.categoryId) {
        return;
    }
    const response = await sessionsStore.startSessionNow({
      userId,
      subjectId: params.subjectId ? params.subjectId : Number(subjectId),
      categoryId: params.categoryId ? params.categoryId : Number(categoryId)
    })

    if (sessionsStore.isError) {
      toast.add({
        title: t('subjects.error'),
        description: sessionsStore.errorMessage,
        color: 'error'
      })
      return
    }

    if (response && typeof response.sessionId === 'number') {
      toast.add({
        title: t('subjects.success'),
        description: t('subjects.sessionBookedSuccessfully')
      })

      window.location.href = '/my-sessions/' + response.sessionId
    }
  }

  async function getAvailableDates(dateFrom: string, dateTo: string, subjectId: number, userId?: number) {
    if(userId) {
      return await slotsStore.getAvailableDatesForSlots(userId, subjectId, dateFrom, dateTo)
    } 
    if(activeBookingUser.value) {
      return await slotsStore.getAvailableDatesForSlots(activeBookingUser.value.id, subjectId, dateFrom, dateTo)
    }
  }

  watch(params.currentCalendarState, async () => {
    const { dateFrom, dateTo } = getDateFromAndDateToForGetBookingAvailableSlots(
      params.currentCalendarState.value.year,
      params.currentCalendarState.value.month,
    );

    availableDatesForBookingCalendar.value = await getAvailableDates(
      dateFrom,
      dateTo,
      Number(currentSubjectId.value),
      currentUserId.value
    );
  });

  return {
    bookingSlots,
    isBookingButtonLoading,
    isBookSessionModalOpen,
    isSlotsLoading,
    bookSession,
    loadSlots,
    openBookSessionModal,
    startSessionNow,
    availableDatesForBookingCalendar,
    defaultSelectedDate: defaultSelectedDate
  }
}

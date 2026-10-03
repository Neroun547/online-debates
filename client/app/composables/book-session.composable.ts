import { DateTime } from 'luxon'
import { useSessionsStore } from '~/store/sessions/sessions.store'
import { useSlotsStore } from '~/store/slots/slots.store'
import type { GetSlotsForBookingResponseInterface } from '~/store/slots/interfaces/get-slots-for-booking-response.interface'
import type { GetUsersBySubjectResponseInterface } from '~/store/user/interfaces/get-users-by-subject-response.interface'

interface UseBookSessionParams {
  categoryId?: number;
  subjectId?: number;
}

export function useBookSession(params: UseBookSessionParams) {
  const { t } = useI18n()
  const toast = useToast()

  const sessionsStore = useSessionsStore()
  const slotsStore = useSlotsStore()

  const isSlotsLoading = ref(false)
  const isBookingButtonLoading = ref(false)
  const isBookSessionModalOpen = ref(false)
  const activeBookingUser = ref<GetUsersBySubjectResponseInterface>()
  const bookingSlots = ref<GetSlotsForBookingResponseInterface[]>([])

  function openBookSessionModal(user: GetUsersBySubjectResponseInterface) {
    activeBookingUser.value = user
    isBookSessionModalOpen.value = true
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

  return {
    bookingSlots,
    isBookingButtonLoading,
    isBookSessionModalOpen,
    isSlotsLoading,
    bookSession,
    loadSlots,
    openBookSessionModal,
    startSessionNow
  }
}

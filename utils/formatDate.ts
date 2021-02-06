import dayjs from 'dayjs'

export const convertDatetimeToISO8601Format = (dateString: string): string => {
  return dayjs(dateString).format('YYYY-MM-DDTHH:mm:ss')
}

export const convertDateToISO8601Format = (dateString: string): string => {
  return dayjs(dateString).format('YYYY-MM-DD')
}

export const convertDateToDisplayText = (dateString: string): string => {
  // TODO: i18nする
  return dayjs(dateString).format('YYYY/MM/DD')
}

/**
 * Get date string formatted Simple(YYYY/MM/DD)
 *
 * @param dateString- Parsable string by dayjs
 */
export const convertDateToSimpleFormat = (dateString: string): string => {
  return dayjs(dateString).format('YYYY/MM/DD')
}

import dayjs from 'dayjs'
import es from 'dayjs/locale/es'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.locale('es')
dayjs.extend(localizedFormat)
dayjs.locale(es)

export const formatearFecha = (stringFecha) => dayjs(stringFecha).format('DD/MM/YYYY')

export const formatearMonto = (monto) => monto?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

export const formatearHora = (stringFecha) => dayjs(stringFecha).locale('es').format('DD/MM/YYYY HH:mm')
export const formatearFechaCorreo = (stringFecha) => dayjs(stringFecha).locale('es').format('DD [de] MMMM [del] YYYY')

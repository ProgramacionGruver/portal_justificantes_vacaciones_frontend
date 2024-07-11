export const obtenerIconoYColorAutorizacion = (detalles, idTipoAutorizacion) => {
  let result = {
    icon: 'radio_button_unchecked',
    color: 'primary'
  }

  // Filtrar autorizaciones por idTipoAutorizacion
  let autorizacionesFiltradas = detalles.map(detalle =>
    detalle.autorizaciones_solicitudes.filter(
      autorizacion => autorizacion.idTipoAutorizacion === idTipoAutorizacion
    )
  ).flat()

  // Verificar estados
  let todasPendientes = autorizacionesFiltradas.every(
    autorizacion => autorizacion.idEstatusAutorizacion === 1
  )

  let todasRechazadas = autorizacionesFiltradas.every(
    autorizacion => autorizacion.idEstatusAutorizacion === 3
  )

  let algunaAutorizada = autorizacionesFiltradas.some(
    autorizacion => autorizacion.idEstatusAutorizacion === 2
  )

  if (todasRechazadas) {
    result.icon = 'radio_button_checked'
    result.color = 'red'
  } else if (algunaAutorizada) {
    result.icon = 'radio_button_checked'
    result.color = 'primary'
  } else if (todasPendientes) {
    result.icon = 'radio_button_unchecked'
    result.color = 'primary'
  }

  return result
}

export const obtenerPropsQChip = (detalles) => {
  const AUTORIZADO = 2
  const RECHAZADO = 3

  const todosTerminados = detalles.every(detalle =>
    detalle.idEstatusSolicitud === AUTORIZADO ||
    detalle.idEstatusSolicitud === RECHAZADO
  )

  return todosTerminados
    ? { color: 'primary', nombre: 'Finalizado', icono: 'hourglass_bottom' }
    : { color: 'grey', nombre: 'Pendiente', icono: 'update' }
}

export const obtenerTextoAutorizacion = (index) => {
  const textos = ['Primera autorización', 'Segunda autorización', 'Tercera autorización']
  return textos[index]
}

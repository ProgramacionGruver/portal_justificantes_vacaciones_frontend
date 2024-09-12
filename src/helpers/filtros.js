// Devuelve una lista de opciones filtradas (un array filtrado del array opciones)
export const filtrarElementos = (listaElementosSeleccionados, opciones, nombreCampoAFiltrar) => {
  return opciones.filter(elemento => {
    return listaElementosSeleccionados.includes(elemento[nombreCampoAFiltrar])
  })
}

export const llenarOpcionesEmpresas = (empresas) => {
  return empresas.map((empresa) => {
    empresa.label = empresa.nombreEmpresa
    empresa.value = empresa.claveEmpresa
    return empresa
  })
}

export const llenarOpcionesSucursales = (sucursales) => {
  // const regex = /CENTRALIZADOR|DIVISION/;
  // return sucursales.filter(sucursal => !regex.test(sucursal.nombreSucursal)).map((sucursal) => {
  return sucursales.map((sucursal) => {
    sucursal.label = sucursal.nombreSucursal
    sucursal.value = sucursal.claveSucursal
    return sucursal
  })
}

export const llenarOpcionesDepartamentos = (departamentos) => {
  /* SI SE LLEGA A REQUERIR FILTRAR ALGUN DEPARTAMENTO --> USAR REGEX*/
  // const regex = /BDC|CENTRALIZADOR|ACONDICIONAMIENTO|COCINA|MERCADOTECNIA|CORPORATIVA/;
  //return departamentos.filter(departamento => !regex.test(departamento.departamento.nombreDepartamento)).map((departamento) => {
  return departamentos.map((departamento) => {
    departamento.label = departamento.departamento.nombreDepartamento
    departamento.claveEmpresa = departamento.sucursale.claveEmpresa
    departamento.value = departamento.claveDepartamento
    return departamento
  })
}

//Filtrar elementos de un array con una propiedad que no quieres que se repita
export const filtrarElementosDuplicados = (listaElementos, nombrePropiedadUnica) => {
  return listaElementos.reduce((acumulador, elemento) => {
    // Comprueba si la propiedad 'nombrePropiedadUnica' del elemento ya se ha agregado al acumulador
    if (!acumulador.find(acu => acu[nombrePropiedadUnica] == elemento[nombrePropiedadUnica])) {
      acumulador.push(elemento)
    }
    return acumulador
  }, [])
}

export const filtarElementosPorMes = (elementos, elementosFiltrados,
  modelMesesSeleccionados) => {
  elementosFiltrados.value = filtrarElementos(modelMesesSeleccionados.value, elementos.value, 'mes')
}


export const filtrarElementosPorEmpresaSucursalDepartamento = (elementos, elementosFiltrados,
  todasEmpresasSeleccionadas, listaClavesEmpresas, modelEmpresasSeleccionadas,
  todasSucursalesSeleccionadas, listaClavesSucursales, modelSucursalesSeleccionadas,
  todosDepartamentosSeleccionados, listaClavesDepartamentos, modelDepartamentosSeleccionados
) => {
  elementosFiltrados.value = todasEmpresasSeleccionadas.value ?
    filtrarElementos(listaClavesEmpresas.value, elementos.value, 'claveEmpresa')
    : filtrarElementos(modelEmpresasSeleccionadas.value, elementos.value, 'claveEmpresa')
  elementosFiltrados.value = todasSucursalesSeleccionadas.value ?
    filtrarElementos(listaClavesSucursales.value, elementosFiltrados.value, 'claveSucursal')
    : filtrarElementos(modelSucursalesSeleccionadas.value, elementosFiltrados.value, 'claveSucursal')
  elementosFiltrados.value = todosDepartamentosSeleccionados.value ?
    filtrarElementos(listaClavesDepartamentos.value, elementosFiltrados.value, 'claveDepartamento')
    : filtrarElementos(modelDepartamentosSeleccionados.value, elementosFiltrados.value, 'claveDepartamento')
}

export const filtrarElementosPorEmpresaSucursal = (elementos, elementosFiltrados,
  todasEmpresasSeleccionadas, listaClavesEmpresas, modelEmpresasSeleccionadas,
  todasSucursalesSeleccionadas, listaClavesSucursales, modelSucursalesSeleccionadas
) => {
  elementosFiltrados.value = todasEmpresasSeleccionadas.value ?
    filtrarElementos(listaClavesEmpresas.value, elementos.value, 'claveEmpresa')
    : filtrarElementos(modelEmpresasSeleccionadas.value, elementos.value, 'claveEmpresa')
  elementosFiltrados.value = todasSucursalesSeleccionadas.value ?
    filtrarElementos(listaClavesSucursales.value, elementosFiltrados.value, 'claveSucursal')
    : filtrarElementos(modelSucursalesSeleccionadas.value, elementosFiltrados.value, 'claveSucursal')
}

export const filtrarOpciones = (tipoFiltro,
  listaClavesEmpresas, todasEmpresasSeleccionadas, modelEmpresasSeleccionadas,
  sucursales, sucursalesFiltradas, listaClavesSucursales, todasSucursalesSeleccionadas, modelSucursalesSeleccionadas,
  departamentos, departamentosFiltrados, listaClavesDepartamentos, todosDepartamentosSeleccionados, modelDepartamentosSeleccionados) => {
  switch (tipoFiltro) {
    case 'TODASEMPRESAS':
      todasEmpresasSeleccionadas.value = true
      modelEmpresasSeleccionadas.value = []
      sucursalesFiltradas.value = filtrarElementos(listaClavesEmpresas.value, sucursales.value, 'claveEmpresa')
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(listaClavesEmpresas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'OPCIONESEMPRESAS':
      todasEmpresasSeleccionadas.value = false
      sucursalesFiltradas.value = filtrarElementos(modelEmpresasSeleccionadas.value, sucursales.value, 'claveEmpresa')
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(modelEmpresasSeleccionadas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'TODASSUCURSALES':
      todasSucursalesSeleccionadas.value = true
      modelSucursalesSeleccionadas.value = []
      departamentosFiltrados.value == todasEmpresasSeleccionadas.value ?
        filtrarElementosDuplicados(filtrarElementos(listaClavesEmpresas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
        : filtrarElementosDuplicados(filtrarElementos(modelEmpresasSeleccionadas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'OPCIONESSUCURSALES':
      todasSucursalesSeleccionadas.value = false
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(modelSucursalesSeleccionadas.value, departamentos.value, 'claveSucursal'), 'claveDepartamento')
      break
    case 'TODOSDEPARTAMENTOS':
      todosDepartamentosSeleccionados.value = true
      modelDepartamentosSeleccionados.value = []
      break
    case 'OPCIONESDEPARTAMENTOS':
      todosDepartamentosSeleccionados.value = false
      break
  }

}

export const filtrarOpcionesHistorialSolicitudes = (tipoFiltro,
  listaClavesEmpresas, todasEmpresasSeleccionadas, modelEmpresasSeleccionadas,
  sucursales, sucursalesFiltradas, listaClavesSucursales, todasSucursalesSeleccionadas, modelSucursalesSeleccionadas,
  departamentos, departamentosFiltrados, listaClavesDepartamentos, todosDepartamentosSeleccionados, modelDepartamentosSeleccionados,
  todosTipoSolicitudesSeleccionados, tiposSolicitudSeleccionados, todosMotivosSeleccionados, motivosSeleccionados) => {
  switch (tipoFiltro) {
    case 'TODASEMPRESAS':
      todasEmpresasSeleccionadas.value = true
      modelEmpresasSeleccionadas.value = []
      sucursalesFiltradas.value = filtrarElementos(listaClavesEmpresas.value, sucursales.value, 'claveEmpresa')
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(listaClavesEmpresas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'OPCIONESEMPRESAS':
      todasEmpresasSeleccionadas.value = false
      sucursalesFiltradas.value = filtrarElementos(modelEmpresasSeleccionadas.value, sucursales.value, 'claveEmpresa')
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(modelEmpresasSeleccionadas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'TODASSUCURSALES':
      todasSucursalesSeleccionadas.value = true
      modelSucursalesSeleccionadas.value = []
      departamentosFiltrados.value == todasEmpresasSeleccionadas.value ?
        filtrarElementosDuplicados(filtrarElementos(listaClavesEmpresas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
        : filtrarElementosDuplicados(filtrarElementos(modelEmpresasSeleccionadas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'OPCIONESSUCURSALES':
      todasSucursalesSeleccionadas.value = false
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(modelSucursalesSeleccionadas.value, departamentos.value, 'claveSucursal'), 'claveDepartamento')
      break
    case 'TODOSDEPARTAMENTOS':
      todosDepartamentosSeleccionados.value = true
      modelDepartamentosSeleccionados.value = []
      break
    case 'OPCIONESDEPARTAMENTOS':
      todosDepartamentosSeleccionados.value = false
      break
    case 'TODOSTIPOSOLICITUD':
      todosTipoSolicitudesSeleccionados.value = true
      tiposSolicitudSeleccionados.value = []
      break
    case 'OPCIONESTIPOSOLICITUD':
      todosTipoSolicitudesSeleccionados.value = false
      break
    case 'TODOSMOTIVOS':
      todosMotivosSeleccionados.value = true
      motivosSeleccionados.value = []
      break
    case 'OPCIONESMOTIVOS':
      todosMotivosSeleccionados.value = false
      break
  }

}

export const filtrarOpcionesCatalogoUsuarios = (tipoFiltro,
  listaClavesEmpresas, todasEmpresasSeleccionadas, modelEmpresasSeleccionadas,
  sucursales, sucursalesFiltradas, listaClavesSucursales, todasSucursalesSeleccionadas, modelSucursalesSeleccionadas,
  departamentos, departamentosFiltrados, listaClavesDepartamentos, todosDepartamentosSeleccionados, modelDepartamentosSeleccionados,
  todosEstatusActividadSeleccionados, modelEstatusActividadSeleccionados, todosTurnosLunesViernesSeleccionados, modelTurnosLunesViernesSeleccionados,
  todosTurnosSabadosSeleccionados, modelTurnosSabadosSeleccionados) => {
  switch (tipoFiltro) {
    case 'TODASEMPRESAS':
      todasEmpresasSeleccionadas.value = true
      modelEmpresasSeleccionadas.value = []
      sucursalesFiltradas.value = filtrarElementos(listaClavesEmpresas.value, sucursales.value, 'claveEmpresa')
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(listaClavesEmpresas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'OPCIONESEMPRESAS':
      todasEmpresasSeleccionadas.value = false
      sucursalesFiltradas.value = filtrarElementos(modelEmpresasSeleccionadas.value, sucursales.value, 'claveEmpresa')
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(modelEmpresasSeleccionadas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'TODASSUCURSALES':
      todasSucursalesSeleccionadas.value = true
      modelSucursalesSeleccionadas.value = []
      departamentosFiltrados.value == todasEmpresasSeleccionadas.value ?
        filtrarElementosDuplicados(filtrarElementos(listaClavesEmpresas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
        : filtrarElementosDuplicados(filtrarElementos(modelEmpresasSeleccionadas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'OPCIONESSUCURSALES':
      todasSucursalesSeleccionadas.value = false
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(modelSucursalesSeleccionadas.value, departamentos.value, 'claveSucursal'), 'claveDepartamento')
      break
    case 'TODOSDEPARTAMENTOS':
      todosDepartamentosSeleccionados.value = true
      modelDepartamentosSeleccionados.value = []
      break
    case 'OPCIONESDEPARTAMENTOS':
      todosDepartamentosSeleccionados.value = false
      break
    case 'TODOSESTATUSACTIVIDAD':
      todosEstatusActividadSeleccionados.value = true
      modelEstatusActividadSeleccionados.value = []
      break
    case 'OPCIONESESTATUSACTIVIDAD':
      todosEstatusActividadSeleccionados.value = false
      break
    case 'TODOSTURNOSLUNESVIERNES':
      todosTurnosLunesViernesSeleccionados.value = true
      modelTurnosLunesViernesSeleccionados.value = []
      break
    case 'OPCIONESTURNOSLUNESVIERNES':
      todosTurnosLunesViernesSeleccionados.value = false
      break
    case 'TODOSTURNOSSABADOS':
      todosTurnosSabadosSeleccionados.value = true
      modelTurnosSabadosSeleccionados.value = []
      break
    case 'OPCIONESTURNOSSABADOS':
      todosTurnosSabadosSeleccionados.value = false
      break
  }

}

export const filtrarAgruparCartera = (listaCartera, tipoCartera) => {
  return listaCartera.filter(cartera => cartera.claveTipoCartera == tipoCartera).reduce((acumulador, elemento) => {
    const { idRubro, montoPorVencer, montoVencido1A15, montoVencido16A60, montoVencido61A90, montoVencidoMasDe90 } = elemento;
    const elementoNuevo = elemento
    // Verificamos si ya existe un elemento con el mismo idRubro en el acumulador
    const elementoExistente = acumulador.find(item => item.idRubro === idRubro);
    if (elementoExistente) {
      // Si existe, sumamos el monto total al existente
      const elementoActualizado = {
        ...elementoExistente,
        montoPorVencer: elementoExistente.montoPorVencer + montoPorVencer,
        montoVencido1A15: elementoExistente.montoVencido1A15 + montoVencido1A15,
        montoVencido16A60: elementoExistente.montoVencido16A60 + montoVencido16A60,
        montoVencido61A90: elementoExistente.montoVencido61A90 + montoVencido61A90,
        montoVencidoMasDe90: elementoExistente.montoVencidoMasDe90 + montoVencidoMasDe90,
      };

      // Reemplazamos el elemento existente en el acumulador con el objeto actualizado
      acumulador = acumulador.map(item => (item.idRubro === idRubro ? elementoActualizado : item));
    } else {
      // Si no existe, agregamos un nuevo elemento al acumulador
      acumulador.push(elementoNuevo);
    }

    return acumulador

  }, [])
}

export const limpiarFiltrosEmpresaSucursalDepartamento = (todasEmpresasSeleccionadas,
  modelEmpresasSeleccionadas, todasSucursalesSeleccionadas, modelSucursalesSeleccionadas,
  todosDepartamentosSeleccionados, modelDepartamentosSeleccionados, sucursales, sucursalesFiltradas,
  listaClavesEmpresas, departamentos, departamentosFiltrados) => {
  todasEmpresasSeleccionadas.value = true
  modelEmpresasSeleccionadas.value = []
  todasSucursalesSeleccionadas.value = true
  modelSucursalesSeleccionadas.value = []
  todosDepartamentosSeleccionados.value = true
  modelDepartamentosSeleccionados.value = []
  sucursalesFiltradas.value = filtrarElementos(listaClavesEmpresas.value, sucursales.value, 'claveEmpresa')
  departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(listaClavesEmpresas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
}

export const filtrarOpcionesIncapacidades = (tipoFiltro,
  listaClavesEmpresas, todasEmpresasSeleccionadas, modelEmpresasSeleccionadas,
  sucursales, sucursalesFiltradas, listaClavesSucursales, todasSucursalesSeleccionadas, modelSucursalesSeleccionadas,
  departamentos, departamentosFiltrados, listaClavesDepartamentos, todosDepartamentosSeleccionados, modelDepartamentosSeleccionados,
  todosTipoRamoSeleccionados, tiposRamoSeleccionados, todosTipoRiesgoSeleccionados, tiposRiesgoSeleccionados) => {
  switch (tipoFiltro) {
    case 'TODASEMPRESAS':
      todasEmpresasSeleccionadas.value = true
      modelEmpresasSeleccionadas.value = []
      sucursalesFiltradas.value = filtrarElementos(listaClavesEmpresas.value, sucursales.value, 'claveEmpresa')
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(listaClavesEmpresas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'OPCIONESEMPRESAS':
      todasEmpresasSeleccionadas.value = false
      sucursalesFiltradas.value = filtrarElementos(modelEmpresasSeleccionadas.value, sucursales.value, 'claveEmpresa')
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(modelEmpresasSeleccionadas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'TODASSUCURSALES':
      todasSucursalesSeleccionadas.value = true
      modelSucursalesSeleccionadas.value = []
      departamentosFiltrados.value == todasEmpresasSeleccionadas.value ?
        filtrarElementosDuplicados(filtrarElementos(listaClavesEmpresas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
        : filtrarElementosDuplicados(filtrarElementos(modelEmpresasSeleccionadas.value, departamentos.value, 'claveEmpresa'), 'claveDepartamento')
      break
    case 'OPCIONESSUCURSALES':
      todasSucursalesSeleccionadas.value = false
      departamentosFiltrados.value = filtrarElementosDuplicados(filtrarElementos(modelSucursalesSeleccionadas.value, departamentos.value, 'claveSucursal'), 'claveDepartamento')
      break
    case 'TODOSDEPARTAMENTOS':
      todosDepartamentosSeleccionados.value = true
      modelDepartamentosSeleccionados.value = []
      break
    case 'OPCIONESDEPARTAMENTOS':
      todosDepartamentosSeleccionados.value = false
      break
    case 'TODOSTIPORAMO':
      todosTipoRamoSeleccionados.value = true
      tiposRamoSeleccionados.value = []
      break
    case 'OPCIONESTIPORAMO':
      todosTipoRamoSeleccionados.value = false
      break
    case 'TODOSTIPORIESGO':
      todosTipoRiesgoSeleccionados.value = true
      tiposRiesgoSeleccionados.value = []
      break
    case 'OPCIONESRIESGO':
      todosTipoRiesgoSeleccionados.value = false
      break
  }

}

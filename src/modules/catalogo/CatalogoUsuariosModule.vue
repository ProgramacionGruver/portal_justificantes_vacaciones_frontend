<template>
  <div class="q-pa-md">
    <h2>Catalogo de Usuarios</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :columns="columns" :rows="catalogoUsuariosFiltrados" :loading="cargando" :filter="buscar"
      no-data-label="No se encontró informacion disponible." loading-label="Buscando información. . . "
      row-key="numero_empleado">
      <template v-slot:top>
        <div class="fit row q-gutter-sm q-mb-sm justify-end">
          <div class="col">
            <q-input outlined dense v-model="buscar" :disable="cargando" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="fit row q-gutter-sm">
          <q-btn-dropdown dense outline class="col q-ma-sm" color="grey" label="Empresas">
            <q-checkbox class="q-pa-md" dense :disable="todasEmpresasSeleccionadas" v-model="todasEmpresasSeleccionadas"
              label="Todas" @update:model-value="filtrar('TODASEMPRESAS')" />
            <q-separator class="q-mx-md bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="empresas" v-model="modelEmpresasSeleccionadas"
              @update:model-value="filtrar('OPCIONESEMPRESAS')" type="checkbox" />
          </q-btn-dropdown>
          <q-btn-dropdown dense outline class="col q-ma-sm " color="grey" label="Sucursales">
            <q-checkbox class="q-pa-md" dense :disable="todasSucursalesSeleccionadas"
              v-model="todasSucursalesSeleccionadas" label="Todas" @update:model-value="filtrar('TODASSUCURSALES')" />
            <q-separator class="q-mx-sm bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="sucursalesFiltradas" v-model="modelSucursalesSeleccionadas"
              @update:model-value="filtrar('OPCIONESSUCURSALES')" type="checkbox" />
          </q-btn-dropdown>
          <q-btn-dropdown dense outline class="col q-ma-sm " color="grey" label="Departamentos">
            <q-checkbox class="q-pa-md" dense :disable="todosDepartamentosSeleccionados"
              v-model="todosDepartamentosSeleccionados" label="Todos"
              @update:model-value="filtrar('TODOSDEPARTAMENTOS')" />
            <q-separator class="q-mx-sm bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="departamentosFiltrados"
              v-model="modelDepartamentosSeleccionados" @update:model-value="filtrar('OPCIONESDEPARTAMENTOS')"
              type="checkbox" />
          </q-btn-dropdown>
        </div>
        <div class="fit row q-gutter-sm">

          <q-btn-dropdown dense outline class="col q-ma-sm" color="grey" label="Estatus">
            <q-checkbox class="q-pa-md" dense :disable="todosEstatusActividadSeleccionados"
              v-model="todosEstatusActividadSeleccionados" label="Todas"
              @update:model-value="filtrar('TODOSESTATUSACTIVIDAD')" />
            <q-separator class="q-mx-md bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="estatusActividadFiltrados"
              v-model="modelEstatusActividadSeleccionados" @update:model-value="filtrar('OPCIONESESTATUSACTIVIDAD')"
              type="checkbox" />
          </q-btn-dropdown>

          <q-btn-dropdown dense outline class="col q-ma-sm" color="grey" label="Horario Lunes - Viernes">
            <q-checkbox class="q-pa-md" dense :disable="todosTurnosLunesViernesSeleccionados"
              v-model="todosTurnosLunesViernesSeleccionados" label="Todas"
              @update:model-value="filtrar('TODOSTURNOSLUNESVIERNES')" />
            <q-separator class="q-mx-md bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="turnosLunesViernesFiltrados"
              v-model="modelTurnosLunesViernesSeleccionados" @update:model-value="filtrar('OPCIONESTURNOSLUNESVIERNES')"
              type="checkbox" />
          </q-btn-dropdown>

          <q-btn-dropdown dense outline class="col q-ma-sm" color="grey" label="Horario Sábados">
            <q-checkbox class="q-pa-md" dense :disable="todosTurnosSabadosSeleccionados"
              v-model="todosTurnosSabadosSeleccionados" label="Todas"
              @update:model-value="filtrar('TODOSTURNOSSABADOS')" />
            <q-separator class="q-mx-md bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="turnosSabadosFiltrados"
              v-model="modelTurnosSabadosSeleccionados" @update:model-value="filtrar('OPCIONESTURNOSSABADOS')"
              type="checkbox" />
          </q-btn-dropdown>
        </div>
      </template>
      <template v-slot:body-cell-estatus="props">
        <div style="padding-top: 1rem;">
          <q-chip class="text-white" unelevated rounded :color="colorEstatus(props.row.estatus)"
            :label="nombreEstatus(props.row.estatus)" />
        </div>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td>
          <q-btn v-if="permisoEditar" flat color="primary" icon="edit" @click="editarCatalogo(props.row)">
            <q-tooltip>
              Editar
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <modal-catalogo-usuarios ref="modalCatalogo"></modal-catalogo-usuarios>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { formatearFecha } from 'src/helpers/formatearFecha'
import { useEmpresasStore } from 'src/stores/empresas'
import { useSucursalesStore } from 'src/stores/sucursales'
import { useDepartamentosStore } from 'src/stores/departamentos'
import { useCatalogosStore } from 'src/stores/catalogos.js'
import { useAutenticacionStore } from "src/stores/autenticaciones"
import ModalCatalogoUsuarios from 'src/components/ModalCatalogoUsuarios.vue'
import { filtrarOpcionesCatalogoUsuarios, filtrarElementosPorEmpresaSucursalDepartamento, filtrarElementos } from 'src/helpers/filtros'

export default {
  components: {
    ModalCatalogoUsuarios
  },
  setup() {
    const useEmpresas = useEmpresasStore()
    const { primeraCarga, empresas, listaClavesEmpresas, empresasFiltradas, modelEmpresasSeleccionadas, todasEmpresasSeleccionadas } = storeToRefs(useEmpresas)
    const { obtenerEmpresas } = useEmpresas

    const useSucursales = useSucursalesStore()
    const { listaClavesSucursales, sucursales, sucursalesFiltradas, modelSucursalesSeleccionadas, todasSucursalesSeleccionadas } = storeToRefs(useSucursales)
    const { obtenerSucursales } = useSucursales

    const useDepartamentos = useDepartamentosStore()
    const { listaClavesDepartamentos, departamentos, departamentosFiltrados, modelDepartamentosSeleccionados, todosDepartamentosSeleccionados } = storeToRefs(useDepartamentos)
    const { obtenerDepartamentos } = useDepartamentos

    const useCatalogos = useCatalogosStore()
    const { obtenerCatalogoUsuarios, obtenerCatalogoTurnos } = useCatalogos
    const { catalogoUsuarios,
      catalogoUsuariosFiltrados,
      estatusActividad,
      estatusActividadFiltrados,
      modelEstatusActividadSeleccionados,
      listaEstatusActividad,
      todosEstatusActividadSeleccionados,
      turnosLunesViernes,
      turnosLunesViernesFiltrados,
      modelTurnosLunesViernesSeleccionados,
      listaTurnosLunesViernes,
      todosTurnosLunesViernesSeleccionados,
      turnosSabados,
      turnosSabadosFiltrados,
      modelTurnosSabadosSeleccionados,
      listaTurnosSabados,
      todosTurnosSabadosSeleccionados,
      opcionesTurnos
    } = storeToRefs(useCatalogos)

    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado }= storeToRefs(useAutenticacion)

    const cargando = ref(false)
    const modalCatalogo = ref(null)
    const permisoEditar = ref(false)

    const columns = [
      {
        name: "numero_empleado",
        label: "Numero Empleado",
        align: "left",
        field: "numero_empleado",
        sortable: true
      },
      {
        name: "nombre",
        label: "Nombre",
        align: "left",
        field: "nombre",
        sortable: true
      },
      {
        name: "puesto",
        label: "Puesto",
        align: "left",
        field: "puesto",
        sortable: true
      },
      {
        name: "fechaAlta",
        label: "Fecha Ingreso",
        align: "left",
        field: (row) => formatearFecha(row.fechaAlta),
        sortable: true
      },
      {
        name: "estatus",
        label: "Estatus",
        align: "left",
        field: "estatus",
        sortable: true
      },
      {
        name: "aniosLaborados",
        label: "Años en la empresa",
        align: "left",
        field: "aniosLaborados",
        sortable: true
      },
      {
        name: "diasVacacionesLey",
        label: "Vacaciones",
        align: "left",
        field: "diasVacacionesLey",
        sortable: true
      },
      {
        name: "diasVacacionesRestantes",
        label: "Vacaciones Restantes",
        align: "left",
        field: "diasVacacionesRestantes",
        sortable: true
      },
      {
        name: "diasEconomicosLey",
        label: "Días Economicos",
        align: "left",
        field: "diasEconomicosLey",
        sortable: true
      },
      {
        name: "diasEconomicosRestantes",
        label: "Días Economicos Restantes",
        align: "left",
        field: "diasEconomicosRestantes",
        sortable: true
      },
      {
        name: "diasGanados",
        label: "Días Ganados",
        align: "left",
        field: "diasGanados",
        sortable: true
      },
      {
        name: "sabados5s",
        label: "Sabados 5s",
        align: "left",
        field: "sabados5s",
        sortable: true
      },
      {
        name: "vacacionesVencidas",
        label: "Días Vacaciones Vencidos",
        align: "left",
        field: "vacacionesVencidas",
        sortable: true
      },
      {
        name: "turnoLunesViernes",
        label: "Turno Lunes-Viernes",
        align: "left",
        field: "turnoLunesViernes",
        sortable: true
      },
      {
        name: "turnoSabados",
        label: "Turno Sabados",
        align: "left",
        field: "turnoSabados",
        sortable: true
      },
      {
        name: "acciones",
        align: "left",
        field: "acciones",
      },
    ]

    onMounted(async () => {
      try{
        cargando.value = true
        if(primeraCarga.value){
          primeraCarga.value = false
          await obtenerEmpresas()
          await obtenerSucursales()
          await obtenerDepartamentos()
        }
        await obtenerCatalogoUsuarios()
        await obtenerCatalogoTurnos()
        await filtrar('TODASEMPRESAS')
        permisoEditar.value = usuarioAutenticado.value.modulos.some(modulo => modulo.idModulo === 56 && modulo.actualizar === true)
      }catch{

      }finally{
        cargando.value = false
      }
    })

    const editarCatalogo = (catalogoObj) => {
      modalCatalogo.value.abrir(catalogoObj)
    }

    const nombreEstatus = (estado) => {
      if (estado === true) {
        return 'Activo';
      } else {
        return 'Baja';
      }
    }

    const colorEstatus = (estado) => {
      if (estado === true) {
        return 'green';
      } else {
        return 'red';
      }
    }

    const filtrar = async(tipoFiltro) => {

      // Filtra las opciones según (empresa, sucursal, departamento) (NO FILTRA INFORMACION)
      filtrarOpcionesCatalogoUsuarios(tipoFiltro,
        listaClavesEmpresas, todasEmpresasSeleccionadas, modelEmpresasSeleccionadas,
        sucursales, sucursalesFiltradas, listaClavesSucursales, todasSucursalesSeleccionadas, modelSucursalesSeleccionadas,
        departamentos, departamentosFiltrados, listaClavesDepartamentos, todosDepartamentosSeleccionados, modelDepartamentosSeleccionados,
        todosEstatusActividadSeleccionados, modelEstatusActividadSeleccionados, todosTurnosLunesViernesSeleccionados, modelTurnosLunesViernesSeleccionados,
        todosTurnosSabadosSeleccionados, modelTurnosSabadosSeleccionados
      )

      //Filtrar los datos segun las opciones seleccionadas
      filtrarDatos()
    }

    // Filtrar los datos segun las opciones seleccionadas
    const filtrarDatos = () => {
      filtrarElementosPorEmpresaSucursalDepartamento(catalogoUsuarios, catalogoUsuariosFiltrados,
        todasEmpresasSeleccionadas, listaClavesEmpresas, modelEmpresasSeleccionadas,
        todasSucursalesSeleccionadas, listaClavesSucursales, modelSucursalesSeleccionadas,
        todosDepartamentosSeleccionados, listaClavesDepartamentos, modelDepartamentosSeleccionados)

      // Filtra según el estatus
      catalogoUsuariosFiltrados.value = todosEstatusActividadSeleccionados.value ?
        filtrarElementos(listaEstatusActividad.value, catalogoUsuariosFiltrados.value, 'estatus')
        : filtrarElementos(modelEstatusActividadSeleccionados.value, catalogoUsuariosFiltrados.value, 'estatus')

      // Filtra según el turno L-V
      catalogoUsuariosFiltrados.value = todosTurnosLunesViernesSeleccionados.value ?
        filtrarElementos(listaTurnosLunesViernes.value, catalogoUsuariosFiltrados.value, 'turnoLunesViernes')
        : filtrarElementos(modelTurnosLunesViernesSeleccionados.value, catalogoUsuariosFiltrados.value, 'turnoLunesViernes')

      // Filtra según el turno sabAdos
      catalogoUsuariosFiltrados.value = todosTurnosSabadosSeleccionados.value ?
        filtrarElementos(listaTurnosSabados.value, catalogoUsuariosFiltrados.value, 'turnoSabados')
        : filtrarElementos(modelTurnosSabadosSeleccionados.value, catalogoUsuariosFiltrados.value, 'turnoSabados')

    }


    return {
      buscar: ref(''),
      columns,
      cargando,
      catalogoUsuariosFiltrados,
      editarCatalogo,
      modalCatalogo,
      nombreEstatus,
      colorEstatus,
      filtrar,
      empresas,
      empresasFiltradas,
      modelEmpresasSeleccionadas,
      todasEmpresasSeleccionadas,
      sucursalesFiltradas,
      modelSucursalesSeleccionadas,
      todasSucursalesSeleccionadas,
      departamentosFiltrados,
      modelDepartamentosSeleccionados,
      todosDepartamentosSeleccionados,
      estatusActividad,
      estatusActividadFiltrados,
      modelEstatusActividadSeleccionados,
      listaEstatusActividad,
      todosEstatusActividadSeleccionados,
      turnosLunesViernes,
      turnosLunesViernesFiltrados,
      modelTurnosLunesViernesSeleccionados,
      listaTurnosLunesViernes,
      todosTurnosLunesViernesSeleccionados,
      turnosSabados,
      turnosSabadosFiltrados,
      modelTurnosSabadosSeleccionados,
      listaTurnosSabados,
      todosTurnosSabadosSeleccionados,
      opcionesTurnos,
      permisoEditar
    }
  }
}
</script>

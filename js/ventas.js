let current = null;
$(document).ready(function () {
    lista_ventas();
});
function lista_ventas() {
    $('#tabla-ventas').DataTable().clear().destroy();
    $.post("ws/service.php?parAccion=lista_ventas", function (response) {
        var obj = JSON.parse(response);
        $("#tabla-ventas").find("tbody").empty();
        $.each(obj, function (index, val) {
            $("#tabla-ventas").find("tbody").append(`<tr>
                <td>${val.id}</td>
                <td>${val.fecha}</td>
                <td>${$.trim(val.nombres)}</td>
                <td>${$.trim(val.sucursal)}</td>
                <td>${$.trim(val.monto)}</td>
                <td>${$.trim(val.forma_pago)}</td>
                <td>
                    <span class="btn btn-outline-info btn-sm d-block mb-1" data-toggle="modal" data-target="#formulario" onclick="detalle_venta(${val.id});"><i class="fa fa-eye"></i></span>
                    <span  class="btn btn-outline-danger btn-sm d-block" onclick="eliminar_venta(${val.id});"><i class="fa fa-trash"></i></span>
                </td>
            </tr>`);
        });
        $("#tabla-ventas").DataTable({
            scrollX: true,       // Habilita el desplazamiento horizontal
            autoWidth: false,    // Evita que DataTables ajuste el ancho automáticamente
            responsive: true,    // Permite que la tabla se adapte
            searching: true,     // Habilita el buscador
            paging: true,        // Habilita paginación
            ordering: true,      // Habilita ordenación
            info: true,
            dom: 'Brftip',
            "language": {
                "url": "./js/Spanish.json"
            },
            buttons: [
                'excel'
            ]
        });
    });
}
function detalle_venta(id) {
    $.post("ws/service.php?parAccion=detalle_venta", {
        id: id
    }, function (response) {
        var obj = JSON.parse(response);
        $("#tabla-detalle-venta").find("tbody").empty();
        $.each(obj, function (index, val) {
            $("#tabla-detalle-venta").find("tbody").append(`<tr>
                <td>${val.producto}</td>
                <td>${val.cantidad}</td>
                <td>${val.precio_unitario}</td>
                <td>${val.total}</td>
            </tr>`);
        });
    });
}
function eliminar_venta(id) {
    alertify.confirm('¿Eliminar Producto?', 'Esta acción no se puede deshacer', function () {
        $.post("ws/service.php?parAccion=eliminar_venta", {
            id: id
        }, function (response) {
            var obj = JSON.parse(response);
            if (obj.Result == "OK") {
                alertify.success("Se eliminó correctamente.");
                lista_ventas();
            } else {
                alertify.error("Algo ha salido terriblemente mal.");
            }
        });
    }, function () {
        alertify.error('Cancel')
    });
}
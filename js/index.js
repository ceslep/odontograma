'use strict';

var dientesSeleccionados = [];
var ddataArray = [];
var indiceDiente;
var indiceDiente;
var enfermedadDienteText;

jQuery.fn.serializeObject = function () {
    var formData = {};
    var formArray = this.serializeArray();
  
    for(var i = 0, n = formArray.length; i < n; ++i)
      formData[formArray[i].name] = formArray[i].value;
  
    return formData;
  };
  
  
var server = location.href.indexOf("5500") > 0 ? "http://127.0.0.1/adoweb/php/" : "php/";


class DienteSeleccionado {
    enfermedad;
    info;
    diente;
    constructor(enfermedad, info, diente) {
        this.enfermedad = enfermedad;
        this.info = info;
        this.diente = diente;
    }
    getInfoDiente() {
        return {
            enfermedad: this.enfermedad,
            info: this.info,
            diente: this.diente
        }
    }

}

class Ddata {
    text;
    value;
    selected;
    description;
    imageSrc;
    constructor(text, value, selected, description, imageSrc) {
        this.text = text;
        this.value = value;
        this.selected = selected;
        this.description = description;
        this.imageSrc = imageSrc;
    }

    getDdataObj() {
        return {
            text: this.text,
            value: this.value,
            selected: this.selected,
            description: this.description,
            imageSrc: this.imageSrc
        }
    }
};
$(document).ready(_ => {



    const generateDientes = async (diente, enfermedad) => {

        let html = "";
        var imagenes = 32;
        ddataArray = [];


        let s = enfermedad.substring(enfermedad.length - 1, enfermedad.length);
        imagenes = s == 's' ? 32 : 2;

        for (let i = 0; i < imagenes; i++) {

            let selected = false;
            if (i == 0) selected = true;
            let ddata = new Ddata(diente, diente, selected, diente, `dientesOdontograma/${enfermedad}/${i}.png`);
            ddataArray.push(ddata.getDdataObj());

        }

        return ddataArray;

    }

    const listaDientes = async e => {
        let html = "";

        dientesSeleccionados.forEach(dienteSeleccionado => {
            let enfermedadText;
            $("#tipoEnfermedadDiente > option").each((i, k) => {
                if ($(k).val() == dienteSeleccionado.enfermedad) {
                    enfermedadText = $(k).text();
                    return false;

                }

            });

            html += `
                                    <tr>
                                        <td class="text-center">
                                            ${enfermedadText}
                                        </td>
                                        <td class="text-center">
                                            ${dienteSeleccionado.diente}
                                        </td>
                                        <td class="text-center">
                                        ${dienteSeleccionado.info.imageSrc}
                                        </td>
                                            
                                        <td class="text-center">
                                        <button data-diente="${dienteSeleccionado.diente}" type="button" class="btn btn-danger borrarDiente"><i class="fas fa-trash">&nbsp;</i></button>
                                        </td
                                    </tr>
                                   `;
        });
        $("#tbde").empty().html(html);

    }

    const selectDientes = async enfermedad => {

        var ddataA = [];
        await $("[id^=diente]").each(async (i, k) => {

            let id = $(k).attr("id");
            let diente = id.substring(6, 8);
            indiceDiente = dientesSeleccionados.findIndex(Diente => Diente.diente == diente);
            if (indiceDiente == -1) {
                $(k).ddslick('destroy');
                let ddata = [];
                ddata = await generateDientes(diente, enfermedad);
                ddataA.push(ddata);
            }
        });

        await $("[id^=diente]").each(async (i, k) => {
            let id = $(k).attr("id");
            let diente = id.substring(6, 8);
            indiceDiente = dientesSeleccionados.findIndex(Diente => Diente.diente == diente);
            if (indiceDiente == -1) {
                await $(k).ddslick({
                    data: ddataA[i],
                    width: 65,
                    onSelected: async selectedData => {

                        indiceDiente = dientesSeleccionados.findIndex(Diente => Diente.diente == diente);
                        if (selectedData.selectedData.imageSrc.indexOf('0.png') < 0) {
                            indiceDiente = dientesSeleccionados.findIndex(Diente => Diente.diente == selectedData.selectedData.text);
                            let dienteSeleccionado = new DienteSeleccionado(enfermedad, selectedData.selectedData, diente);
                            if (indiceDiente == -1)
                                dientesSeleccionados.push(dienteSeleccionado)
                            else
                                dientesSeleccionados[indiceDiente] = dienteSeleccionado;
                            console.table(dientesSeleccionados);


                        }
                        await listaDientes();
                    }
                });
            }
        });

    }

    $("#tipoEnfermedadDiente").change(e => {


        let enfermedad = $('#tipoEnfermedadDiente option:selected').val();
        enfermedadDienteText = $('#tipoEnfermedadDiente option:selected').text();

        selectDientes(enfermedad);
    });

    $("#tipoEnfermedadDiente").change();



    $(".borraDiente").click(async e => {
        e.preventDefault();
        let selDiente = $(e.currentTarget).parent().prev();
        console.log(selDiente);
        Swal.fire({
            title: 'Está seguro de eliminar éste diente?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si!'
        }).then(async (result) => {

            $(selDiente).ddslick('select', { index: 0 });
            let diente = $(e.currentTarget).text().trim();
            dientesSeleccionados = dientesSeleccionados.filter(dienteSeleccionado => {
                return dienteSeleccionado.diente != diente;
            });
            await listaDientes();
            if (result.isConfirmed) {
                Swal.fire(
                    'Borrado!',
                    'El diente ha sido Eliminado.',
                    'success'
                )
            }

        })

    });


    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })


    $("#btnGuardarOdontograma").click(async e => {
        e.preventDefault();
        if (dientesSeleccionados.length == 0) {
            swal.fire({
                icon: 'warning',
                title: 'No se encontraron datos que guardar.',
            })
            return false;
        }
        $("#dgear1").removeClass("d-none");
        Toast.fire({
            icon: 'success',
            title: 'Guardando odontograma, espere por favor...',
        })

        let response = await fetch(server + "guardaOdontograma.php", {
            method: "POST",
            body: JSON.stringify({ enfermedades: dientesSeleccionados }),
            headers: { "Content-Type": "application/json" },
            mode: "cors"
        });
        let datosOdontograma = await response.json();
        console.log(datosOdontograma);
        Swal.close();
        if (datosOdontograma.Estado == "Ok") Swal.fire(datosOdontograma.info)
        $("#dgear1").addClass("d-none");

    });

    $(document).on("click", ".borrarDiente", async e => {
        e.preventDefault();
        let diente = $(e.currentTarget).data("diente");
        console.log(diente);
        let selDiente = `#diente${diente}-dd-placeholder`;
        selDiente = $(selDiente);
        console.log(selDiente);
        Swal.fire({
            title: 'Está seguro de eliminar éste diente?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si!'
        }).then(async result => {

            $(selDiente).ddslick('select', { index: 0 });

            dientesSeleccionados = dientesSeleccionados.filter(dienteSeleccionado => {
                return dienteSeleccionado.diente != diente;
            });
            await listaDientes();
            if (result.isConfirmed) {
                Swal.fire(
                    'Borrado!',
                    'El diente ha sido Eliminado.',
                    'success'
                )
            }
        })


    });

    $("#btnCargarOdontograma").click(async e => {
        e.preventDefault();
        $("#dgear2").removeClass("d-none");
        let response = await fetch(server + "getOdontograma.php", {
            method: "POST",
            body: JSON.stringify({ paciente: "3000" }),
            headers: { "Content-Type": "application/json" },
            mode: "cors"
        });
        let datos = await response.json();
        console.log(JSON.parse(datos[0].datos));
        dientesSeleccionados = JSON.parse(datos[0].datos);
        dientesSeleccionados.forEach(diente => {
            let selDiente = $(`#diente${diente.diente}-dd-placeholder`);
            $(selDiente).ddslick('destroy');
            selDiente = $(`#diente${diente.diente}`);
            $(selDiente).empty().html(`<img src="${diente.info.imageSrc}" class="img-fluid">`);

        });
        await listaDientes();
        $("#dgear2").addClass("d-none");
    });

    const gePaises = (async _ => {
        let response = await fetch("json/countries.json", {
            mode: "no-cors",
            headers: {
                "Content-Type": "application.json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        let paises = await response.json();
        console.log(paises);
        let html = "<option value=></option>";
        paises.countries.forEach(country => {
            html += `<option value="${country.id}">${country.name}</option>`;
        });

        $("#pais").html(html).select2();
    })();

    $("#pais").change(async e => {
        let pais = $("#pais option:selected").val();
        let response = await fetch("json/states.json", {
            mode: "no-cors",
            headers: {
                "Content-Type": "application.json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        let estados = await response.json();
       
        let html = "<option value></option>";
        await estados.states.filter(estado=>{return estado.id_country==pais}).forEach(estado=>{
            html += `<option value="${estado.id}">${estado.name}</option>`;
        });
        $(".depto").html(html).select2();
    });

    $(".depto").change(async e => {
        let estado = $("#estado option:selected").val();
        let municipio=$(e.currentTarget).data("municipio");
        console.log(municipio);
        let response = await fetch("json/cities.json", {
            mode: "no-cors",
            headers: {
                "Content-Type": "application.json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        let ciudades = await response.json();
        ciudades=ciudades.cities.filter(ciudad=>{return ciudad.id_state==estado});
        console.log(ciudades);
        let html = "<option value></option>";
        ciudades.forEach(ciudad=>{
            html += `<option value="${ciudad.id}">${ciudad.name}</option>`;
        });
        $(municipio).html(html).select2();
    });

    $("select").select2();

    $("#guardaConsultaInicial").click(e=>{
        e.preventDefault();
        let obj=$("#frmConsultaInicial").serializeObject();
        console.log(obj);
        let output="create table consultaInicial ("
        output+="`ind` bigint(20) ,"
        Object.keys(obj).forEach(key=>{
            output+=`${key} varchar(125) default NULL, `;
        });
        output+=")";
        console.log(output);
    })

});
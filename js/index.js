'use strict';

var dientesSeleccionados = [];
var ddataArray = [];
var indiceDiente;
var indiceDiente;
var enfermedadDienteText;


var server=location.href.indexOf("5500")>0?"http://127.0.0.1/adoweb/php/":"php/";


class DienteSeleccionado{
    enfermedad;
    info;
    diente;
    constructor(enfermedad,info,diente){
        this.enfermedad=enfermedad;
        this.info=info;
        this.diente=diente;
    }
    getInfoDiente(){
        return{
            enfermedad:this.enfermedad,
            info:this.info,
            diente:this.diente
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
        var imagenes=32;
        ddataArray = [];
        
        
        let s=enfermedad.substring(enfermedad.length-1,enfermedad.length);
        imagenes=s=='s'?32:2;
        
        for (let i = 0; i < imagenes; i++) {
          
            let selected=false;
            if (i==0) selected=true;
            let ddata = new Ddata(diente, diente, selected, diente, `dientesOdontograma/${enfermedad}/${i}.png`);
            ddataArray.push(ddata.getDdataObj());

        }
      
        return ddataArray;

    }
    const selectDientes = async enfermedad => {

        var ddataA=[];
        await $("[id^=diente]").each(async (i, k) => {
            
            let id = $(k).attr("id");
            let diente = id.substring(6, 8);
            indiceDiente = dientesSeleccionados.findIndex(Diente => Diente.diente==diente);
            if (indiceDiente==-1){
            $(k).ddslick('destroy');
            let ddata=[];
            ddata = await generateDientes(diente, enfermedad);
            ddataA.push(ddata);
            }
        });   

          await $("[id^=diente]").each(async (i, k) => {
                let id = $(k).attr("id");
                let diente = id.substring(6, 8);
                indiceDiente = dientesSeleccionados.findIndex(Diente => Diente.diente==diente);
                if (indiceDiente==-1){
                await $(k).ddslick({
                    data: ddataA[i],
                    width: 65,
                    onSelected: function (selectedData) {
                     
                        indiceDiente = dientesSeleccionados.findIndex(Diente => Diente.diente==diente);
                        if (selectedData.selectedData.imageSrc.indexOf('0.png')<0){
                            indiceDiente = dientesSeleccionados.findIndex(Diente => Diente.diente==selectedData.selectedData.text);
                            let dienteSeleccionado = new DienteSeleccionado(enfermedad,selectedData.selectedData,diente);
                            if (indiceDiente==-1)
                            dientesSeleccionados.push(dienteSeleccionado)
                            else
                            dientesSeleccionados[indiceDiente]=dienteSeleccionado;
                            console.table(dientesSeleccionados);
                            let html="";
                            $("")
                            dientesSeleccionados.forEach(dienteSeleccionado=>{
                                    let enfermedadText;
                                   $("#tipoEnfermedadDiente > option").each((i,k)=>{
                                       if ($(k).val()==dienteSeleccionado.enfermedad){
                                           enfermedadText=$(k).text();
                                           return false;

                                       }
                                       
                                   });
                                   console.log(dienteSeleccionado);
                                   html+=`
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
                                        <button type="button" class="btn btn-danger"><i class="fas fa-trash">&nbsp;</i></button>
                                        </td
                                    </tr>
                                   `;
                            });
                            $("#tbde").empty().html(html);

                            
                        }

                    }
                });
            }
            });
            
    }

    $("#tipoEnfermedadDiente").change(e => {
     

        let enfermedad = $('#tipoEnfermedadDiente option:selected').val();
        enfermedadDienteText =$('#tipoEnfermedadDiente option:selected').text();

        selectDientes(enfermedad);
    });

    $("#tipoEnfermedadDiente").change();



   $(".borraDiente").click(e=>{
       e.preventDefault();
       let selDiente=$(e.currentTarget).parent().prev();
        Swal.fire({
        title: 'Está seguro de eliminar éste diente?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si!'
      }).then((result) => {
     
        $(selDiente).ddslick('select', {index: 0 });
        let diente=$(e.currentTarget).text().trim();
        dientesSeleccionados=dientesSeleccionados.filter(dienteSeleccionado=>{
            return dienteSeleccionado.diente!=diente;
        });
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
  

   $("#btnGuardarOdontograma").click(async e=>{
       e.preventDefault();
       Toast.fire({
        icon: 'success',
        title: 'Guardando odontograma, espere por favor...',
      })
      
       let response = await fetch(server+"guardaOdontograma.php",{
           method:"POST",
           body:JSON.stringify({enfermedades:dientesSeleccionados}),
           headers:{"Content-Type":"application/json"},
           mode:"cors"
       });
       let datosOdontograma = await response.json();
       console.log(datosOdontograma);
       Swal.close();
       if (datosOdontograma.Estado=="Ok") Swal.fire(datosOdontograma.info)

       
   });

});
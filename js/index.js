'use strict';

var dientesSeleccionados = [];
var ddataArray = [];
var indiceDiente;
var indiceDiente;

$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

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
                            console.log(JSON.stringify(dientesSeleccionados));
                            
                        }

                    }
                });
            }
            });
            
    }

    $("#tipoEnfermedadDiente").change(e => {
     

        let enfermedad = $('#tipoEnfermedadDiente option:selected').val();


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

});
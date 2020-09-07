

let dientesSeleccionados=[];
$(document).ready(_ => {



    const generateDientes = async (diente,enfermedad) => {
 
        let html = "";
        console.log(enfermedad);
        for (let i = 0; i < 32; i++) {
            html += ` <option value="${i}" data-imagesrc="dientesOdontograma/${enfermedad}/${i}.png"
        data-description="${diente}">${diente}</option>`;

        }
        return html;
    }
    const selectDientes = enfermedad => {


        

        $("[id^=d]").each(async (i, k) => {
            await $(k).ddslick('destroy');
            $(k).empty();
            let id = $(k).attr("id");
            let diente = $(k).parent().data("diente");
            let html = await generateDientes(diente,enfermedad);
            console.log(html);
            return false;
            await $(k).empty().html(html).ddslick({
                width: 90,
                imagePosition: "left",
                selectedText: diente,
                onSelected: function (data) {

                 
                 //   dientesSeleccionados.push(diente);
                //    window.location.hash = `#${id}`;
                 
                }

            });
        });
        

    };

    selectDientes("resina");


    setTimeout(_=>{
        $(".dd-select").css("background", "white");
        $(".dd-select").css("color", "black");
    },1000);

    

    $(".dd-selected").each((i, k) => {
        let parent = $(k).parent().parent().parent();
        let diente = $(parent).data("diente");

        let span = `<span class="dnt">${diente}</span>`;

        $(k).append(span);
    });

    $("#tipoEnfermedadDiente").change(e=>{
        console.clear();
        let enfermedad=$('#tipoEnfermedadDiente option:selected').val();
        selectDientes(enfermedad);
    });

});
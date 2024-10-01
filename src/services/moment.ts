


import moment from 'moment-timezone';


export const configMoment = ()=>{
    const now = moment.tz("America/Sao_Paulo");

    function dataHoraAtual(){
        const formattedDate = now.format("YYYY-MM-DD HH:mm:ss"); // Usa HH para 24 horas
         return formattedDate;
    }

    function dataAtual(){
        const formattedDate = now.format("YYYY-MM-DD"); // Usa HH para 24 horas
         return formattedDate;
    }

    function formatarData( data:string ){
        let aux = moment.tz(data, "America/Sao_Paulo").format("YYYY-MM-DD");
        return aux;
    }
   
    function formatarDataHora(data: string) {
        // Tenta analisar a data no fuso horário de São Paulo
        let aux = moment.tz(data, "America/Sao_Paulo");
        // Verifica se a data foi válida
        if (!aux.isValid()) {
            console.log("Data inválida");
        }
        // Formata a data e hora no formato desejado
        return aux.format("YYYY-MM-DD HH:mm:ss");
    }

    return { dataAtual, dataHoraAtual, formatarData, formatarDataHora }
}
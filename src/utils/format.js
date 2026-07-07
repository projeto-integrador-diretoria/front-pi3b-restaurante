/**
 * Utilitários de formatação de dados vindos da API.
 *
 * A API serializa valores monetários como número (BigDecimal → number/string)
 * e datas como LocalDateTime no formato ISO sem fuso (ex: "2026-07-03T20:15:30").
 */

const moedaBRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

/**
 * Formata um valor monetário para o padrão brasileiro (R$ 12,50).
 * Aceita number ou string — trata null/undefined como zero.
 */
export function formatarMoeda(valor) {
    const numero = Number(valor);
    return moedaBRL.format(Number.isFinite(numero) ? numero : 0);
}

const dataHoraBR = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});

/**
 * Formata uma data ISO para "03/07 20:15".
 * Retorna string vazia quando a data é inválida.
 */
export function formatarDataHora(isoString) {
    if (!isoString) return '';
    const data = new Date(isoString);
    if (Number.isNaN(data.getTime())) return '';
    return dataHoraBR.format(data);
}

/**
 * Retorna uma descrição relativa amigável ("agora", "há 5 min", "há 2 h").
 * Cai para a data/hora absoluta quando passa de um dia.
 */
export function formatarTempoRelativo(isoString) {
    if (!isoString) return '';
    const data = new Date(isoString);
    if (Number.isNaN(data.getTime())) return '';

    const segundos = Math.floor((Date.now() - data.getTime()) / 1000);

    if (segundos < 60) return 'agora';
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `há ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `há ${horas} h`;
    return formatarDataHora(isoString);
}

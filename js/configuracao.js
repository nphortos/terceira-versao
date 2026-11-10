// Informações públicas da loja. Altere os valores aqui para atualizar as páginas e o assistente.
const CONFIG = {
    whatsapp: '5547997008349',
    pixKey: '47997008349',
    email: 'contaporton@gmail.com',
    feedbackUrl: 'https://forms.gle/PtTE7f4KT2TNKk5i9',
    atendimento: { dias: 'todos os dias', inicio: '11h', fim: '18h' },
    retirada: { local: 'IFC Campus Sombrio', inicio: '19h', fim: '22h' },
    entregaSombrio: 10,
    antecedenciaDias: 15,
    sinalPercentual: 50,
    prazoNatal: '1º de dezembro de 2026'
};

function validarConfiguracao() {
    const fail = field => { throw new Error('js/configuracao.js: confira o campo ' + field + '.'); };
    if (typeof CONFIG.whatsapp !== 'string' || !/^\d{12,13}$/.test(CONFIG.whatsapp)) fail('whatsapp');
    if (typeof CONFIG.pixKey !== 'string' || !CONFIG.pixKey.trim()) fail('pixKey');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(CONFIG.email)) fail('email');
    let feedbackValido = false;
    try {
        const address = new URL(CONFIG.feedbackUrl);
        feedbackValido = typeof CONFIG.feedbackUrl === 'string' && address.protocol === 'https:' && !!address.hostname;
    } catch {}
    if (!feedbackValido) fail('feedbackUrl');
    if (!Number.isFinite(CONFIG.entregaSombrio) || CONFIG.entregaSombrio < 0) fail('entregaSombrio');
    if (!Number.isInteger(CONFIG.antecedenciaDias) || CONFIG.antecedenciaDias < 0) fail('antecedenciaDias');
    if (!Number.isFinite(CONFIG.sinalPercentual) || CONFIG.sinalPercentual <= 0 || CONFIG.sinalPercentual >= 100 || Number(CONFIG.sinalPercentual.toFixed(2)) !== CONFIG.sinalPercentual) fail('sinalPercentual');
    for (const [name, value] of Object.entries({ 'atendimento.dias': CONFIG.atendimento?.dias, 'retirada.local': CONFIG.retirada?.local, prazoNatal: CONFIG.prazoNatal })) {
        if (typeof value !== 'string' || !value.trim()) fail(name);
    }
    for (const group of ['atendimento', 'retirada']) {
        for (const field of ['inicio', 'fim']) {
            if (!/^(?:[01]?\d|2[0-3])h(?:[0-5]\d)?$/.test(CONFIG[group]?.[field])) fail(group + '.' + field);
        }
    }
}

validarConfiguracao();

// Os marcadores permitem compartilhar os mesmos dados sem mudar o tom dos textos.
function textoMarca(template, html = false) {
    const telefone = CONFIG.whatsapp.replace(/^55/, '');
    const percentual = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '%';
    const values = {
        atendimentoDias: CONFIG.atendimento.dias,
        atendimentoHorario: `das ${CONFIG.atendimento.inicio} às ${CONFIG.atendimento.fim}`,
        retiradaLocal: CONFIG.retirada.local,
        retiradaHorario: `das ${CONFIG.retirada.inicio} às ${CONFIG.retirada.fim}`,
        entregaSombrio: CONFIG.entregaSombrio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\u00a0/g, ' '),
        antecedencia: `${CONFIG.antecedenciaDias} dias`,
        sinal: percentual(CONFIG.sinalPercentual),
        saldo: percentual(100 - CONFIG.sinalPercentual),
        prazoNatal: CONFIG.prazoNatal,
        whatsappRotulo: `WhatsApp (${telefone.slice(0, 2)}) ${telefone.slice(2, -4)}-${telefone.slice(-4)}`
    };
    return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) => {
        if (!Object.prototype.hasOwnProperty.call(values, key)) throw new Error('Marcador de configuração desconhecido: ' + key);
        const value = String(values[key]);
        return html ? value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]) : value;
    });
}

function htmlMarca(template) {
    return textoMarca(template, true);
}

// Textos de cuidados compartilhados entre os produtos, as informações e o assistente.
const cookieWarmingDescription = 'Para um cookie mais crocante, aqueça na air fryer preaquecida a 180 °C por 1 minuto. Prefere mais macio? Leve ao micro-ondas por 30 segundos. Retire toda a embalagem e ajuste o tempo conforme o aparelho. Em cookies decorados, a cobertura pode derreter e perder a textura ao aquecer. Antes de esquentar, que tal fotografar seu cookie? Assim, você guarda cada detalhe e depois aproveita essa delícia quentinha! Aquecer não altera o prazo de validade.';
const cookieCareDescription = 'Para aproveitar todo o frescor, recomendamos consumir seu cookie nos primeiros 5 dias, contados a partir do dia seguinte à entrega, sempre respeitando a validade informada na embalagem. ' + cookieWarmingDescription;
const deliveryDescription = textoMarca("Em Sombrio, a retirada no {{retiradaLocal}} é gratuita, {{retiradaHorario}}, mediante agendamento. A entrega em domicílio custa {{entregaSombrio}}. Para Blumenau, consulte as datas, a disponibilidade e o valor da entrega no orçamento. Outros horários de entrega podem ser combinados com a equipe.");
const allergenDescription = 'Contém trigo, leite, ovos, derivados de soja, glúten e lactose. Não indicado para pessoas alérgicas devido ao risco de contaminação cruzada.';

// O servidor usa a mesma configuração pública do navegador.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, textoMarca, htmlMarca, cookieWarmingDescription, cookieCareDescription, deliveryDescription, allergenDescription };
}

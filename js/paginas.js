// Apresentação das páginas e componentes.
// Estas funções usam os dados e utilitários de script.js quando são chamadas.
// A carga deste arquivo apenas declara funções; a inicialização fica em script.js.

// Estado de erro reutilizado nas rotas inexistentes.
function errorPage() {
    return `<main class="page site-error-page"><div class="site-error-content"><span class="site-error-cookie" aria-hidden="true">🍪</span><h1>Ops! Parece que algo saiu do forno antes da hora.</h1><p>Tivemos um pequeno imprevisto por aqui. Que tal tentar novamente? Se precisar, nossa equipe está pronta para ajudar! 🤎</p><div class="site-error-actions"><a class="btn" href="/">Voltar ao início</a><a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener noreferrer">Falar com a NAPORTA ➜</a></div></div></main>`
}

// Componentes compartilhados: cabeçalho, rodapé e ações dos produtos.
function header() {
    return `<header class="header"><a class="logo" href="/"><img class="brand-door-image" src="/assets/logo-porta-oficial.png" alt=""><img class="brand-wordmark-image" src="/assets/logo-nome-oficial.png" alt="NAPORTA — Culinária com Afeto"></a><nav><a href="/">Início</a><a href="/cardapio">Cardápio</a><a href="/sobre">Sobre</a><a href="/contato">Contato</a></nav><div class="icons"><a class="cart-floral-link" title="Carrinho" aria-label="Carrinho" href="/carrinho"><img class="cart-floral-icon" src="/assets/icone-carrinho-flores.png" alt="" aria-hidden="true"> <small class="cart-floral-count" aria-label="${count()} produtos no carrinho">${count()}</small></a></div></header>`
}

function footer() {
    return `<div class="footer-wrap"><footer class="footer footer-new">
<div class="footer-links"><h4>Explore</h4><a href="/cardapio">Cardápio</a><a href="/sobre">Nossa história</a><a href="/contato">Contato</a></div>
<div class="footer-center"><div class="footer-logo"><img class="footer-brand-image" src="/assets/logo-porta-oficial.png" alt="" loading="lazy" decoding="async"><span>NAPORTA</span><small>CULINÁRIA COM AFETO</small></div><h2>Tem coisa boa na porta. <em>Feita com afeto.</em></h2>
<a class="footer-whatsapp-link" href="https://wa.me/${CONFIG.whatsapp}?text=Ol%C3%A1%2C%20NAPORTA%21%20Gostaria%20de%20falar%20com%20voc%C3%AAs." target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp</a>
<div class="footer-social" aria-label="Redes sociais e contatos"><a href="https://www.instagram.com/com.afeto.nphortos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da NAPORTA" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" class="dot"/></svg></a><a href="mailto:${CONFIG.email}" aria-label="Enviar e-mail à NAPORTA" title="E-mail"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/></svg></a><a href="https://www.linkedin.com/company/115848926/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn da NAPORTA" title="LinkedIn da NAPORTA"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="2"/><path d="M7 10v7M7 7v.2M11 17v-7M11 13c0-2 5-3.3 5 1v3"/></svg></a></div></div>
<div class="footer-links footer-right"><h4>Podemos ajudar?</h4><a href="/faq">Perguntas frequentes</a><a href="/envio">Envios e entregas</a><a href="/contato">Encomendas especiais</a></div>
</footer><div class="footer-legal"><span>© ${new Date().getFullYear()} NAPORTA · Culinária com Afeto</span><nav aria-label="Informações legais"><a href="/termos">Termos de uso</a><a href="/privacidade">Política de privacidade</a><a href="/envio">Informações de envio</a></nav></div></div>`
}

function quoteLink(name, className = 'btn') {
    const message = `Olá, NAPORTA! Gostaria de solicitar um orçamento para o produto ${name}. Poderiam me informar os valores e a disponibilidade?`;
    const url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(message);
    return `<a class="${escapeHtml(className)} quote-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="Solicitar orçamento para ${escapeHtml(name)} pelo WhatsApp">Solicitar orçamento ➜</a>`;
}

function addButton(product, className = '') {
    if (product.available && product.placeholder) return quoteLink(product.name, className || 'btn');
    const label = product.available
        ? `Adicionar ao carrinho · ${money(product.price)}`
        : 'Indisponível no momento';
    return `<button type="button" class="${escapeHtml(className)}" data-add="${escapeHtml(product.id)}"${product.available ? '' : ' disabled'}>${label}</button>`;
}

function productCard(x) {
    return `<article class="product"><a href="/produto/${escapeHtml(x.id)}"><img ${photoAttributes(x.img, '(max-width:900px) 50vw, 280px')} alt="${escapeHtml(x.name)}" loading="lazy" decoding="async"><h3>${escapeHtml(x.name)}</h3></a><div class="product-card-actions"><a class="product-view" href="/produto/${escapeHtml(x.id)}">Ver informações ➜</a>${addButton(x)}</div></article>`
}

// Página inicial e catálogos de presentes, combos e Natal.
function home() {
    return `<main class="home-page"><section class="hero"><div class="hero-content"><h1><span class="hero-title-line">Seu dia merece uma pausa.</span><span class="hero-title-line">E um cookie.</span></h1><p>Receitas caseiras, feitas com ingredientes selecionados e o sabor que transforma o dia.</p><a class="btn" href="/cardapio">Conheça o cardápio ➜</a></div></section><section class="perks perks-three" aria-label="Nossos diferenciais"><div class="perk"><b aria-hidden="true">✦</b><span>Produtos selecionados</span></div><div class="perk"><b class="perk-flower" aria-hidden="true">✿</b><span>Produção artesanal</span></div><div class="perk"><b aria-hidden="true">♡</b><span>Com afeto</span></div></section><section class="section home-featured"><div class="heading home-featured-heading"><div class="home-featured-heading-text"><h2>Os favoritos</h2><p>Uma seleção especial dos sabores mais vendidos para você conhecer.</p></div><a class="home-featured-link" href="/cardapio">Ver cardápio completo</a></div><div class="products">${items.slice(0,4).map(productCard).join('')}</div></section><section class="section"><h2>Cookies para todas as ocasiões</h2>${serviceState !== 'ready' ? serviceStatus() : ''}<div class="services">${services.map(x=>`<article class="service"><a href="/servico/${escapeHtml(x.id)}"><img ${photoAttributes(x.img, '(max-width:600px) calc(100vw - 32px), (max-width:900px) 50vw, 380px')} alt="${escapeHtml(x.title)}" loading="lazy" decoding="async"></a><div class="inner"><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.short)}</p><a class="textlink" href="/servico/${escapeHtml(x.id)}">Saiba mais ➜</a></div></article>`).join('')}</div></section><section class="about about-home-feature"><img ${photoAttributes('assets/espaco-trabalho-com-afeto.webp')} loading="lazy" decoding="async" alt="Notebook com a identidade NAPORTA em um ambiente acolhedor"><div class="inner"><h2>Uma porta aberta para bons momentos.</h2><p>A NAPORTA nasceu do desejo de transformar a rotina em momentos mais doces e significativos. Aqui, cada receita é preparada com ingredientes de verdade, técnicas artesanais e muito carinho, criando sabores que aproximam pessoas e tornam o dia a dia mais especial.</p><a class="btn" href="/sobre">Conheça a nossa história ➜</a></div></section></main>`
}
// Cada serviço usa apenas os itens cadastrados no seu catálogo.
function serviceCatalog(x) {
    const entries = catalogExamples[x.id];
    if (serviceCatalogStates[x.id] !== 'ready') return `<main class="page"><h1>Catálogo de ${escapeHtml(x.title)}</h1>${serviceStatus(x.id)}</main>`;
    const introduction = x.id === 'eventos'
        ? 'Um cardápio pensado com carinho para adoçar seu Natal. Sabores que encantam e presentes que abraçam.'
        : x.id === 'catering'
            ? 'O que é bom pode ficar três vezes melhor. Escolha seu combo favorito para prolongar a pausa, dividir sorrisos e multiplicar o afeto.'
            : 'Presente feito com afeto e embalado com cuidado. Um mimo para agradecer, celebrar ou simplesmente dizer: lembrei de você.';
    return `<main class="page catalog-page"><a class="back" href="/servico/${escapeHtml(x.id)}">← Voltar para ${escapeHtml(x.title)}</a><div class="catalog-intro"><span class="catalog-eyebrow">NAPORTA · CULINÁRIA COM AFETO</span><h1>Catálogo de ${escapeHtml(x.title)}</h1><p>${escapeHtml(introduction)}</p></div><div class="catalog-grid">${entries.map(({name,desc,img},i)=>`<article class="catalog-card"><div class="catalog-photo"><img loading="lazy" decoding="async" ${photoAttributes(img || x.img, '(max-width:600px) calc(100vw - 32px), (max-width:950px) 50vw, 280px')} alt="${escapeHtml(img ? name : `Imagem ilustrativa do item ${i+1}`)}"><span>REFERÊNCIA VISUAL</span></div><div class="catalog-card-copy"><span class="catalog-number">${String(i+1).padStart(2,'0')} / ${String(entries.length).padStart(2,'0')}</span><h2>${escapeHtml(name)}</h2><p>${escapeHtml(desc)}</p><small>Disponibilidade e valores sob consulta</small>${quoteLink(name)}</div></article>`).join('')}</div><div class="catalog-bottom"><h2>Vamos preparar algo especial?</h2><p>Conte para a gente o que você imagina e solicite um orçamento personalizado.</p><a class="btn" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, NAPORTA! Vi o catálogo de '+x.title+' e gostaria de solicitar um orçamento.')}" target="_blank" rel="noopener noreferrer">Fazer orçamento pelo WhatsApp ➜</a></div></main>`
}

// Informações de atendimento, entrega, cuidados e privacidade.
function termsPage() {
    return htmlMarca(`<main class="page legal terms-page"><h1>Termos de uso</h1>
<p><strong>Última atualização:</strong> 01/11/2026.</p>
<p>A NAPORTA é uma produção artesanal feita com carinho. Aqui você encontra as informações para escolher seus doces e combinar sua encomenda com tranquilidade.</p>
<h2>1. Identificação e atendimento</h2>
<p>NAPORTA · Culinária com Afeto. Responsável: Natália Felisberto da Silveira, CPF 059.872.339-09. Endereço: Rua Manoel Monteiro Borges, sem número, bairro Boa Esperança, Sombrio, Santa Catarina, CEP 88960-000.</p>
<p>Para dúvidas, encomendas ou solicitações sobre um pedido, fale com a gente pelo <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a> ou pelo e-mail <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>.</p>
<p>Nosso atendimento funciona {{atendimentoDias}}, {{atendimentoHorario}}. Entregas fora desse horário podem ser combinadas com a equipe, conforme disponibilidade.</p>
<p>Você pode usar o mesmo canal da compra para solicitar ajuda ou cancelamento. Confirmamos o recebimento da mensagem e respondemos em até cinco dias, sem alterar os prazos de reembolso abaixo.</p>
<h2>2. Como o site e os pedidos funcionam</h2>
<p>O carrinho encaminha sua escolha pelo WhatsApp. Antes de pagar, confira os itens, as quantidades, o valor total e a data de entrega ou retirada. Você pode corrigir os dados nesse momento. A encomenda é confirmada após o Pix de {{sinal}}, e os detalhes ficam registrados na conversa.</p>
<h2>3. Produtos, personalização e disponibilidade</h2>
<p>Por serem feitos à mão, nossos doces podem apresentar pequenas variações de acabamento. Confira a descrição de cada produto; imagens identificadas como ilustrativas são referências. Personalizações dependem de disponibilidade, e qualquer substituição é combinada com você.</p>
<p>As encomendas de Natal podem ser feitas até {{prazoNatal}} ou enquanto durarem os estoques. Prazos de produção e de entrega são confirmados separadamente para cada encomenda.</p>
<p>Em Sombrio, encomendas de cardápios especiais devem ser feitas com pelo menos {{antecedencia}} de antecedência. Os quatro sabores fixos — cacau, brigadeirão, beijinho e tradicional — estão normalmente disponíveis, sujeitos à confirmação e não estão sujeitos a essa antecedência. Para Blumenau, consulte a disponibilidade e as datas de entrega no orçamento.</p>
<p>Não há quantidade nem valor mínimo para fazer seu pedido.</p>
<h2>4. Preços e pagamento</h2>
<p>O pagamento é por Pix, com a chave celular <strong>${escapeHtml(CONFIG.pixKey)}</strong>: {{sinal}} para confirmar a encomenda e {{saldo}} na entrega. O valor total, incluindo entrega e personalização, é informado antes do pagamento. Itens com preço a definir dependem de orçamento e não entram no subtotal do carrinho.</p>
<h2>5. Entrega e retirada</h2>
<p>Em Sombrio, a retirada no {{retiradaLocal}} é gratuita, {{retiradaHorario}}, mediante agendamento. O ponto de encontro dentro do campus deve ser combinado com a equipe. A entrega em domicílio custa {{entregaSombrio}}. Para Blumenau, as datas, a disponibilidade e o valor da entrega são verificados no orçamento. Consulte também as <a href="/envio">informações de envio e retirada</a>.</p>
<p>As entregas são agendadas. Confira o endereço e os dados de quem receberá. Se houver algum imprevisto, fale com a gente para combinar a solução.</p>
<p>Outra pessoa pode receber ou retirar por você, desde que nos avise. Se precisar mudar o horário de retirada, combinamos outro horário. Quando uma entrega precisar ser refeita por mudança de horário solicitada pelo cliente, será cobrada uma nova taxa, informada no reagendamento. Isso não se aplica a falhas de entrega atribuíveis à NAPORTA.</p>
<h2>6. Alterações, cancelamentos e reembolsos</h2>
<p>Alterações podem ser solicitadas em até 48 horas após o pedido. Cancelamentos nesse período têm reembolso integral, realizado na hora do atendimento.</p>
<p>Esse prazo não elimina os direitos previstos em lei. Nas compras à distância, o direito de arrependimento é, em regra, de sete dias, conforme o caso. Perecíveis e encomendas personalizadas são avaliados individualmente, sem perda automática do sinal. Quando o reembolso for legalmente devido, inclui o frete e não tem multa nem custo de recolhimento. Solicite pelo WhatsApp ou e-mail; o recebimento será confirmado imediatamente.</p>
<h2>7. Problemas com o pedido</h2>
<p>Se algo chegar diferente do combinado ou com problema de qualidade, fale com a gente. Fotos ajudam no atendimento, mas não são condição para exercer seus direitos. Serão respeitadas as soluções previstas no Código de Defesa do Consumidor, incluindo substituição ou restituição quando cabíveis.</p>
<h2>8. Ingredientes, alergênicos e conservação</h2>
<p>Conforme as informações do cardápio, nossos produtos contêm trigo, leite, ovos e derivados de soja, além de glúten e lactose. Não são indicados para pessoas alérgicas, devido ao risco de contaminação cruzada. Confira também a composição específica de cada produto antes da compra.</p>
<p>${escapeHtml(cookieCareDescription)}</p>
<h2>9. Uso do site e conteúdo</h2>
<p>Fotos, textos e marca pertencem aos respectivos titulares.</p>
<p>Estes termos podem ser atualizados, sem alterar condições de pedidos já confirmados nem afastar os direitos do consumidor.</p>
</main>`);
}

function faqPage() {
    const groups = [
        ['Pedidos e pagamento', [
            ['Como faço meu pedido?', 'Escolha seus favoritos no <a href="/cardapio">cardápio</a> e envie o carrinho pelo WhatsApp. A gente confirma os itens, o valor total e a data de entrega ou retirada antes do pagamento. O envio do carrinho, sozinho, não confirma a encomenda.'],
            ['Como funciona o pagamento?', 'Nossa chave Pix é o celular <strong>' + escapeHtml(CONFIG.pixKey) + htmlMarca("</strong>. O pagamento é dividido em {{sinal}} para confirmar a encomenda e {{saldo}} na entrega. Combine o valor total com a equipe antes de pagar.")],
            ['Existe pedido mínimo?', 'Não! Você pode escolher a quantidade que fizer sentido para o seu momento.'],
            ['Com quanto tempo de antecedência devo encomendar?', htmlMarca("Em Sombrio, os cardápios especiais precisam de pelo menos {{antecedencia}} de antecedência. Nossos quatro sabores fixos estão normalmente disponíveis, sujeitos à confirmação e não seguem esse prazo. Para Blumenau, consulte as datas e a disponibilidade no orçamento.")],
            ['Consigo retirar meu pedido no mesmo dia?', 'Nossos sabores fixos normalmente podem ser retirados no mesmo dia, sujeitos à confirmação. Combine o horário pelo WhatsApp antes de ir buscar.'],
            ['Como sei que minha encomenda foi confirmada?', htmlMarca("Depois do recebimento do Pix de {{sinal}}, confirmamos sua encomenda pelo WhatsApp, com os detalhes combinados.")],
            ['Vocês emitem nota fiscal?', 'No momento, não emitimos nota fiscal. Se precisar desse documento, fale com a gente antes de fechar o pedido para verificar o atendimento à sua necessidade.'],
            ['Até quando posso encomendar os produtos de Natal?', htmlMarca("Recebemos encomendas de Natal até {{prazoNatal}} ou enquanto durarem os estoques. A data de entrega ou retirada é combinada pelo WhatsApp.")]
        ]],
        ['Entregas e retiradas', [
            ['Onde posso retirar meu pedido?', htmlMarca("A retirada é gratuita no {{retiradaLocal}}, {{retiradaHorario}}, mediante agendamento. Combinamos o ponto de encontro na conversa.")],
            ['Vocês entregam em Sombrio?', htmlMarca("Sim! A entrega em domicílio em Sombrio custa {{entregaSombrio}}, em data e horário combinados. Se preferir outro ponto de encontro, converse com a gente para confirmar as condições.")],
            ['Como funcionam as entregas em Blumenau?', 'As datas, a disponibilidade e o valor da entrega são confirmados no orçamento. Veja mais em <a href="/envio">informações de envio</a>.'],
            ['Posso enviar um presente diretamente para outra pessoa?', 'Pode, sim! Entregamos para a pessoa presenteada desde que o endereço esteja na nossa área de cobertura. Informe os detalhes pelo WhatsApp para confirmarmos a disponibilidade e combinarmos esse carinho.'],
            ['Outra pessoa pode receber ou retirar meu pedido?', 'Sim! Basta avisar pelo WhatsApp quem vai receber ou retirar, para combinarmos tudo com cuidado.'],
            ['E se eu não puder receber ou retirar no horário combinado?', 'Avise pelo WhatsApp assim que souber do imprevisto. Para retirada, combinamos outro horário. Se a entrega precisar ser refeita por uma mudança de horário solicitada por você, haverá uma nova taxa de entrega, informada no reagendamento.']
        ]],
        ['Nossos doces e cuidados', [
            ['Vocês preparam presentes e encomendas especiais?', 'Sim! Preparamos doces para presentear, encontros, empresas e celebrações. Conte sua ideia para combinarmos os produtos, as embalagens e as opções de personalização disponíveis.'],
            ['Qual é a validade e como devo conservar?', escapeHtml(cookieCareDescription)],
            ['Posso aquecer os cookies?', escapeHtml(cookieWarmingDescription)],
            ['Os produtos são indicados para pessoas alérgicas?', escapeHtml(allergenDescription) + ' Confira as informações de cada produto antes de fazer seu pedido.'],
            ['Posso montar uma caixa com sabores diferentes?', 'Pode, sim! Combine seus favoritos em uma caixa cheia de afeto. Consulte pelo WhatsApp a disponibilidade de sabores e embalagens.'],
            ['Posso incluir um cartão com uma mensagem?', 'Sim! Podemos escrever sua mensagem com carinho ou entregar o cartão em branco para você deixar suas próprias palavras. Combine os detalhes pelo WhatsApp.'],
            ['Posso congelar os cookies?', 'Pode, sim! Congele os cookies ainda dentro da validade, bem embalados, e consuma em até um mês após o congelamento, mantendo-os no freezer. Para descongelar, prefira a geladeira e depois aqueça como preferir. Siga também os cuidados específicos do sabor escolhido.'],
            ['Qual é o tamanho ou peso de cada produto?', 'Essas informações estão na descrição de cada produto. Confira antes de escolher e, se precisar de ajuda para montar seu pedido, fale com a gente.']
        ]],
        ['Atendimento e novidades', [
            ['Qual é o horário de atendimento?', htmlMarca("Atendemos {{atendimentoDias}}, {{atendimentoHorario}}. Entregas em outros horários podem ser combinadas, conforme disponibilidade.")],
            ['Posso alterar ou cancelar uma encomenda?', 'Alterações podem ser solicitadas em até 48 horas após o pedido. Cancelamentos nesse período têm reembolso integral, realizado na hora do atendimento. Esse prazo não elimina os direitos previstos em lei. Para outras situações, fale com a gente e consulte os <a href="/termos">Termos de Uso</a>.'],
            ['Onde acompanho as novidades?', 'Aqui no site, no Instagram e no Status do WhatsApp. Se quiser receber novidades por mensagem direta, é só solicitar. Você pode pedir para parar de receber a qualquer momento.'],
            ['Como posso avaliar ou falar sobre um problema no pedido?', 'Sua satisfação é nossa prioridade. Conte sua experiência no nosso <a href="' + CONFIG.feedbackUrl + '" target="_blank" rel="noopener noreferrer">formulário de avaliação</a>. Para resolver qualquer problema com o pedido, fale diretamente com a gente pelo WhatsApp.']
        ]]
    ];
    return `<main class="page faq-page"><header class="faq-intro"><span class="shipping-eyebrow">PODEMOS AJUDAR?</span><h1>Perguntas frequentes</h1><p>Um pouquinho de informação para escolher seus doces com tranquilidade.</p></header>${groups.map(([title, questions], index) => `<section class="faq-group" aria-labelledby="faq-group-${index}"><h2 id="faq-group-${index}">${escapeHtml(title)}</h2>${questions.map(([question, answer]) => `<details class="faq-item"><summary>${escapeHtml(question)}</summary><div class="faq-answer"><p>${answer}</p></div></details>`).join('')}</section>`).join('')}<section class="faq-contact"><h2>Ficou alguma dúvida?</h2><p>Fale com a gente. Vamos cuidar de cada detalhe com você.</p><a class="btn" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, NAPORTA! Estou com uma dúvida e gostaria de ajuda.')}" target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp ➜</a></section></main>`;
}

function shippingPage() {
    return htmlMarca(`<main class="page shipping-page">
<header class="shipping-intro"><span class="shipping-eyebrow">ENTREGAS E RETIRADAS</span><h1>Do nosso forno até você.</h1><p>Cada pedido leva um pouquinho do nosso carinho. Veja como combinar a chegada do seu.</p></header>
<section class="shipping-options" aria-label="Opções de entrega e retirada">
<article class="shipping-option"><span class="shipping-label">RETIRADA EM SOMBRIO</span><h2>Um encontro no IFC</h2><p class="shipping-highlight">Gratuita</p><p>Retire seu pedido no <strong>{{retiradaLocal}}, {{retiradaHorario}}</strong>, com agendamento. Combinamos o ponto de encontro com você pelo WhatsApp.</p></article>
<article class="shipping-option"><span class="shipping-label">ENTREGA EM SOMBRIO</span><h2>Carinho até a sua porta</h2><p class="shipping-highlight">{{entregaSombrio}}</p><p>Receba em domicílio, em data e horário combinados. Se preferir outro ponto de encontro, converse com a gente para confirmar as condições antes de fechar o pedido.</p></article>
<article class="shipping-option"><span class="shipping-label">ENTREGA EM BLUMENAU</span><h2>Vamos combinar?</h2><p class="shipping-highlight shipping-highlight-small">Sob consulta</p><p>As datas, a disponibilidade e o valor da entrega são confirmados no orçamento. Consulte a equipe antes de finalizar sua encomenda.</p></article>
</section>
<section class="shipping-planning" aria-label="Prazos e horários"><div><h2>Um tempo para preparar com afeto</h2><p>Em Sombrio, os cardápios especiais precisam de <strong>{{antecedencia}} de antecedência</strong>. Nossos quatro sabores fixos estão normalmente disponíveis, sujeitos à confirmação e não seguem esse prazo. Não há pedido mínimo.</p></div><div><h2>Cada detalhe, combinado com você</h2><p>Atendemos <strong>{{atendimentoDias}}, {{atendimentoHorario}}</strong>. Entregas em outros horários podem ser agendadas conforme disponibilidade. Informe a cidade, o local e a data desejada para combinarmos tudo.</p></div></section>
<section class="shipping-steps" aria-labelledby="shipping-reschedule-title"><h2 id="shipping-reschedule-title">Se o horário mudar, avise a gente</h2><p>Outra pessoa pode receber ou retirar seu pedido se você nos avisar. Para mudar o horário de retirada, combinamos um novo encontro. Se uma entrega precisar ser refeita por mudança de horário solicitada por você, haverá uma nova taxa de entrega, informada no reagendamento.</p></section><section class="shipping-steps" aria-labelledby="shipping-steps-title"><h2 id="shipping-steps-title">Como combinar seu pedido</h2><ol><li><strong>Escolha seus favoritos.</strong><span>Monte seu carrinho ou fale com a gente sobre sua encomenda.</span></li><li><strong>Confira os detalhes.</strong><span>Confirmamos os itens, o valor total, a taxa e a data de entrega ou retirada antes do pagamento.</span></li><li><strong>Garanta seu carinho.</strong><span>O Pix de {{sinal}} confirma a encomenda. Os outros {{saldo}} são pagos na entrega.</span></li></ol></section>
<section class="shipping-contact"><div><h2>Vamos combinar a sua entrega?</h2><p>Conte onde e quando você quer receber. A gente cuida dos próximos detalhes com você.</p></div><a class="btn" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, NAPORTA! Gostaria de combinar uma entrega ou retirada. Minha cidade é: ')}" target="_blank" rel="noopener noreferrer">Combinar pelo WhatsApp ➜</a></section>
<p class="shipping-footer-note">Precisa alterar um pedido? Consulte os <a href="/termos">Termos de Uso</a> ou fale com a gente.</p>
</main>`);
}

function privacyPage() {
    return htmlMarca(`<main class="page legal privacy-page"><h1>Política de privacidade</h1>
<p><strong>Última atualização:</strong> 09/11/2026.</p>
<p>Na NAPORTA, o cuidado também faz parte do atendimento. Aqui explicamos quais informações passam pelo nosso site e pelos canais usados para combinar sua encomenda.</p>
<h2>1. Quem cuida dos seus dados</h2>
<p>A responsável pelo tratamento dos dados da NAPORTA é Natália Felisberto da Silveira, na Rua Manoel Monteiro Borges, sem número, bairro Boa Esperança, Sombrio, SC, CEP 88960-000.</p>
<p>Para falar sobre privacidade ou exercer seus direitos, envie um e-mail para <a href="mailto:${CONFIG.email}">${CONFIG.email}</a> ou uma mensagem pelo <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener noreferrer">{{whatsappRotulo}}</a>. Atendemos {{atendimentoDias}}, {{atendimentoHorario}}.</p>
<h2>2. Informações usadas no atendimento</h2>
<p>O formulário solicita apenas seu primeiro nome e a mensagem. Se você escolher enviar por e-mail, o serviço utilizado identifica o endereço remetente. No atendimento, podem ser necessários telefone, itens e quantidades do pedido, dados de entrega ou retirada e informações para confirmar o pagamento por Pix.</p>
<p>Para organizar os pedidos e controlar o estoque, registramos no Google Planilhas apenas o primeiro nome do cliente e os itens do pedido. O acesso é restrito às duas pessoas da equipe responsáveis pelos pedidos e pelas entregas. Esse registro é feito separadamente do carrinho do site.</p>
<p>O ponto de encontro para entrega é escolhido pelo cliente e combinado na conversa. O endereço ou local informado permanece nessa conversa e não é copiado para a planilha de estoque.</p>
<p>O site não possui cadastro de clientes nem pagamento integrado. Ao escolher WhatsApp ou e-mail, ele prepara uma mensagem no serviço escolhido, onde você pode revisar e confirmar o envio. O formulário não grava esses dados em um cadastro no servidor do site.</p>
<h2>3. Carrinho, chat e navegação</h2>
<p>O carrinho guarda os produtos e as quantidades no seu navegador até você remover os itens ou limpar os dados do site. Bloquear esse armazenamento pode impedir que o carrinho seja preservado.</p>
<p>O assistente Afeto funciona com respostas automáticas no navegador. O texto digitado fica na conversa aberta e não é enviado a um serviço de inteligência artificial. Se você clicar para continuar pelo WhatsApp, o link pode incluir sua pergunta na mensagem preparada.</p>
<p>O código atual não instala ferramentas de análise de audiência, pixels de publicidade ou cookies próprios de rastreamento. Ao carregar páginas, fontes e imagens, servidores e provedores podem receber dados técnicos, como IP, navegador e horário de acesso.</p>
<h2>4. Para que usamos as informações</h2>
<p>Usamos os dados para responder dúvidas, preparar orçamentos, confirmar pagamentos, organizar encomendas e entregas, controlar o estoque por meio dos registros de pedidos na planilha, resolver solicitações e cumprir obrigações aplicáveis.</p>
<p>Para atendimento solicitado por você e execução do pedido, a base é a preparação ou execução do contrato. Quando necessário, também tratamos dados para cumprir obrigações legais e exercer direitos. Se uma finalidade depender de consentimento, ele deve ser solicitado de forma específica e poderá ser retirado. A simples navegação não é uma autorização geral para outros usos.</p>
<p>As novidades são divulgadas no site, no Instagram e no Status do WhatsApp, conforme as configurações de visibilidade da plataforma. Mensagens promocionais diretas pelo WhatsApp são enviadas somente a quem solicitar ou autorizar. Você pode pedir para parar de recebê-las a qualquer momento, pelo próprio WhatsApp, sem custo. Fazer um pedido ou salvar nosso contato não autoriza, por si só, o envio direto de promoções.</p>
<h2>5. Serviços externos e compartilhamento</h2>
<p>O site usa fontes do Google Fonts, carregadas diretamente desse serviço. As imagens são carregadas do próprio site. Botões externos abrem o WhatsApp, seu aplicativo de e-mail, Instagram ou LinkedIn. Esses provedores têm políticas próprias e podem tratar dados fora do Brasil; o carregamento das fontes externas ocorre durante a navegação, mesmo sem clicar nos botões.</p>
<p>As informações necessárias ao atendimento passam pelo WhatsApp e pelos serviços de e-mail utilizados. O Google Planilhas armazena os registros de estoque na nuvem. A confirmação do Pix envolve os prestadores de pagamento. Os pedidos e as entregas são realizados pelas duas pessoas da equipe, que acessam apenas as informações necessárias ao atendimento. Informações também podem ser fornecidas a autoridades quando houver obrigação legal.</p>
<p>A avaliação da sua experiência é opcional e usa um formulário externo do Google Forms. Ao abrir o link, aplicam-se também as práticas de dados do Google. Se quiser avaliar sem se identificar, evite incluir nome, telefone ou outros dados pessoais no texto da resposta.</p>
<h2>6. Por quanto tempo os dados ficam guardados</h2>
<p>Os registros de primeiro nome e pedido no Google Planilhas são guardados por até um ano e depois removidos na renovação da planilha de estoque. Eventuais documentos que precisem ser conservados por obrigação legal ou exercício de direitos seguem os prazos aplicáveis a essas finalidades.</p>
<p>Conversas de atendimento no WhatsApp e mensagens de e-mail são registros separados da planilha. Sua exclusão pode ser solicitada pelos nossos canais, respeitadas as necessidades do atendimento e as hipóteses legais de conservação.</p>
<p>O armazenamento do carrinho é controlado no seu navegador. Limpar os dados do site apaga o carrinho local, mas não exclui os registros de pedidos na planilha nem as mensagens já enviadas; para esses dados, solicite atendimento pelos canais desta página.</p>
<h2>7. Seus direitos</h2>
<p>Você pode solicitar confirmação do tratamento, acesso, correção, informações sobre compartilhamento e, nas situações previstas na LGPD, portabilidade, oposição, bloqueio, anonimização ou exclusão. Quando houver consentimento, poderá retirá-lo. Alguns registros podem precisar ser mantidos por obrigação legal ou exercício de direitos.</p>
<p>Também pode pedir a revisão de decisões tomadas unicamente por tratamento automatizado que afetem seus interesses, quando houver. O assistente do site oferece respostas prontas; pedidos, pagamentos e entregas são combinados no atendimento.</p>
<p>As solicitações são gratuitas. Podemos pedir somente as informações necessárias para confirmar sua identidade e proteger seus dados. Responderemos conforme os prazos legais aplicáveis, explicando eventual impossibilidade de atender ao pedido. Se a questão não for resolvida, você também pode procurar a <a href="https://www.gov.br/anpd/pt-br/canais_atendimento/cidadao-titular-de-dados/denuncia-peticao-de-titular-referente-lgpd" target="_blank" rel="noopener noreferrer">Autoridade Nacional de Proteção de Dados</a>.</p>
<h2>8. Cuidados com suas informações</h2>
<p>O acesso aos aparelhos e aos registros de atendimento é restrito às duas pessoas da equipe responsáveis pelos pedidos e entregas. O acesso interno se limita às informações necessárias para essas atividades.</p>
<h2>9. Atualizações</h2>
<p>Esta política acompanha o funcionamento do site e do atendimento. Mudanças serão apresentadas nesta página, com atualização da data acima. Quando uma alteração exigir nova informação ou consentimento específico, isso será solicitado antes do novo uso. Consulte também os <a href="/termos">Termos de Uso</a>.</p>
</main>`);
}

function contactForm(subject = 'Contato') {
    return `<form class="form" id="contact-form"><label for="contact-name">Seu primeiro nome</label><input id="contact-name" name="nome" autocomplete="given-name" placeholder="Seu primeiro nome" required><input type="hidden" name="assunto" value="${subject}"><label for="contact-message">Como podemos ajudar?</label><textarea id="contact-message" name="mensagem" placeholder="Como podemos ajudar?" required></textarea><div class="contact-send-actions"><button class="btn" type="submit" data-contact-channel="whatsapp">Enviar pelo WhatsApp</button><button class="btn" type="submit" data-contact-channel="email">Enviar por e-mail</button></div><p class="contact-send-note"><a href="/privacidade">Política de Privacidade</a></p></form>`
}

function serviceStatus(id) {
    const state = id ? serviceCatalogStates[id] : serviceState;
    if (state !== 'error') return '<p role="status">Carregando opções...</p>';
    const retry = id ? 'data-retry-service="' + escapeHtml(id) + '"' : 'data-retry-services';
    return '<section class="site-feedback" role="alert"><h2>Não conseguimos carregar estas opções.</h2><p>Os cookies e o carrinho continuam disponíveis.</p><button type="button" class="btn" ' + retry + '>Tentar novamente</button><p><a href="/contato">Falar com a equipe</a></p></section>';
}

// Seleção da apresentação de acordo com a rota atual.
function page(path) {
    const parts = path.split('/').filter(Boolean),
        route = parts[0] || '';

    // Barras repetidas indicam segmentos vazios, não uma rota válida.
    if (path.includes('//')) return notfound();
    const expectedSegments = !route ? 0 : ['produto', 'servico', 'catalogo'].includes(route) ? 2 : 1;
    if (parts.length !== expectedSegments) return notfound();

    if (['servico', 'catalogo'].includes(route) && serviceState !== 'ready') return `<main class="page"><h1>Opções para sua ocasião</h1>${serviceStatus()}</main>`;
    if (['', 'cardapio', 'produto', 'carrinho'].includes(route) && catalogState !== 'ready') return catalogStatusPage();
    if (!route) return home();

    if (route === 'cardapio') return menuPage();

    if (route === 'produto') {
        const x = items.find(i => i.id === parts[1]);
        return x ? `<main class="page product-detail"><a class="back" href="/cardapio">← Voltar ao cardápio</a><div class="product-layout"><div class="product-photo"><img ${photoAttributes(x.img)} alt="${escapeHtml(x.name)}" decoding="async"></div><div class="product-information"><h1>${escapeHtml(x.name)}</h1><p>${escapeHtml(x.desc)}</p><h3>${x.placeholder ? 'Preço a definir' : money(x.price)}</h3>${addButton(x, 'btn')}<div class="product-accordions"><details><summary>Alérgenos <span class="accordion-symbol"></span></summary><div class="accordion-body"><p>${escapeHtml(allergenDescription)}</p></div></details><details><summary>Cuidado com os Cookies <span class="accordion-symbol"></span></summary><div class="accordion-body"><p>${escapeHtml(cookieCareDescription)}</p></div></details><details><summary>Detalhes de envio <span class="accordion-symbol"></span></summary><div class="accordion-body"><p>${escapeHtml(deliveryDescription)}</p></div></details></div></div></div><section class="packaging-section packaging-section-compact" aria-labelledby="packaging-title"><div class="packaging-copy"><span class="packaging-eyebrow">FEITO PARA PRESENTEAR</span><h2 id="packaging-title">Perfeitamente assado, cuidadosamente embalado.</h2><p>Do forno até a sua porta, cada pedido é preparado com carinho. Nossos cookies são acomodados com cuidado para preservar o sabor e tornar cada entrega um momento especial.</p><div class="packaging-benefits" aria-label="Diferenciais do presente"><span><b aria-hidden="true">♧</b> Embalagens especiais</span><span><b aria-hidden="true">♡</b> Mensagem personalizada</span><span><b aria-hidden="true">✿</b> Feito para cada ocasião</span></div><a class="packaging-cta" href="/catalogo/brindes">Conhecer embalagens ➜</a></div><div class="packaging-visual"><img ${photoAttributes(photos.gift)} loading="lazy" decoding="async" alt="Referência ilustrativa de embalagem para presente"><span>Imagem ilustrativa • opções sujeitas à disponibilidade</span></div></section></main>` : notfound();
    }

    if (route === 'catalogo') {
        const x = services.find(s => s.id === parts[1]);
        return x ? serviceCatalog(x) : notfound();
    }

    if (route === 'servico') {
        const x = services.find(s => s.id === parts[1]);
        return x ? `<main class="page about service-detail"><div class="service-detail-photo"><img ${photoAttributes(x.img, '(max-width:800px) 100vw, 680px')} alt="${escapeHtml(x.title)}" decoding="async"></div><div class="inner"><h1>${escapeHtml(x.title)}</h1><p>${escapeHtml(x.body)}</p><div class="service-detail-actions"><a class="btn" href="/catalogo/${escapeHtml(x.id)}">Ver catálogo ➜</a><a class="btn" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá, NAPORTA! Gostaria de solicitar um orçamento para ' + x.title + '.') }" target="_blank" rel="noopener noreferrer">Fazer orçamento ➜</a></div></div></main>` : notfound();
    }

    if (route === 'sobre') return `<main class="page about-page"><div class="about-intro"><span class="about-eyebrow">NAPORTA · CULINÁRIA COM AFETO</span><h1>Nossa essência está em cada detalhe</h1><p>Com carinho do começo ao fim.</p></div><div class="about-story-grid about-story-alternating"><article class="about-story-card"><div class="about-story-photo"><img ${photoAttributes(photos.shop)} decoding="async" alt="Fotografia ilustrativa do espaço e da história da NAPORTA" loading="lazy"></div><div class="about-story-copy"><span>Sobre nós</span><h2>Uma porta aberta para o afeto</h2><p>A Naporta nasceu de um sonho e ganhou ainda mais carinho com a presença da minha irmã. Entre nós, o amor, o cuidado e a parceria fazem parte de cada detalhe. Juntas colocamos um pouquinho do que somos em tudo o que fazemos, com o desejo de compartilhar esse mesmo afeto com você.</p></div></article><article class="about-story-card"><div class="about-story-photo"><img ${photoAttributes('assets/cozinha-nosso-cuidado.webp')} decoding="async" alt="Cozinha artesanal aconchegante com flores, prateleiras de madeira e utensílios" loading="lazy"></div><div class="about-story-copy"><span>Nosso cuidado</span><h2>Feito com carinho, do início ao fim</h2><p>Valorizamos o preparo artesanal e os pequenos detalhes. Cada receita é uma oportunidade de compartilhar sabores, criar memórias e levar um pouco de afeto à sua mesa.</p></div></article></div><div class="about-outro"><p>Receitas que acolhem, histórias que ficam.</p><a class="btn" href="/contato">Fale com a gente ➜</a></div></main>`;
    if (route === 'contato') return `<main class="page contact-page"><div class="contact-layout"><section class="contact-content"><h1>Fale com a gente:</h1><p>Pedidos especiais, eventos e dúvidas: envie uma mensagem.</p>${contactForm()}</section><aside class="contact-photo" aria-label="Fotografia da NAPORTA"><img ${photoAttributes('assets/contato-naporta-celular.webp')} decoding="async" alt="Pessoa com avental NAPORTA segurando um celular com a marca" loading="lazy"></aside></div></main>`;

    if (route === 'carrinho') {
        const validCart = cart.filter(c => c && items.some(i => i.id === c.id && i.available && !i.placeholder) && Number.isSafeInteger(c.qty) && c.qty > 0);
        const total = cartTotal(validCart);

        return `<main class="page"><h1>Seu carrinho</h1>${validCart.length ? `${validCart.map(c => {
            const x = items.find(i => i.id === c.id);
            return `<div class="cartitem"><span>${escapeHtml(x.name)} — ${money(x.price)} × ${c.qty}</span><span><button type="button" class="cart-quantity-action" data-minus="${c.id}" aria-label="Diminuir quantidade de ${escapeHtml(x.name)}">−</button> <button type="button" class="cart-quantity-action" data-add="${c.id}" aria-label="${c.qty >= 99 ? 'Limite de 99 unidades atingido para' : 'Aumentar quantidade de'} ${escapeHtml(x.name)}" aria-disabled="${c.qty >= 99}" title="${c.qty >= 99 ? 'Limite de 99 unidades atingido' : 'Adicionar uma unidade'}">+</button> <button type="button" class="cart-remove-action" data-remove="${c.id}" aria-label="Remover ${escapeHtml(x.name)} do carrinho">Remover</button></span></div>`;
        }).join('')}<h3>Subtotal dos produtos: ${money(total)}</h3><button type="button" class="btn" id="checkout">Enviar pedido para confirmação ➜</button><p>Frete não incluído no subtotal; será combinado com a equipe. O pedido, o pagamento e a disponibilidade só serão confirmados pela loja.</p>` : '<div class="empty">Seu carrinho está vazio. <a href="/cardapio">Explorar cardápio ➜</a></div>'}</main>`;
    }

    if (route === 'faq') return faqPage();
    if (route === 'envio') return shippingPage();
    if (route === 'termos') return termsPage();
    if (route === 'privacidade') return privacyPage();

    return notfound();
}

// Cardápio completo ou resultado da consulta à API.
function menuPage() {
    const heading = '<main class="page"><h1>Nosso cardápio</h1><p>Escolha seu favorito, feito com carinho.</p>';
    if (menuFilter?.state === 'loading') {
        return heading + '<div id="filter-state" class="site-feedback" role="status" aria-busy="true">Carregando os produtos desta consulta...</div></main>';
    }
    if (menuFilter?.state === 'error') {
        return heading + `<section id="filter-state" class="site-feedback" role="alert"><h2>Não conseguimos consultar estes filtros.</h2><p>${escapeHtml(menuFilter.message)}</p><button type="button" class="btn" data-retry-filter>Tentar novamente</button><p><a href="/cardapio">Ver todo o cardápio ➜</a></p></section></main>`;
    }
    const products = menuFilter ? menuFilter.products : items;
    if (!products.length) {
        return heading + '<div id="filter-state" class="empty" role="status">Nenhum produto encontrado para estes filtros. <a href="/cardapio">Ver todo o cardápio ➜</a></div></main>';
    }
    return heading + `<div class="products">${products.map(productCard).join('')}</div></main>`;
}

function notfound() {
    return errorPage();
}

function catalogStatusPage() {
    if (catalogState === 'loading') {
        return `<main class="page"><section id="catalog-state" class="site-feedback" role="status" aria-busy="true"><h1>Carregando o catálogo...</h1><p>Estamos preparando os produtos para você.</p></section></main>`;
    }
    return `<main class="page"><section id="catalog-state" class="site-feedback" role="alert"><h1>Não conseguimos carregar o catálogo.</h1><p>Tente novamente em instantes. Seu carrinho salvo não foi alterado.</p><button class="btn" type="button" data-retry-catalog>Tentar novamente</button><p><a href="/contato">Fale com a gente ➜</a></p></section></main>`;
}

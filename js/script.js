// Comportamento da aplicação. Os dados compartilhados ficam em configuracao.js.
// Mensagens da interface e abertura dos canais de contato.
function feedback(title, description, type = 'error') {
    const old = document.getElementById('site-feedback');
    if (old) old.remove();
    const el = document.createElement('section');
    el.id = 'site-feedback';
    el.className = 'site-feedback ' + type;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const h = document.createElement('h2');
    h.textContent = title;
    const d = document.createElement('p');
    d.textContent = description;
    el.append(h, d);
    const main = document.querySelector('main');
    (main || document.querySelector('#app') || document.body).prepend(el);
    el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function whats(text) {
    if (!/^\d{12,13}$/.test(CONFIG.whatsapp)) {
        feedback('Ops! Não conseguimos abrir o WhatsApp.', 'Tente novamente em instantes ou envie um e-mail para ' + CONFIG.email + '.');
        return;
    }
    const url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
    contactAlternative(url, text, 'WhatsApp');
    window.open(url, '_blank', 'noopener');
}

function emailTo(subject, body) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(CONFIG.email)) {
        feedback('Ops! Não conseguimos abrir o e-mail.', 'Você pode falar com a gente pelo WhatsApp.');
        return;
    }
    const url = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    contactAlternative(url, body, 'e-mail');
    window.location.href = url;
}

function contactAlternative(url, text, channel) {
    document.getElementById('contact-alternative')?.remove();
    const section = document.createElement('section');
    section.id = 'contact-alternative';
    section.className = 'site-feedback contact-alternative';
    section.innerHTML = `<h2>Mensagem preparada</h2><p role="status">Revise e envie a mensagem no aplicativo. O pedido só será confirmado pela equipe. Se o aplicativo não abrir, use o link abaixo ou copie a mensagem.</p><p><a target="_blank" rel="noopener noreferrer">Continuar no ${channel}</a></p><label for="prepared-message">Sua mensagem</label><textarea id="prepared-message" readonly></textarea><button type="button" class="btn">Copiar mensagem</button><p class="copy-status" role="status"></p>`;
    section.querySelector('a').href = url;
    const field = section.querySelector('textarea');
    field.value = text;
    section.querySelector('button').addEventListener('click', async () => {
        const status = section.querySelector('.copy-status');
        try {
            await navigator.clipboard.writeText(text);
            status.textContent = 'Mensagem copiada. Cole no aplicativo e envie para a equipe.';
        } catch {
            field.focus();
            field.select();
            status.textContent = 'Selecione e copie a mensagem acima (Ctrl+C ou o comando Copiar do celular).';
        }
    });
    const anchor = document.getElementById('checkout') || document.getElementById('contact-form');
    if (anchor) anchor.insertAdjacentElement('afterend', section);
    else document.querySelector('main').append(section);
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

// Consumo da API e validação dos dados recebidos.
async function fetchJson(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
            cache: 'no-store'
        });
        if (!response.ok) {
            const error = new Error(`API respondeu com status ${response.status}: ${url}`);
            error.status = response.status;
            if (response.status === 400) {
                try {
                    const body = await response.json();
                    if (typeof body.erro === 'string') error.publicMessage = body.erro;
                } catch {}
            }
            throw error;
        }
        return await response.json();
    } finally {
        clearTimeout(timeout);
    }
}

function validateEntries(entries, fields) {
    if (!Array.isArray(entries)) throw new Error('Lista de dados inválida.');
    const ids = new Set();
    for (const entry of entries) {
        if (!entry || typeof entry.id !== 'string' || !/^[a-z0-9-]+$/.test(entry.id) || ids.has(entry.id)) {
            throw new Error('Identificador inválido ou duplicado.');
        }
        ids.add(entry.id);
        if (fields.some(field => typeof entry[field] !== 'string' || !entry[field].trim())) {
            throw new Error('Campos do catálogo inválidos.');
        }
        const localImage = /^\/?assets\/[a-z0-9-]+\.(webp|png)$/.test(entry.img);
        let externalImage = false;
        try { externalImage = new URL(entry.img).protocol === 'https:'; } catch {}
        if (!localImage && !externalImage) throw new Error('Endereço de imagem inválido.');
    }
    return entries;
}

function validateProducts(products) {
    validateEntries(products, ['name', 'desc', 'img']);
    if (products.some(product => !Number.isFinite(product.price) || product.price < 0 ||
        typeof product.available !== 'boolean' || typeof product.placeholder !== 'boolean')) {
        throw new Error('Preço ou disponibilidade inválidos.');
    }
    return products;
}

function validateCatalog(entries) {
    if (!Array.isArray(entries) || entries.some(entry => !entry || Array.isArray(entry) ||
        ['name', 'desc'].some(field => typeof entry[field] !== 'string' || !entry[field].trim()) ||
        (entry.img !== undefined && (typeof entry.img !== 'string' || !entry.img.trim())))) {
        throw new Error('Itens de catálogo inválidos.');
    }
    return entries;
}
// Dimensões dos arquivos WebP preservam a proporção durante o carregamento.
const photoDimensions = {
    "biscoitos-amanteigados-refil": [
        1280,
        853
    ],
    "bolo-porcelana-natal": [
        1280,
        853
    ],
    "buque-com-biscoito-artesanal": [
        1280,
        853
    ],
    "cardapio-natal": [
        1280,
        853
    ],
    "cartao-artesanal-com-biscoito": [
        1280,
        720
    ],
    "cesta-bom-dia-com-afeto": [
        1280,
        853
    ],
    "chocolates-natal": [
        1280,
        853
    ],
    "combo-beijinho-brigadeirao": [
        1280,
        853
    ],
    "combo-cookie-cacau": [
        1280,
        853
    ],
    "combo-cookie-tradicional": [
        1280,
        853
    ],
    "combos-e-promocoes-catering": [
        1280,
        853
    ],
    "contato-naporta-celular": [
        1024,
        1536
    ],
    "cookie-beijinho": [
        1024,
        1536
    ],
    "cookie-brigadeirao": [
        1024,
        1536
    ],
    "cookie-cacau": [
        1280,
        960
    ],
    "cookie-tradicional": [
        1280,
        960
    ],
    "cozinha-nosso-cuidado": [
        1280,
        1170
    ],
    "doce-encontro-natal": [
        1280,
        853
    ],
    "equipe-naporta-cafe": [
        1280,
        960
    ],
    "espaco-trabalho-com-afeto": [
        1280,
        720
    ],
    "mini-cookies-natal": [
        1280,
        853
    ],
    "postal-natal-biscoito": [
        1280,
        853
    ],
    "pote-amanteigado-natal": [
        1280,
        853
    ],
    "presente-rustico-floral": [
        1280,
        853
    ],
    "sacolinha-de-carinho": [
        1280,
        720
    ]
};

function photoAttributes(src, sizes = '(max-width:650px) calc(100vw - 32px), (max-width:1190px) 60vw, 640px') {
    const imageSrc = src.startsWith('assets/') ? '/' + src : src;
    const name = imageSrc.replace(/^\/?assets\//, '').replace(/\.webp$/, '');
    const dimensions = Object.prototype.hasOwnProperty.call(photoDimensions, name) ? photoDimensions[name] : null;
    if (!dimensions) return `src="${escapeHtml(imageSrc)}"`;
    const [width, height] = dimensions;
    return `src="${imageSrc}" srcset="/assets/${name}-640.webp 640w, ${imageSrc} ${width}w" sizes="${sizes}" width="${width}" height="${height}"`;
}

const photos = {
    gift: 'assets/presente-rustico-floral.webp',
    shop: 'assets/equipe-naporta-cafe.webp'
};
// Estado da aplicação e persistência do carrinho.
let items = [];
let services = [];
let catalogExamples = {};
let serviceState = 'loading';
let serviceCatalogStates = {};
let catalogState = 'loading';
let catalogRequest = null;
// Os resultados filtrados nunca substituem items, usado pelos detalhes e carrinho.
let menuFilter = null;
const catalogRoutes = new Set(['', 'cardapio', 'produto', 'servico', 'catalogo', 'carrinho']);
let lastRenderedUrl = null;
let legacyRedirectPending = false;
let cartPersistenceFailed = false;
const store = {
    get() {
        try {
            return localStorage.getItem('naporta-cart')
        } catch {
            cartPersistenceFailed = true;
            return null
        }
    },
    set(v) {
        try {
            localStorage.setItem('naporta-cart', v);
            return true;
        } catch {
            return false;
        }
    }
};
// Descarta dados corrompidos e produtos removidos ou indisponíveis.
const loadCart = () => {
    try {
        const raw = JSON.parse(store.get() || '[]');
        if (!Array.isArray(raw)) return [];
        const sum = {};
        raw.forEach(c => {
            const x = c && items.find(i => i.id === c.id),
                q = c && c.qty;
            if (x?.available && !x.placeholder && Number.isSafeInteger(q) && q > 0) {
                sum[x.id] = Math.min(99, (sum[x.id] || 0) + q);
            }
        });
        return Object.keys(sum).map(id => ({
            id,
            qty: sum[id]
        }))
    } catch {
        return []
    }
};
let cart = [];
const money = n => n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});
const save = () => {
    cartPersistenceFailed = !store.set(JSON.stringify(cart));
    return !cartPersistenceFailed;
};
const count = () => cart.reduce((s, x) => s + x.qty, 0);
const cartTotal = entries => entries.reduce((total, entry) => {
    const product = items.find(item => item.id === entry.id);
    return total + (product && !product.placeholder ? product.price * entry.qty : 0);
}, 0);
const app = document.getElementById('app');

// Consultas filtradas preservam o catálogo completo e o carrinho.
function menuQuery() {
    const allowed = new Set(['busca', 'precoMin', 'precoMax', 'disponivel', 'ordem']);
    return new URLSearchParams([...new URLSearchParams(location.search)].filter(([key]) => allowed.has(key))).toString();
}

function prepareMenuFilter() {
    if (catalogState !== 'ready' || !/^\/cardapio\/?$/.test(currentPath())) return;
    const query = menuQuery();
    if (!query) {
        menuFilter = null;
        return;
    }
    if (menuFilter?.query === query) return;
    const request = { query, state: 'loading', products: [] };
    menuFilter = request;
    (async () => {
        try {
            request.products = validateProducts(await fetchJson(`/api/produtos?${query}`));
            request.state = 'ready';
        } catch (err) {
            request.state = 'error';
            request.message = err.publicMessage || 'Tente novamente em instantes. Seu carrinho não foi alterado.';
        }
        // Uma resposta antiga não pode sobrescrever uma consulta mais recente.
        let path;
        try { path = currentPath(); } catch { return; }
        if (menuFilter !== request || !/^\/cardapio\/?$/.test(path) ||
            menuQuery() !== query) return;
        const restoreFocus = !!document.activeElement?.closest('main');
        render(true);
        if (restoreFocus) focusContent();
    })();
}

// Carregamento do catálogo e atualização das páginas que dependem dele.
function refreshCatalogView(routes = catalogRoutes) {
    let route;
    try {
        route = currentPath().split('/').filter(Boolean)[0] || '';
    } catch {
        return;
    }
    if (routes.has(route)) {
        const restoreFocus = !!document.activeElement?.closest('#app');
        render(true);
        if (restoreFocus) focusContent();
    } else {
        // Não recria formulários nem interrompe a digitação em páginas estáticas.
        const counter = app.querySelector('.cart-floral-count');
        if (counter) {
            counter.textContent = count();
            counter.setAttribute('aria-label', `${count()} produtos no carrinho`);
        }
    }
}

function loadCatalog() {
    if (catalogRequest) return catalogRequest;
    catalogState = 'loading';
    refreshCatalogView();
    catalogRequest = (async () => {
        try {
            items = validateProducts(await fetchJson('/api/produtos'));
            cart = loadCart();
            catalogState = 'ready';
        } catch (err) {
            console.error('Erro ao carregar o catálogo:', err);
            catalogState = 'error';
        } finally {
            catalogRequest = null;
            refreshCatalogView();
        }
    })();
    return catalogRequest;
}

async function loadServiceCatalog(id) {
    if (serviceCatalogStates[id] === 'loading') return;
    serviceCatalogStates[id] = 'loading';
    const refresh = () => {
        if (location.pathname.replace(/\/$/, '') === '/catalogo/' + id) refreshCatalogView();
    };
    refresh();
    try {
        catalogExamples[id] = validateCatalog(await fetchJson(`/api/servicos/${encodeURIComponent(id)}/catalogo`));
        serviceCatalogStates[id] = 'ready';
    } catch {
        serviceCatalogStates[id] = 'error';
    }
    refresh();
}

async function loadServices() {
    serviceState = 'loading';
    const routes = new Set(['', 'servico', 'catalogo']);
    refreshCatalogView(routes);
    try {
        services = validateEntries(await fetchJson('/api/servicos'), ['title', 'short', 'body', 'img']);
        serviceState = 'ready';
        services.forEach(service => { void loadServiceCatalog(service.id); });
    } catch {
        serviceState = 'error';
    }
    refreshCatalogView(routes);
}

// Rotas, histórico do navegador e compatibilidade com links antigos.
function currentPath() {
    const pathname = decodeURI(location.pathname);
    return /^\/index\.html\/?$/.test(pathname) ? '/' : pathname;
}

function redirectLegacyHash() {
    if (!location.hash.startsWith('#/')) return false;
    // O prefixo absoluto mantém o destino no mesmo domínio, inclusive com barras inválidas.
    if (!legacyRedirectPending) {
        legacyRedirectPending = true;
        location.replace(location.origin + location.hash.slice(1));
    }
    return true;
}

function isPagePath(pathname) {
    let path;
    try { path = decodeURI(pathname); } catch { return false; }
    if (path.includes('//')) return false;
    if (/^\/index\.html\/?$/.test(path)) return true;
    const parts = path.split('/').filter(Boolean);
    if (!parts.length) return true;
    if (parts.length === 1) {
        return ['cardapio', 'sobre', 'contato', 'carrinho', 'faq', 'envio', 'termos', 'privacidade'].includes(parts[0]);
    }
    if (parts.length !== 2 || catalogState !== 'ready') return false;
    if (parts[0] === 'produto') return items.some(item => item.id === parts[1]);
    return ['servico', 'catalogo'].includes(parts[0]) && services.some(service => service.id === parts[1]);
}

function navigateTo(destination) {
    const url = new URL(destination, location.origin);
    if (url.origin !== location.origin) return false;
    if (url.pathname + url.search !== location.pathname + location.search) {
        history.pushState(null, '', url.pathname + url.search + url.hash);
        render();
    } else {
        window.scrollTo(0, 0);
    }
    focusContent();
    return true;
}

// Sincronização entre abas sem interromper formulários em preenchimento.
function syncCartFromStorage() {
    if (catalogState !== 'ready' || cartPersistenceFailed) return;
    const savedCart = loadCart();
    if (cartPersistenceFailed || JSON.stringify(savedCart) === JSON.stringify(cart)) return;
    cart = savedCart;
    let path;
    try { path = currentPath(); } catch { path = ''; }
    if (path.replace(/\/$/, '') === '/carrinho') {
        render(true, document.activeElement);
    } else {
        // Atualiza o contador sem apagar formulários ou interromper a leitura.
        const counter = app.querySelector('.cart-floral-count');
        if (counter) {
            counter.textContent = count();
            counter.setAttribute('aria-label', `${count()} produtos no carrinho`);
        }
    }
}

// Renderização e restauração do foco após atualizações da interface.
function focusContent() {
    const target = app.querySelector('main h1, .hero h1') || app.querySelector('main');
    if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
    }
}

function render(keepScroll, control) {
    lastRenderedUrl = location.pathname + location.search;
    const action = control && ['data-add', 'data-minus', 'data-remove'].find(name => control.hasAttribute(name));
    const productId = action && control.getAttribute(action);
    const rowIndex = control ? Array.from(app.querySelectorAll('.cartitem')).indexOf(control.closest('.cartitem')) : -1;
    try {
        prepareMenuFilter();
        app.innerHTML = `<div class="shell">${header()}${page(currentPath())}${footer()}</div>`
    } catch (err) {
        console.error('Erro ao renderizar a página:', err);
        app.innerHTML = `<div class="shell">${header()}${errorPage()}${footer()}</div>`
    }
    if (cartPersistenceFailed) {
        app.querySelector('main').insertAdjacentHTML('afterbegin', `<section id="cart-storage-warning" class="site-feedback" role="status"><h2>Seu carrinho continua disponível nesta página.</h2><p>Não foi possível salvar o carrinho neste navegador. Você pode continuar escolhendo produtos e finalizar pelo WhatsApp. Ao recarregar ou fechar esta página, suas alterações podem ser perdidas.</p></section>`);
    }
    const main = app.querySelector('main');
    if (main) { main.id = 'conteudo'; main.tabIndex = -1; }
    document.dispatchEvent(new Event('naporta:render'));
    document.title = (main?.querySelector('h1')?.textContent || 'Culinária com Afeto') + ' | NAPORTA';
    if (!keepScroll) window.scrollTo(0, 0)
    if (action) {
        let target = Array.from(app.querySelectorAll(`[${action}]`)).find(button => button.getAttribute(action) === productId);
        if (!target && rowIndex >= 0) {
            const rows = app.querySelectorAll('.cartitem');
            const row = rows[Math.min(rowIndex, rows.length - 1)];
            target = row && row.querySelector(`[${action}]`);
        }
        if (target) target.focus({ preventScroll: true });
        else focusContent();
    }
}
// Registra os eventos e inicia a aplicação uma única vez.
function initialize() {
    window.addEventListener('hashchange', redirectLegacyHash);
    window.addEventListener('popstate', () => {
        if (redirectLegacyHash()) return;
        if (location.pathname + location.search === lastRenderedUrl) return;
        render();
        focusContent();
    });
    window.addEventListener('pageshow', event => {
        if (event.persisted) syncCartFromStorage();
    });
    window.addEventListener('storage', event => {
        if (event.key !== null && event.key !== 'naporta-cart') return;
        if (event.storageArea !== localStorage) return;
        syncCartFromStorage();
    });
    const legacyNavigation = redirectLegacyHash();
    if (!legacyNavigation) {
        render();
        focusContent();
    }
    document.addEventListener('click', e => {
        const link = e.target.closest('a[href]');
        if (link && !e.defaultPrevented && e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey &&
            !link.hasAttribute('download') && (!link.target || link.target === '_self')) {
            const url = new URL(link.href, location.href);
            if (url.origin === location.origin && !url.hash && isPagePath(url.pathname)) {
                e.preventDefault();
                navigateTo(url);
                return;
            }
        }
        if (e.target.closest('[data-retry-catalog]')) {
            loadCatalog();
            return;
        }
        if (e.target.closest('[data-retry-services]')) { loadServices(); return; }
        const retryService = e.target.closest('[data-retry-service]');
        if (retryService) { loadServiceCatalog(retryService.dataset.retryService); return; }
        if (e.target.closest('[data-retry-filter]')) {
            menuFilter = null;
            render(true);
            focusContent();
            return;
        }
        let add = e.target.closest('[data-add]'),
            minus = e.target.closest('[data-minus]'),
            remove = e.target.closest('[data-remove]');
        if (add || minus || remove || e.target.closest('#checkout')) {
            if (catalogState !== 'ready') return;
            // Lê a versão mais recente antes de gravar, mesmo entre cliques em abas diferentes.
            syncCartFromStorage();
        }
        if (add) {
            if (!items.some(item => item.id === add.dataset.add && item.available && !item.placeholder)) return;
            let id = add.dataset.add,
                x = cart.find(c => c.id === id);
            if (x?.qty >= 99) {
                feedback('Limite de 99 unidades atingido', 'Para quantidades maiores, consulte a equipe pelo contato.', 'success');
                return;
            }
            x ? x.qty = Math.min(99, x.qty + 1) : cart.push({
                id,
                qty: 1
            });
            save();
            const inCart = currentPath().replace(/\/$/, '') === '/carrinho';
            render(inCart, add);
            if (!inCart) feedback('Que delícia! Seu cookie está no carrinho.', 'Continue escolhendo seus favoritos ou confira seu pedido no carrinho.', 'success')
        }
        if (minus) {
            let x = cart.find(c => c.id === minus.dataset.minus);
            if (x) {
                x.qty--;
                cart = cart.filter(c => c.qty > 0);
                save();
                render(true, minus)
            }
        }
        if (remove) {
            cart = cart.filter(c => c.id !== remove.dataset.remove);
            save();
            render(true, remove)
        }
        if (e.target.closest('#checkout') && cart.length) {
            const total = cartTotal(cart);
            const msg = 'Olá, NAPORTA! Gostaria de fazer este pedido:\n\n' + cart.map(c => {
                const x = items.find(i => i.id === c.id);
                return `${c.qty}x ${x.name} — ${money(x.price*c.qty)}`
            }).join('\n') + '\n\nSubtotal dos itens com preço definido: ' + money(total) + '\n\nGostaria de confirmar disponibilidade, entrega/retirada e pagamento. Obrigado!';
            whats(msg);
        }
    });
    document.addEventListener('input', e => {
        if (e.target.form?.id === 'contact-form' && ['nome', 'mensagem'].includes(e.target.name)) {
            e.target.setCustomValidity('');
        }
    });
    document.addEventListener('submit', e => {
        if (e.target.id === 'contact-form') {
            e.preventDefault();
            const form = e.target;
            for (const [name, message] of [
                ['nome', 'Informe seu primeiro nome.'],
                ['mensagem', 'Escreva uma mensagem.']
            ]) {
                const field = form.elements.namedItem(name);
                field.value = field.value.trim();
                field.setCustomValidity(field.value ? '' : message);
            }
            if (!form.reportValidity()) return;
            const f = new FormData(form),
                body = `Nome: ${f.get('nome')}\nAssunto: ${f.get('assunto')}\n\n${f.get('mensagem')}`;
            let channel = e.submitter?.dataset.contactChannel || 'whatsapp';
            if (channel === 'email') emailTo(f.get('assunto'), body);
            else whats('Olá, NAPORTA!\n' + body)
        }
    });

    if (!legacyNavigation) { loadCatalog(); loadServices(); }
}

initialize();

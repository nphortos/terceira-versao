const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');
const app = require('../server');

(async () => {
 const server = app.listen(0, '127.0.0.1');
 await new Promise(resolve => server.once('listening', resolve));
 let browser;
 try {
  browser = await chromium.launch(process.env.BROWSER_PATH ? {executablePath:process.env.BROWSER_PATH} : {channel:'chrome'});
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  const base=`http://127.0.0.1:${server.address().port}`;
  const go=async path=>{await page.goto(base+path);await page.waitForFunction(()=>catalogState==='ready' && serviceState==='ready' && Object.values(serviceCatalogStates).every(s=>s!=='loading'));};
  await go('/cardapio?utm_source=instagram');
  assert.equal(await page.locator('.product').count(),4);
  await go('/cardapio?utm_source=instagram&busca=Cookie');
  await page.waitForFunction(()=>menuFilter?.state==='ready');
  assert.equal(await page.locator('.product').count(),4);
  await go('/cardapio?utm_source=instagram&precoMin=invalido');
  await page.waitForFunction(()=>menuFilter?.state==='error');
  assert.equal((await page.request.get(base+'/api/produtos?utm_source=instagram')).status(),400);
  await go('/cardapio');
  await page.locator('[data-add="beijinho"]').click();
  await page.locator('[data-add="tradicional"]').click();
  await go('/carrinho');
  assert.match(await page.locator('main').innerText(),/Subtotal dos produtos: R\$\s*18,00/);
  await page.evaluate(()=>window.open=()=>null);
  await page.locator('#checkout').click();
  assert.match(await page.locator('#prepared-message').inputValue(),/18,00/);
  assert.match(await page.locator('#contact-alternative a').getAttribute('href'),/^https:\/\/wa.me/);
  await page.locator('#contact-alternative button').click();
  await page.waitForFunction(()=>document.querySelector('.copy-status').textContent.length>0);
  await page.evaluate(()=>localStorage.setItem('naporta-cart',JSON.stringify([{id:'beijinho',qty:99}])));
  await go('/cardapio');
  await page.locator('[data-add="beijinho"]').click();
  assert.match(await page.locator('#site-feedback').innerText(),/Limite de 99/);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('naporta-cart'))[0].qty),99);
  await go('/carrinho');
  assert.equal(await page.locator('[data-add="beijinho"]').getAttribute('aria-disabled'),'true');
  await page.locator('[data-minus="beijinho"]').click();
  assert.equal(await page.locator('[data-add="beijinho"]').getAttribute('aria-disabled'),'false');
  const second=await context.newPage(); await second.goto(base+'/carrinho');
  await second.waitForSelector('[data-remove]'); await second.locator('[data-remove]').click();
  await page.waitForSelector('.empty'); await second.close();
  await page.route('**/api/servicos/eventos/catalogo', r=>r.fulfill({status:500,body:'erro simulado'}));
  await go('/cardapio'); assert.equal(await page.locator('.product').count(),4);
  await page.locator('[data-add="beijinho"]').click();
  await go('/carrinho'); assert.equal(await page.locator('#checkout').count(),1);
  await go('/catalogo/eventos'); assert.equal(await page.locator('[data-retry-service="eventos"]').count(),1);
  await page.unroute('**/api/servicos/eventos/catalogo');
  await page.locator('[data-retry-service]').click(); await page.waitForSelector('.catalog-card');
  assert.equal(await page.locator('.catalog-card').count(),6);
  await page.route('**/api/servicos', r=>r.fulfill({status:500,body:'erro simulado'}));
  await page.goto(base+'/carrinho'); await page.waitForSelector('#checkout');
  await page.unroute('**/api/servicos');
  await go('/contato');
  await page.locator('[data-contact-channel="whatsapp"]').click();
  assert.equal(await page.locator('#contact-alternative').count(),0);
  await page.getByLabel('Seu primeiro nome',{exact:true}).fill('Teste');
  await page.getByLabel('Como podemos ajudar?',{exact:true}).fill('Consultar entrega');
  await page.evaluate(()=>window.open=()=>null);
  await page.locator('[data-contact-channel="whatsapp"]').click();
  assert.match(await page.locator('#prepared-message').inputValue(),/Teste/);
  await page.locator('.afeto-launch').click();
  const question='Vocês entregam hoje em Blumenau?';
  await page.locator('.afeto-form input').fill(question); await page.locator('.afeto-form button').click();
  const reply=page.locator('.afeto-bot').last();
  assert.match(await reply.innerText(),/Blumenau conforme disponibilidade/);
  assert.ok(decodeURIComponent(await reply.locator('a').getAttribute('href')).includes(question));
  await page.keyboard.press('Escape'); assert.equal(await page.locator('.afeto-launch').evaluate(el=>el===document.activeElement),true);
  const routes=['/','/cardapio','/produto/beijinho','/produto/brigadeirao','/produto/tradicional','/produto/cacau','/servico/brindes','/servico/eventos','/servico/catering','/catalogo/brindes','/catalogo/eventos','/catalogo/catering','/sobre','/contato','/carrinho','/faq','/envio','/termos','/privacidade'];
  for(const width of [360,390,768,1440]) {
   await page.setViewportSize({width,height:900});
   for(const route of routes) {
    await go(route);
    assert.ok(await page.locator('main h1').count(),route);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} em ${width}px`);
    assert.ok(!(await page.locator('main').innerText()).includes('Ops! Parece'));
   }
  }
  await go('/cardapio');
  const contrast = await page.locator('.footer-whatsapp-link').evaluate(el=>{
   const style=getComputedStyle(el);
   const luminance=color=>color.match(/\d+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
   const a=luminance(style.color), b=luminance(style.backgroundColor);
   return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  });
  assert.ok(contrast>=4.5,`Contraste do rodapé: ${contrast}`);
  for (const route of ['/faq','/envio','/termos','/privacidade']) {
   await go(route);
   assert.ok(await page.locator('main p a:not(.btn)').evaluateAll(links=>links.every(a=>getComputedStyle(a).textDecorationLine.includes('underline'))));
  }
  await go('/cardapio');
  if (process.env.QA_SCREENSHOT) await page.screenshot({path:process.env.QA_SCREENSHOT,fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('OK: A01–A08, sincronização, recuperação de catálogo e 19 rotas em quatro larguras.');
 } finally { await browser?.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(e=>{console.error(e);process.exitCode=1;});

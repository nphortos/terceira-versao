# Correções da validação NAPORTA — 10/11/2026

Referência: `Validacao_NAPORTA_2026-11-10.pdf`. Alterações no projeto local.

| Achado | Correção |
| --- | --- |
| A01 | Somente os cinco filtros permitidos seguem para a API; UTM permanece na URL. A API mantém validação estrita. |
| A02 | Produtos, serviços e cada catálogo carregam independentemente. Catálogos têm aviso de erro e nova tentativa próprios. |
| A03 | Carrinho e formulário oferecem mensagem copiável e link explícito para continuar no aplicativo. Se a cópia automática falhar, o texto fica selecionado para cópia manual. |
| A04 | Cidade e modalidade precedem “hoje”; encaminhamentos ao atendimento preservam a pergunta original. |
| A05 | Subtotal dos produtos, ação de enviar para confirmação e explicação de frete e confirmação pela equipe. |
| A06 | Aviso ao atingir 99, sem falso sucesso. O botão + comunica o limite pelo título e por aria-disabled. |
| A07 | Rótulos visíveis associados aos campos de nome e mensagem. |
| A08 | Fundo mais escuro no WhatsApp do rodapé e links de texto sublinhados. |
| A09 | Fotos comprimidas, dimensões atualizadas e variantes de 640 px para cookies e catálogos. As seis variantes anteriores foram preservadas e otimizadas. |

Também foram incluídos títulos por página, link para pular ao conteúdo, prazo de Natal
com ano e textos de disponibilidade sujeitos à confirmação. O mascote ocupa menos espaço no celular.

Os arquivos de `assets/` passaram de 31.710.003 para 4.311.701 bytes, redução de aproximadamente
86,4%, incluindo as novas variantes. Isso mede os arquivos, não o tempo de carregamento em rede móvel.
Ao substituir fotos, atualize as variantes e as dimensões em `js/script.js`.

## Reproduzir a verificação

```sh
npm ci
npm test
```

No PowerShell, pode-se usar `npm.cmd`. Requer Chrome instalado; `BROWSER_PATH` permite
escolher outro executável Chromium. Os testes iniciam e encerram seu próprio servidor local.

Resultado: passaram os cenários de UTM e filtros inválidos, subtotal, limite de quantidade,
sincronização entre abas, falha e recuperação do catálogo de Natal, falha da lista de serviços,
formulário, chat, contraste do botão e sublinhado dos links. As 19 rotas foram verificadas
em larguras de 360, 390, 768 e 1440 px, sem transbordamento horizontal ou exceções JavaScript.

Os testes não enviam mensagens reais: verificam o conteúdo preparado e simulam abertura bloqueada.
As verificações locais em Chromium não substituem aparelhos físicos, outros navegadores ou o ambiente
publicado. Não houve envio real de WhatsApp/e-mail, cobrança ou publicação.

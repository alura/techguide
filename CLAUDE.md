# Guia para agentes de código (Claude e similares)

Este arquivo descreve como o repositório funciona e as regras que o site aplica sem
avisar. Leia antes de mexer em conteúdo ou código. Complementa o `README.md`, o
`CONTRIBUTING.md` e o `STRUCTURE.md`, que explicam o projeto para pessoas.

## O que é

O techguide.sh é um site estático (Next.js com `next export`) que publica guias de
carreira no formato do profissional em T. Todo o conteúdo vive em YAML:

- `_data/guides/<idioma>/<carreira>.yaml`: uma carreira. Lista os cards de cada
  nível de especialidade (`expertise`) e de colaboração (`collaboration`).
- `_data/cards/<idioma>/<slug>.yaml`: um card (um assunto), com objetivos e links
  de conteúdo. Cards são compartilhados entre carreiras.
- `_data/locale/<idioma>.ts`: textos da interface e a lista de filtros de área da
  página inicial. Uma carreira entra num filtro pela tag no YAML do guide.
- `_api/`: camada GraphQL que lê os YAML no build. Define os tipos e enums.
- `pages/`, `src/`: o site. As páginas de carreira e de card são geradas no build
  para pt-BR, en-US e es.

## Regras do repositório

1. **Nunca commitar na `main`.** O CI roda só em `pull_request`. Todo push na
   `main` publica em produção sem checagem nenhuma. Sempre abrir PR.
2. **Merge é squash.** O histórico não mostra commits de merge; isso não significa
   que alguém commitou direto.
3. **Mensagens de commit** no formato `tipo: descrição` (`feat`, `fix`, `docs`,
   `chore`, `refactor`), em português.
4. O clone usa `core.autocrlf=true`, então a árvore de trabalho tem CRLF. Preservar
   a quebra de linha do arquivo ao editar.

## Armadilhas do conteúdo

Regras que o código aplica mas nenhum validador confere. Cada uma já quebrou algo.

1. **O slug do card é a primeira chave do item.** O código faz `Object.keys(card)[0]`.
   Se `priority` vier antes do slug, o card some da tela sem erro.

   ```yaml
   - html-fundamentals:   # certo
       priority: 10
   - priority: 10         # errado: o slug vira "priority"
     html-fundamentals:
   ```

2. **`expertise` e `collaboration` são obrigatórias em todo guide.** O código faz
   `.map()` direto nas duas. Faltando uma, o build inteiro quebra.
3. **Tipo de conteúdo fora do enum vira `null`**, sem erro, e aparece com a
   etiqueta genérica "Conteúdo". Os valores válidos são `SITE`, `COURSE`,
   `ALURAPLUS`, `PODCAST`, `ARTICLE`, `YOUTUBE`, `CHALLENGE`, `BOOK`
   (enum em `_api/modules/cards/index.ts`).
4. **Cards são compartilhados.** Editar `git-and-github-fundamentals` afeta quase
   todas as carreiras. Antes de alterar um card, ver quem o usa.
5. **Todo card referenciado num guide precisa existir** em `_data/cards/<idioma>/`.
   Card inexistente não dá erro: a carreira publica com buraco.
6. **`faq` é renderizado** na página da carreira (lista de `{title, answer}`).
   `short-description` e `logo` existem nos cards mas não aparecem no site; preservar
   mesmo assim para não sujar o diff.
7. **Um guide pode ter menos de três níveis de expertise.** O código das páginas
   percorre os grupos existentes; não voltar a usar índice fixo (`expertises[2]`).

Convenções medidas no repositório: `title:` sempre com aspas, `name:` e itens de
lista sem aspas. Seguir isso mantém o diff dos PRs limpo.

## Validar antes do PR

Requisitos: Node da versão do `.nvmrc` e Yarn 1.x.

```bash
yarn install
yarn lint          # eslint + yamllint em _data
yarn test          # jest
yarn build:static  # next build + next export; é o que o deploy roda
```

O `build:static` é a checagem que importa: ele gera todas as páginas e falha se um
guide estiver incompleto. O CI do PR roda `build`, `lint`, `test` e `build-preview`.
O `build-preview` publica um preview real na Vercel e comenta o link no PR; se o
deploy falhar, o comentário não aparece, e esse é o sintoma a procurar.

## Como o deploy funciona hoje

- `continuous-integration.yml` (em `pull_request`): build, lint, test e preview.
- `continuous-delivery.yml` (em push na `main`): roda `yarn build:static` no GitHub
  Actions e envia a pasta `out` pronta para a Vercel com `npx vercel@latest ./out
  --prod`. A Vercel não faz build; só hospeda os arquivos.
- Segredos usados: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Se o time
  ou o projeto da Vercel mudar, os três precisam ser revistos.
- A Vercel exige que o projeto tenha Node.js Version 24.x nas configurações. Com
  versão descontinuada, o envio falha com "Node.js Version is discontinued" mesmo
  sem o build precisar de Node na Vercel.
- `generate-download-files.yml`: cron de hora em hora que gera os PDFs dos guias e
  commita na `main` (o que dispara um deploy).
- `releaser-bot.yml`: reage a comentários `/release/` em PRs.

## Pendências

- **Migrar o deploy para a integração Git da Vercel** (registrado em 05/11/2026).
  Hoje o build roda no GitHub Actions e o resultado é enviado por token, um arranjo
  de 2022 que exige segredos no repositório e leva cerca de 12 minutos por
  publicação. Com o repositório conectado ao projeto na Vercel (build
  `yarn build:static`, saída `out`), o workflow de deploy, o job `build-preview` e
  os segredos deixam de existir, e cada PR ganha preview automático. Antes de
  trocar a produção, testar num preview: o build passaria a rodar com Node 24 e o
  projeto é Next 12 com `.nvmrc` em Node 16; conferir também se os redirects de
  `redirects.json` continuam funcionando.
- Remover a entrada `vercel` de `devDependencies`, órfã desde que os workflows
  passaram a usar `npx vercel@latest`.

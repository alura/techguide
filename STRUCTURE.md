# Entendendo decisões arquiteturais e a estrutura do projeto

## techguide.sh Site

### Estrutura do projeto

- `./pages`: É a página que o Next.js usa para montar o sistema de roteamento
- `./src/components`: São todos os pedaços primordiais de interface como componentes de formulário, Text e o `<Box>`
  - `<Box>`: É nossa abstração para criar estilos, sempre use um box e nunca crie um styled component diretamente no projeto.
    - Ele recebe uma prop chamada `styleSheet` e a mesma pode receber ou uma chave com nome de propriedade do CSS com seu valor, ou ao invés de o valor você pode passar um objeto com a resolução que a propriedade deve ser aplicada.
      - **Exemplo**:
        - `<Box styleSheet={{ color: 'red' }} />` ou `<Box styleSheet={{ color: { xs: 'red', md: 'blue' } }} />`;
- `./src/patterns`: Patterns são todos os pedaços de interface que são menos genéricos que os componentes mas são reusados em mais de 3 lugares do projeto e fazem parte da estrutura geral dele
- `./src/screens`: Toda screen representa uma tela do projeto, uma tela caso tenha componentes específicos inicialmente deve ter os mesmos guardados na sua própria pasta, repetindo a estrutura anterior do projeto e evitando o reuso antes do uso de fato.

### Como me localizar no projeto?
- Todas as páginas do projeto estão listadas em `./pages`
  - Todos os `componentes` que representam as páginas estão em `./src/screens`
    - Uma vez dentro de uma página você pode ir navegando pelos componentes para ir se encontrando e fazer a alteração que deseja

### Como funciona a parte de i18n (internacionalização)?

- Todo conteúdo multi-língua é alterado por meio da pasta `_data/locale/COUNTRY.json`
  - Para acessar um conteúdo dentro do código siga o exemplo abaixo:
```js
import { Box, Text, Image, Link } from "@src/components";
import { useI18n } from "@src/infra/i18n";
import React from "react";

export default function SecondContentSection() {
  const i18n = useI18n();
  return (
    <Text>
      {i18n.content("CHAVE.DO.CONTEUDO.NO.JSON")}
    <Text>
  )
}
```
> Caso deseje passar um link, você DEVE usar a tag do html `<a href="link"></a>`

## techguide.sh GraphQL API

- TDB

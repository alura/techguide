# Como carregar seu guia no techguide.sh?

1. Crie um arquivo JSON em um repositório aberto no GitHub

```json
{
  "name": "Nome do Guia",
  "expertise": [
    {
      "name": "Nível 1 - Básico",
      "cards": [
        {
          "name": "Nome do Cartão Customizado",
          "short-description": "Descrição do Cartão",
          "key-objectives": ["Objetivo 1", "Objetivo 2", "Objetivo 3"],
          "additional-objectives": ["Extra Objetivo 1", "Extra  Objetivo 2"],
          "contents": [
            {
              "type": "SITE", // 'ALURAPLUS', 'ARTICLE', 'CHALLENGE', 'COURSE', 'PODCAST', 'SITE', 'YOUTUBE'
              "title": "Node.js - Documentation",
              "link": "https://nodejs.dev/en/learn/"
            }
          ]
        },
        // Usando o ID, conseguimos pegar nossos próprios cartões
        // Aqui você pode ver uma lista com todos os disponíveis: https://github.com/alura/techguide/tree/main/_data/blocks/pt_BR
        {
          "id": "nodejs-fundamentals"
        }
      ]
    },
    {
      "name": "Nível 2 - Intermediário",
      "cards": [] // Use os cards do "name": "Nível 1 - Básico", como referência
    },
    {
      "name": "Nível 3 - Avançado",
      "cards": [] // Use os cards do "name": "Nível 1 - Básico", como referência
    }
  ],
  "collaboration": [
    {
      "name": "Lado Esquerdo do T",
      "cards": [] // Use os cards do "name": "Nível 1 - Básico", como referência
    },
    {
      "name": "Lado Direito do T",
      "cards": [] // Use os cards do "name": "Nível 1 - Básico", como referência
    }
  ]
}
```

> Em breve você poderá gerar esse arquivo diretamente pela interface e ao final só iremos pedir para que você salve-o em algum lugar público.

1. Copie a URL publica do seu arquivo como aqui: `https://raw.githubusercontent.com/omariosouto/omariosouto/main/techguide.json`

1. Em breve você poderá carregá-la diretamente na interface

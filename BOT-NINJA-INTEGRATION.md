# Bot Ninja + App de Orcamentos

Este projeto agora tem uma ponte HTTP para o Bot Ninja no mesmo `server.js`.

## O que a ponte faz

- usa as regras do `quote-engine.js`, alinhadas com a app
- responde perguntas rapidas como recheios, kits, horarios, morada e fatia de bolo
- interpreta mensagens livres do cliente
- devolve perguntas curtas quando faltam dados
- gera orcamentos formatados para WhatsApp
- nunca confirma pedidos, datas, disponibilidade ou pagamento

## Rotas principais

### `GET /api/health`
Verifica se a API esta online.

### `GET /api/catalog`
Devolve o catalogo completo em JSON.

### `GET /api/catalog/lists`
Devolve listas prontas para WhatsApp:
- recheios
- kits
- doces
- salgados

### `POST /api/quote/estimate`
Faz um orcamento estruturado.

Exemplo de body:

```json
{
  "type": "bolo",
  "date": "2026-06-15",
  "people": 20,
  "mass": "chocolate",
  "fillingCategory": "gourmet",
  "fillingFlavor": "nido-morangos",
  "fruit": "sem-fruta",
  "decoration": "decorado",
  "format": "redondo"
}
```

### `POST /api/quote/from-text`
Interpreta texto livre do cliente e devolve o resultado do orcamento.

Exemplo de body:

```json
{
  "message": "Queria um bolo para 20 pessoas com leite nido com morangos para 2026-06-15"
}
```

### `POST /api/assistant/reply`
Melhor rota para o bot.

Ela:
- responde FAQ rapida quando a mensagem for simples
- responde listas prontas quando o cliente pedir recheios, kits, doces ou salgados
- entra em fluxo de orcamento quando a mensagem for um pedido

Exemplo de body:

```json
{
  "message": "eu nao sei quais os recheios me manda a lista"
}
```

### `POST /api/botninja/webhook`
Recebe um payload do Bot Ninja, tenta extrair telefone e mensagem, gera a resposta e opcionalmente pode reenviar ao Bot Ninja.

### `POST /api/botninja/send`
Envia uma mensagem ao Bot Ninja por API.

Campos esperados:

```json
{
  "token": "SEU_TOKEN",
  "mode": "qr",
  "senderPhone": "3519XXXXXXXX",
  "recipientPhone": "3519YYYYYYYY",
  "text": "Mensagem pronta para o cliente"
}
```

## Variaveis de ambiente opcionais

Se quiser evitar mandar token e numero em cada request, pode iniciar o servidor com:

- `BOT_NINJA_TOKEN`
- `BOT_NINJA_MODE`
- `BOT_NINJA_SENDER_PHONE`
- `BOT_NINJA_ENDPOINT_PATH`
- `BOT_NINJA_TEXT_FIELD`
- `BOT_NINJA_AUTO_REPLY=true`

## Fluxo recomendado com o Bot Ninja

1. No Bot Ninja, aponte o webhook para:

```text
https://SEU-ENDERECO/api/botninja/webhook
```

2. Se o Bot Ninja nao fizer webhook de entrada de mensagem, use a rota:

```text
POST /api/assistant/reply
```

3. Se precisar depurar o payload real que o Bot Ninja esta mandando, consulte:

```text
GET /api/botninja/events
```

## Observacao importante

Para o Bot Ninja chamar esta ponte de fora da sua maquina, o servidor precisa estar publicado numa URL acessivel pela internet.
Em local, ele funciona para testes em:

```text
http://127.0.0.1:5173
```

ou noutra porta se iniciar com `PORT=xxxx`.

## Opcao sem GitHub nem deploy

Se nao quiser publicar agora, pode usar um tunel temporario.

### Cloudflare Quick Tunnel

Segundo a documentacao oficial da Cloudflare, os Quick Tunnels servem para testes e webhooks temporarios e geram um endereco `*.trycloudflare.com` enquanto o processo estiver aberto.

Passos:

1. Inicie a ponte:

```text
npm start
```

2. Noutra janela, abra o tunel:

```text
npm run tunnel
```

3. Copie a URL publica mostrada no terminal, por exemplo:

```text
https://alguma-coisa.trycloudflare.com
```

4. Use no Bot Ninja:

```text
https://alguma-coisa.trycloudflare.com/api/botninja/webhook
```

### Limite desta opcao

- e temporaria
- muda de URL quando reinicia
- o computador precisa ficar ligado
- a janela do tunel precisa continuar aberta

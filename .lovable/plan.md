

## Plano: Chat Auxiliar Clínico com IA (GPT-5)

### Objetivo
Criar a página de Chat Auxiliar Clínico funcional, com streaming de respostas usando o modelo **openai/gpt-5** via Lovable AI Gateway, mantendo a identidade visual IATROS.

### Arquitetura

```text
Cliente (React)  →  Edge Function (chat)  →  Lovable AI Gateway (openai/gpt-5)
     ↑                                              |
     └──────────── SSE streaming ←──────────────────┘
```

### Etapas

**1. Criar Edge Function `supabase/functions/chat/index.ts`**
- System prompt clínico: instruir o modelo a atuar como auxiliar clínico estruturado (anamnese, exame físico, hipóteses diagnósticas, sinais de alerta, conduta) baseado em medicina por evidências
- Modelo: `openai/gpt-5`
- Streaming SSE habilitado
- Tratamento de erros 429 (rate limit) e 402 (créditos)

**2. Criar página `/chat` — `src/pages/ChatPage.tsx`**
- Layout com header IATROS (logo + nav bar laranja) consistente com HomePage
- Área de mensagens com scroll, renderizando markdown (`react-markdown`)
- Input de texto com botão de envio
- Streaming token-by-token com atualização progressiva da mensagem do assistente
- Suporte a mensagem inicial vinda da HomePage (via `location.state`)
- Indicador de loading enquanto a IA responde
- Toasts para erros de rate limit e créditos

**3. Atualizar `src/App.tsx`**
- Adicionar rota `/chat` apontando para `ChatPage`

**4. Instalar dependência**
- `react-markdown` para renderização de respostas formatadas

### Detalhes Técnicos
- O system prompt será definido apenas no backend (edge function), nunca no cliente
- Histórico completo da conversa será enviado a cada requisição para manter contexto
- Fonte Francois One mantida em toda a interface
- Cores: roxo `#7B2FBE`/`#9B30FF` no header, laranja `#E8720C`/`#F5A623` nos acentos


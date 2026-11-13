# FestaMágica AI
MVP de convite de aniversário infantil com Next.js e OpenAI Image API.

## Desenvolvimento
Node 22+. Instale com npm install, crie .env.local a partir de .env.example, rode npm run dev.

## Railway
Vincule este repositório à branch main em um projeto independente com ambiente production. Adicione no painel Variables:
- OPENAI_API_KEY (segredo — nunca no GitHub)
- PREVIEW_ACCESS_CODE (senha de teste — necessária para fazer qualquer geração)
- OPENAI_IMAGE_MODEL (opcional, padrão gpt-image-2; confirme acesso ao modelo)

O Next.js usa o PORT definido pelo Railway.

## Entrega da primeira versão
Landing responsiva + geração de fundo com OpenAI + composição determinística de nome, idade, data, horário e local no navegador + download PNG.

A API está protegida por código e limite em memória de 3 gerações por hora por IP, por instância. Para disponibilização ao público, substituir pelo controle persistente de créditos e rate limit no Supabase. Não há pagamentos, pedidos, armazenamento persistente nem geração de kit completo nesta etapa. Não anuncie entrega do kit pago até passar pelos testes.

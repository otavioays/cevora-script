# Os Scripts da Cevora

Esboço inicial da landing page do produto **Os Scripts da Cevora**.

## Estrutura

- `index.html`: conteúdo e estrutura da página
- `styles.css`: identidade visual em preto, dourado e vermelho
- `script.js`: animações de entrada e comportamento dos CTAs
- `.github/workflows/pages.yml`: publicação automática no GitHub Pages

## Próximas integrações

1. Substituir o CTA final pelo link real do checkout usando `data-checkout-url`.
2. Adicionar preço, garantia, depoimentos e perguntas frequentes quando a oferta estiver fechada.
3. Instalar Meta Pixel e eventos de conversão.
4. Conectar domínio personalizado quando a página estiver aprovada.

## Checkout

No `index.html`, localize o botão com `data-checkout` e adicione a URL:

```html
<a
  class="button button--primary button--large"
  href="https://seu-checkout.com"
  data-checkout
  data-checkout-url="https://seu-checkout.com"
>
  Quero acessar os scripts
</a>
```

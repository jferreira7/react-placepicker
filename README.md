## Conteúdo

### Assunto:

Lidando com Side Effects e como usar o Hook useEffect

#### O que são side effects?

R: São tasks que não impactam o ciclo de renderização atual do componente

#### Quando um função dentro do useEffect é executada?

A função useEffect será sempre executada apenas após quando a execução do componente finalizar, ou seja, após o código JSX ser retornado;

```ts
useEffect(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude);
    setAvailablePlaces(sortedPlaces);
  });
}, []);
```

Mas caso haja alguma variável no array do useEffect, ou seja, alguma dependência, o useEffect será sempre executado novamente se o valor de alguma delas mudarem.

**Importante:** se o array das dependências for omitido, a função do useEffect será executada a cada novo ciclo de renderização do componente.

```ts
useEffect(() => {
 ...
});
```

Quando passamos uma dependência para o useEffect, ele será exectudo sempre que o valor dela mudar. Como dependência podemos ter props, states, funções ou mesmo variáveis padrões.

```ts
const Modal = function Modal({ open, children }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
};
```

### Cleanup Function

A função de limpeza será executada, apenas, antes do componentes ser desmontado, ou seja, antes dele ser removido da DOM. Ou quando o valor de uma dependência muda e o useEffect será executado novamente. Casos de uso:

- Cancelar timers.
- Remover listeners de eventos.
- Limpar subscrições.
- Desfazer quaisquer modificações no DOM feitas no useEffect.

Com isso, a cleanup function garante que não se crie múltiplas instâncias de subscrições, listeners, ou qualquer outro recurso que possa acumular.

```ts
useEffect(() => {
  const timer = setTimeout(() => {
    onConfirm();
  }, 3000);

  // Cleanup function
  return () => {
    clearTimeout(timer);
  };
}, []);
```

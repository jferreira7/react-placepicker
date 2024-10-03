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

### Quando passar algo como dependência?

Quando estamos usando states ou props dentro da função useEffect é correto passa-las também como dependências.

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

### Funções e objetos como dependências

Quando adicionamos funções como dependências há um risco de ser criado um loop infinito, pois quando adicionamos uma dependencia no array, estamos dizendo para o react, que a função useEffect deve ser executada em dois momentos: quando o componente é executado e se o valor da dependência mudar.

O problema com as funções passada por props é que no final, toda função no javascript é um objeto, com isso, quando o componente originário dessa função for recarregado, por qualquer motivo, essa função é recriada, acionando assim o useEffect novamente. E caso a função passada por props tenha alguma mudança de estado dentro dela (setAlgumaCoisa()), o componente será carregado novamente, criando assim o loop infinito.

```ts
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onConfirm]);
  ...
}
```

Não é sempre que isso irá acontecer, é preciso estar atento em cada caso.

### Usando o useCallback Hook

Esse hook ajuda a evitar o problem descrito acima. A ideia desse hook é envolver determinada função com ele e com isso, pegar como retorno a função para poder ser chamada em outros lugares. A função dentro do hook não será recriada toda vez que o componente for recarregado. Além disso, esse hook também aceita dependências, igual ao useEffect.

```ts
const handleRemovePlace = useCallback(function handleRemovePlace() {
  setPickedPlaces((prevPickedPlaces) => prevPickedPlaces.filter((place) => place.id !== selectedPlace.current));
  setModalIsOpen(false);

  const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  localStorage.setItem(
    "selectedPlaces",
    JSON.stringify(
      storedIds.filter((id) => {
        id !== selectedPlace.current;
      })
    )
  );
}, []);
```

### Outro uso para a Cleanup Function no hook useEffect

Quando queremos executar um setInterval e para-lo em algum momento:

```ts
const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [remainingTime, setRemainingTime] = useState(TIMER);

  useEffect(() => {
    const progress = setInterval(() => {
      console.log("INTERVAL");
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(progress);
    };
  }, []);

  ...

}
```

### Otimização nas atualizações dos componentes

É sempre bom criar um componente novo para algo que será atualizado várias vezes, para evitar que algum outro componente seja atualizado desnecessáriamente, como no caso de uma progress bar. Separar ela em um componente isolado é bem mais perfomático para a aplicação como um todo.

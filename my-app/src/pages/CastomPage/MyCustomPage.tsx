import { useState } from "react";

export function MyCustomPage() {
  const [myState, setMyState] = useState({
    age: 11,
    name: "John",
    name1: "John",
    name2: "John",
    name3: "John",
    name4: "John",
    name5: "John",
    name6: "John",
    name7: "John",
    name8: "John",
  });
  console.log(myState);
  //   const [newState, setNewState] = useState(0);
  //   const myRef = useRef();
  //   const coolVar = "cool";

  //   const updateState = useMemo(() => {}, []);

  //   useEffect(() => {
  //     if (myRef.current === null) return;
  //     myRef.current = setInterval(() => {
  //       setMyState((prev) => ({ ...prev, age: prev.age + 1 }));
  //     }, 1000);
  //     return () => {
  //       if (myRef.current) {
  //         clearInterval(myRef.current);
  //       }
  //     };
  //   }, [myState]);

  console.log(myState);

  return (
    <div>
      <button
        onClick={() => setMyState((prev) => ({ ...prev, age: prev.age + 1 }))}
      >
        Click me
      </button>
      <h1>Моя кастомная страница</h1>

      <p>Здесь будет отображаться моя кастомная информация.</p>
    </div>
  );
}

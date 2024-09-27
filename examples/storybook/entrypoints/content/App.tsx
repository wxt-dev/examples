import { Button } from "@/components/Button";
import { useState } from "react";

export default () => {
  const [count, setCount] = useState(1);
  const increment = () => setCount((count) => count + 1);

  return (
    <div>
      <p>This is React. {count}</p>
      <Button primary onClick={increment} label="Increment" />
    </div>
  );
};

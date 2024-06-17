import { useState } from "react";
import { Button, Container } from "@mantine/core";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Container style={{ padding: "16px" }}>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </Container>
    </>
  );
}

export default Counter;

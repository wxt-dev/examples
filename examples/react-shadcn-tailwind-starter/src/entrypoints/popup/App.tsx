import { useState } from 'react';
import { Button } from '@/components/ui/button';
import reactLogo from '@/assets/react.svg';
import shadcnLogo from '@/assets/shadcn.png';
import tailwindcssLogo from '@/assets/tailwind.svg';
import wxtLogo from '/wxt.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-w-[350px] flex flex-col items-center justify-center min-h-[400px]">
      <div className="flex space-x-4">
        <a href="https://wxt.dev" target="_blank" rel="noopener noreferrer">
          <img src={wxtLogo} className="w-12 h-12" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="w-12 h-12" alt="React logo" />
        </a>
        <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
          <img src={shadcnLogo} className="w-12 h-12" alt="Shadcn logo" />
        </a>
        <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
          <img src={tailwindcssLogo} className="w-12 h-12" alt="TailwindCSS logo" />
        </a>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mt-6">WXT + React 19 + Shadcn + TailwindCSS 4</h1>
      <div className="card mt-4">
        <Button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </Button>
        <p className="mt-2 text-gray-600">
          Edit <code className="font-mono text-sm text-gray-800">src/entrypoints/popup/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs mt-4 text-gray-500">
        Click on WXT, React, Shadcn and TailwindCSS logos to learn more
      </p>
    </div>
  );
}

export default App;

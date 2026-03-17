import "@/assets/tailwind.css";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";

type ThemeProviderProps = {
  children?: ReactNode;
  cssContainer?: HTMLElement | ShadowRoot;
};

export const ThemeProvider = ({
  children,
  cssContainer,
}: ThemeProviderProps) => {
  const container =
    cssContainer ??
    (typeof document !== "undefined" ? document.head : undefined);

  return (
    <StyleProvider container={container} layer hashPriority="high">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ff000a",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
};
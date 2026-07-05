import { COLOR_PRIMARY } from "@context/design-tokens";
import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: { colorPrimary: COLOR_PRIMARY },
  components: {
    Typography: {
      titleMarginBottom: 0,
    },
  },
};

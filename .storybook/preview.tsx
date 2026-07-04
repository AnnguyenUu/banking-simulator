import type { Preview } from '@storybook/react-vite'
import { ConfigProvider } from 'antd'
import { theme } from '@context/theme'
import 'antd/dist/reset.css'
import '../src/index.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ConfigProvider theme={theme}>
        <Story />
      </ConfigProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
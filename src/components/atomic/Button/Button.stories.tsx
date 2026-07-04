import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchOutlined } from '@ant-design/icons';
import Space from '@components/atomic/Space';
import Button from './index';

const meta = {
  title: 'Atomic/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'dashed', 'link', 'text'],
    },
    size: {
      control: 'select',
      options: ['large', 'middle', 'small'],
    },
    shape: {
      control: 'select',
      options: ['default', 'circle', 'round'],
    },
  },
  args: {
    children: 'Button',
    type: 'default',
    size: 'middle',
    disabled: false,
    loading: false,
    danger: false,
    block: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { type: 'primary' },
};

export const Dashed: Story = {
  args: { type: 'dashed' },
};

export const Text: Story = {
  args: { type: 'text' },
};

export const Link: Story = {
  args: { type: 'link' },
};

export const Danger: Story = {
  args: { type: 'primary', danger: true },
};

export const Loading: Story = {
  args: { type: 'primary', loading: true },
};

export const Disabled: Story = {
  args: { type: 'primary', disabled: true },
};

export const WithIcon: Story = {
  args: { type: 'primary', icon: <SearchOutlined /> },
};

export const Block: Story = {
  args: { type: 'primary', block: true },
  parameters: {
    layout: 'padded',
  },
};

export const Group: Story = {
  render: () => (
    <Space.Compact>
      <Button>Left</Button>
      <Button>Middle</Button>
      <Button>Right</Button>
    </Space.Compact>
  ),
};

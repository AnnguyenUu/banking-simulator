import type { Meta, StoryObj } from '@storybook/react-vite';
import Divider from '@components/atomic/Divider';
import Input from '@components/atomic/Input';
import Button from '@components/atomic/Button';
import Space from './index';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-16 w-16 items-center justify-center rounded bg-[#1d39c4]/10 text-sm font-medium text-[#1d39c4]">
    {children}
  </div>
);

const meta = {
  title: 'Atomic/Space',
  component: Space,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    align: {
      control: 'select',
      options: ['start', 'end', 'center', 'baseline'],
    },
  },
  args: {
    size: 'middle',
    orientation: 'horizontal',
    wrap: false,
    children: (
      <>
        <Box>1</Box>
        <Box>2</Box>
        <Box>3</Box>
      </>
    ),
  },
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

export const LargeGap: Story = {
  args: { size: 'large' },
};

export const WithSeparator: Story = {
  args: {
    separator: <Divider orientation="vertical" className="h-16" />,
  },
};

export const Wrap: Story = {
  args: {
    wrap: true,
    className: 'w-[160px]',
    children: (
      <>
        <Box>1</Box>
        <Box>2</Box>
        <Box>3</Box>
        <Box>4</Box>
      </>
    ),
  },
};

export const Compact: Story = {
  render: () => (
    <Space.Compact>
      <Input placeholder="Search accounts" />
      <Button type="primary">Search</Button>
    </Space.Compact>
  ),
};

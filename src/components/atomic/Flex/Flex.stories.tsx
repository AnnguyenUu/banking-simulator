import type { Meta, StoryObj } from '@storybook/react-vite';
import Flex from './index';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-16 w-16 items-center justify-center rounded bg-[#1d39c4]/10 text-sm font-medium text-[#1d39c4]">
    {children}
  </div>
);

const meta = {
  title: 'Atomic/Flex',
  component: Flex,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    gap: {
      control: 'select',
      options: ['small', 'middle', 'large', 4, 8, 16, 24],
    },
  },
  args: {
    gap: 'middle',
    vertical: false,
    wrap: false,
    children: (
      <>
        <Box>1</Box>
        <Box>2</Box>
        <Box>3</Box>
      </>
    ),
  },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { vertical: true },
};

export const SpaceBetween: Story = {
  args: { justify: 'space-between', className: 'w-[320px]' },
};

export const Centered: Story = {
  args: { justify: 'center', align: 'center', className: 'h-[160px] w-[320px]' },
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

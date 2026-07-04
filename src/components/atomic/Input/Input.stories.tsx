import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserOutlined } from '@ant-design/icons';
import Input from './index';

const meta = {
  title: 'Atomic/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'middle', 'small'],
    },
    status: {
      control: 'select',
      options: [undefined, 'error', 'warning'],
    },
  },
  args: {
    placeholder: 'Enter text',
    size: 'middle',
    disabled: false,
    allowClear: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Disabled value' },
};

export const AllowClear: Story = {
  args: { allowClear: true, defaultValue: 'Clearable value' },
};

export const WithPrefixIcon: Story = {
  args: { prefix: <UserOutlined /> },
};

export const ErrorStatus: Story = {
  args: { status: 'error', defaultValue: 'Invalid value' },
};

export const WarningStatus: Story = {
  args: { status: 'warning', defaultValue: 'Needs review' },
};

export const Password: Story = {
  render: () => <Input.Password placeholder="Password" />,
};

export const Search: Story = {
  render: () => <Input.Search placeholder="Search description or category" allowClear />,
};

export const TextArea: Story = {
  render: () => <Input.TextArea placeholder="Add a note" rows={4} />,
};

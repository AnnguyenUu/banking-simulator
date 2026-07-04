import type { Meta, StoryObj } from '@storybook/react-vite';
import Flex from '@components/atomic/Flex';
import Typography from './index';

const { Title, Text, Paragraph } = Typography;

const meta = {
  title: 'Atomic/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Titles: Story = {
  render: () => (
    <Flex vertical gap={8}>
      <Title level={1}>Heading level 1</Title>
      <Title level={2}>Heading level 2</Title>
      <Title level={3}>Heading level 3</Title>
      <Title level={4}>Heading level 4</Title>
      <Title level={5}>Heading level 5</Title>
    </Flex>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <Flex vertical gap={8}>
      <Text>Default text</Text>
      <Text strong>Strong text</Text>
      <Text type="secondary">Secondary text</Text>
      <Text type="success">Success text</Text>
      <Text type="warning">Warning text</Text>
      <Text type="danger">Danger text</Text>
      <Text disabled>Disabled text</Text>
      <Text underline>Underlined text</Text>
      <Text delete>Deleted text</Text>
      <Text italic>Italic text</Text>
      <Text code>Code text</Text>
      <Text mark>Marked text</Text>
    </Flex>
  ),
};

export const CopyableAndEllipsis: Story = {
  render: () => (
    <Flex vertical gap={8} className="max-w-[240px]">
      <Text copyable>Copyable text</Text>
      <Text ellipsis>
        This is a long line of text that will be truncated with an ellipsis when it overflows its container.
      </Text>
    </Flex>
  ),
};

export const Paragraphs: Story = {
  render: () => (
    <Paragraph>
      Banking Bank helps you track balances, review recent transactions, and
      move money between your own accounts. This is a standard paragraph used
      for longer-form body copy across the app.
    </Paragraph>
  ),
};

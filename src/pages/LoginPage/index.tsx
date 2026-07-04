import { Form } from "antd";
import { useNavigate } from "react-router-dom";
import Card from "@components/atomic/Card";
import Input from "@components/atomic/Input";
import Button from "@components/atomic/Button";
import Typography from "@components/atomic/Typography";
import Alert from "@components/atomic/Alert";
import Flex from "@components/atomic/Flex";
import { useLogin } from "@mutations";
import type { LoginRequest } from "@apptypes/auth";

export function LoginPage() {
  const navigate = useNavigate();

  const { login, isPending, isError } = useLogin();

  const handleSubmit = (values: LoginRequest) => {
    login(values, {
      onSuccess: () => navigate("/", { replace: true }),
    });
  };

  return (
    <Flex justify="center" align="center" className="min-h-screen bg-gray-50">
      <Card className="w-full max-w-[400px]">
        <Typography.Title level={3} className="mb-4">
          Sign in
        </Typography.Title>

        <Form<LoginRequest> layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          {isError && (
            <Alert
              type="error"
              showIcon
              title="Invalid email or password."
              className="mb-4"
            />
          )}

          <Button type="primary" htmlType="submit" loading={isPending} block>
            Sign in
          </Button>
        </Form>
      </Card>
    </Flex>
  );
}

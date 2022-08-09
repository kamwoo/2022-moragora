import { rest } from 'msw';
import LoginPage from '.';
import Header from 'components/layouts/Header';
import DeviceLayout from 'components/layouts/DeviceLayout';

export default {
  title: 'Pages/LoginPage',
  component: LoginPage,
};

const Template = (args) => {
  return (
    <DeviceLayout>
      <Header />
      <LoginPage {...args} />
    </DeviceLayout>
  );
};

export const Default = Template.bind({});

export const Failure = Template.bind({});
Failure.parameters = {
  msw: {
    handlers: [
      rest.get('*', (req, res, ctx) => {
        return res(ctx.status(400), ctx.delay(700));
      }),
    ],
  },
};

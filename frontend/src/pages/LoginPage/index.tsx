import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './LoginPage.styled';
import useForm from 'hooks/useForm';
import useMutation from 'hooks/useMutation';
import { userContext, UserContextValues } from 'contexts/userContext';
import Input from 'components/@shared/Input';
import InputHint from 'components/@shared/InputHint';
import { UserLoginRequestBody } from 'types/userType';
import { getGoogleLoginToken, submitLoginApi } from 'apis/userApis';
import Button from 'components/@shared/Button';
import useQuery from 'hooks/useQuery';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(userContext) as UserContextValues;
  const { errors, isSubmitting, onSubmit, register } = useForm();
  const code = new URLSearchParams(location.search).get('code');

  console.log(code);

  const googleLoginQuery = useQuery(
    ['googleLogin'],
    getGoogleLoginToken(code || ''),
    {
      onSuccess: ({ body: { accessToken } }) => {
        console.log(accessToken);
      },
    }
  );

  const { mutate: loginMutate } = useMutation(submitLoginApi, {
    onSuccess: ({ body, accessToken }) => {
      login(body, accessToken);
      navigate('/');
    },
    onError: () => {
      alert('로그인을 실패했습니다.');
    },
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const formDataObject = Object.fromEntries(
      formData.entries()
    ) as UserLoginRequestBody;

    await loginMutate(formDataObject);
  };

  const handleGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id:
        '384532281638-939rf8dpjt0hdd9tggkdpjfk7neu6sht.apps.googleusercontent.com',
      redirect_uri: location.href,
      response_type: 'code',
      scope: 'openid',
    });

    location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString();
  };

  return (
    <S.Layout>
      <S.Form id="login-form" {...onSubmit(handleSubmit)}>
        <S.FieldBox>
          <S.Label>
            이메일
            <Input type="email" {...register('email', { required: true })} />
          </S.Label>
          <InputHint
            isShow={Boolean(errors['email']) && errors['email'] !== ''}
            message={errors['email']}
          />
        </S.FieldBox>
        <S.FieldBox>
          <S.Label>
            비밀번호
            <Input
              type="password"
              {...register('password', {
                required: true,
              })}
            />
          </S.Label>
          <InputHint
            isShow={Boolean(errors['password']) && errors['password'] !== ''}
            message={errors['password']}
          />
        </S.FieldBox>
      </S.Form>
      <S.ButtonBox>
        <Button type="submit" form="login-form" disabled={isSubmitting}>
          로그인
        </Button>
        <Button type="button" onClick={handleGoogleLogin}>
          구글로 로그인 하기
        </Button>
        <S.RegisterHintParagraph>
          모라고라가 처음이신가요?
          <S.RegisterLink to="/register">회원가입</S.RegisterLink>
        </S.RegisterHintParagraph>
      </S.ButtonBox>
    </S.Layout>
  );
};

export default LoginPage;

import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSession, useFormField } from "../../hooks";
import { signIn } from "../../services";
import { RoundedButton, TextInput } from "../../components";
import { passwordValidator, usernameValidator } from "../../helpers";

import {
  MainContainer,
  ContentContainer,
  Title,
  ButtonsContainer,
  LoginContainer,
  LoginInputLabel,
} from "./styles";

export const SignIn = () => {
  const location = useLocation();

  const {
    value: username,
    handleChange: handleUsernameChange,
    isValid: isUsernameValid,
    onBlur: onUsernameBlur,
    isDone: isUsernameDone,
  } = useFormField(location?.state?.username, usernameValidator);
  const {
    value: password,
    handleChange: handlePasswordChange,
    isValid: isPasswordValid,
    onBlur: onPasswordBlur,
    isDone: isPasswordDone,
  } = useFormField("", passwordValidator);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onValid = useCallback(() => navigate("/"), [navigate]);
  const onInvalid = useCallback(() => console.log("Session is invalid"), []);

  useSession({ onValid, onInvalid });

  async function handleSubmit() {
    setLoading(true);
    const response = await signIn(username, password);
    setLoading(false);

    if (response.success) {
      navigate("/");
    } else {
      window.alert(response.data);
    }
  }

  function handleRegisterClick() {
    navigate("/sign-up");
  }

  return (
    <MainContainer>
      <ContentContainer>
        <Title>
          Sign in to
          <br />
          Your
          <br />
          Account
        </Title>
        <LoginContainer>
          <LoginInputLabel>Username</LoginInputLabel>
          <TextInput
            value={username}
            handleChange={handleUsernameChange}
            type="text"
            placeholder="Ex.: john_doe"
            onBlur={onUsernameBlur}
            isValid={isUsernameValid || !isUsernameDone}
          />
          <LoginInputLabel>Password</LoginInputLabel>
          <TextInput
            value={password}
            handleChange={handlePasswordChange}
            type="password"
            placeholder="Your password"
            onBlur={onPasswordBlur}
            isValid={isPasswordValid || !isPasswordDone}
          />
        </LoginContainer>
        <ButtonsContainer>
          <RoundedButton
            text={"Register"}
            enabled={true}
            onClick={handleRegisterClick}
            className={"mr-2"}
            secondary
          />
          <RoundedButton
            text={"Sign in"}
            enabled={isUsernameValid && isPasswordValid}
            onClick={handleSubmit}
            loading={loading}
            className={"ml-2"}
            icon
            primary
          />
        </ButtonsContainer>
      </ContentContainer>
    </MainContainer>
  );
};

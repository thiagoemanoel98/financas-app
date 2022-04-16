import React, { useState, useContext } from "react";
import { Platform, ActivityIndicator } from "react-native";
import { AuthContext } from "../../contexts/auth";

import { Background, Container, SignImg, AreaInput, Input, SubmitButton,
    SubmitText, Link, LinkText } from '../SignIn/styles';

export default function SignUp() {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [nome, setNome] = useState('');
    const {user} = useContext(AuthContext);
    const {signUp, loadingAuth} = useContext(AuthContext);

    // Ação do botão de cadastro
    function handleSignUp(){
      signUp(email, pass, nome);
    }

    return (
      <Background>
          <Container
            behavior = {Platform.OS === 'ios'? 'padding' : ''}
            enable
          >  
              <AreaInput>
                <Input 
                    placeholder = "Nome"
                    autoCorrect = {false}
                    autoCapitalize = "none"
                    value={nome}
                    onChangeText = { (txt) => setNome(txt) }
                />
               </AreaInput>
              <AreaInput>
                <Input 
                    placeholder = "Email"
                    autoCorrect = {false}
                    autoCapitalize = "none"
                    value={email}
                    onChangeText = { (txt) => setEmail(txt) }
                />
               </AreaInput>
               <AreaInput>
                <Input 
                    placeholder = "Senha"
                    autoCorrect = {false}
                    autoCapitalize = "none"
                    value={pass}
                    onChangeText = { (txt) => setPass(txt) }
                />
              </AreaInput>

            <SubmitButton onPress = {handleSignUp}>
              {
                loadingAuth ? (
                  <ActivityIndicator size={20} color = "#FFF" />
                ) : (
                  <SubmitText>Cadastrar</SubmitText>
                )
              }
            </SubmitButton>

          </Container>
      </Background>
    );
  }
import React, { useState, useContext } from "react";
import { Platform, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../../contexts/auth";

import { Background, Container, Logo, AreaInput, Input, SubmitButton,
    SubmitText, Link, LinkText } from './styles';

export default function SignIn() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const { signIn, loadingAuth } = useContext(AuthContext); // Acessando essa função do Auth

    function handleLogin(){
      signIn(email, pass);
    }

    return (
      <Background>
          <Container
            behavior = {Platform.OS === 'ios'? 'padding' : ''}
            enable
          >
              <Logo source = {require('../../assets/Logo.png')}/>

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
                    secureTextEntry = {true}
                />
              </AreaInput>

            <SubmitButton onPress = {handleLogin}>
                {
                  loadingAuth ?(
                    <ActivityIndicator size={20} color = "#FFF" />
                  ) : (
                    <SubmitText>Acessar</SubmitText>    
                  )
                }

            </SubmitButton>

            <Link onPress = { () => navigation.navigate('SignUp')}>
                <LinkText>Criar uma Conta!</LinkText>
            </Link>

          </Container>
      </Background>
    );
  }
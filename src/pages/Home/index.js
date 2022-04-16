import React, {useContext, useState, useEffect} from "react";
import { Alert, TouchableOpacity, Platform } from "react-native";
import firebase from '../../services/firebaseConnection';
import {format, isBefore} from 'date-fns';

import Header from "../../components/Header";
import HistoricoList from "../../components/HistoricoList";
import {AuthContext} from '../../contexts/auth';

import {Background, Container, Nome, Saldo, Title, List, Area} from './styles';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from "../../components/DatePicker";


export default function Home() {

  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);

  const {user} = useContext(AuthContext);
  const uid = user && user.uid;

  const [newDate, setNewDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(()=>{
    async function loadList(){
      await firebase.database().ref('users').child(uid).on('value', (snapshot) =>{
        setSaldo(snapshot.val().saldo);
      });
  
      
      // Ordena os registros iguais a data atual
      await firebase.database().ref('historico')
      .child(uid)
      .orderByChild('date').equalTo(format(newDate, 'dd/MM/yyyy'))
      .limitToLast(10).on('value', (snapshot) => {
        setHistorico([]);

        snapshot.forEach((childItem) => {
          let list = {
            key: childItem.key,
            tipo: childItem.val().tipo,
            valor: childItem.val().valor,
            date: childItem.val().date,
          };
          setHistorico(oldArray => [... oldArray, list].reverse());
         
        })      
        //console.log(historico);
      })
    }

    loadList();
  }, [newDate]); 

  function handleShowPicker(){
    setShow(true);
  }

  // Fecha o DatePicker
  function handleClose(){
    setShow(false);
  }

  const onChange = (date) =>{
    setShow(Platform.OS === 'ios');
    setNewDate(date);
    console.log(date);
  }

  function handleDelete(data){
    // Pegando a data o item
    const [diaItem, mesItem, anoItem] = data.date.split('/');
    const dateItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);

    // Pegando a data de hoje:
    const formatDiaHoje = format(new Date(), 'dd/MM/yyyy');
    const [diaHj, mesHj, anoHj] = formatDiaHoje.split('/');
    const dataHj = new Date(`${anoHj}/${mesHj}/${diaHj}`);

    // Compara se a primeira data é anterior a segunda
    if(isBefore(dateItem, dataHj)){
      // Se a data do registro já passou
      alert('Você não pode excluir um registro antigo!');
      return;
    }

    Alert.alert(
      'Cuidado Atenção!',
      `Você deseja excluir ${data.tipo} - valor: ${data.valor}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => handleDeleteSuccess(data)
        } 
      ]
    )
  }

  async function handleDeleteSuccess(data){
    await firebase.database().ref('historico')
    .child(uid).child(data.key).remove()
    .then(async () =>{
      let saldoAtual = saldo;
      data.tipo === 'despesa' ? saldoAtual += parseFloat(data.valor) : saldoAtual -= parseFloat(data.valor);
      
      await firebase.database().ref('users').child(uid)
      .child('saldo').set(saldoAtual);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <Background>
      <Header/>
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>R$ {saldo.toFixed(2)}</Saldo>
      </Container>

      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="event" color='#FFF' size = {30} />
        </TouchableOpacity>
        <Title>Ultimas movimentações:</Title>
      </Area>

      <List
        showsVerticalScrollIndicator = {false}      
        data = {historico}
        KeyExtractor = {item => item.key}
        renderItem = {({item}) => (<HistoricoList data={item} deleteItem = {handleDelete}/>)}
      />

      {show && (
        <DatePicker 
          onClose = {handleClose}
          date = {newDate}
          onChange = {onChange}
        />
      )}

    </Background>
  );
}
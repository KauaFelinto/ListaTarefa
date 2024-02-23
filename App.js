import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';
import { Alert, ImageBackground, ScrollView, StatusBar, TextInput } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const image = require('./resources/bg.jpg');

  const [tarefas, setTarefas] = useState([]);

    const [modal, setModal] = useState(false);

    const [tarefaAtual, setTarefaAtual] = useState('');

 
  let [fontsLoaded, fontError] = useFonts({
    Lato_400Regular,
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }

  (async () => {
    try{
      let tarefaAtual = await AsyncStorage.getItem('tarefas');
      if(tarefaAtual == null)
      setTarefas([]);
      else
        setTarefas(JSON.parse(tarefaAtual));
    }catch (error){

    }
  });

  function deletarTarefa(id){
    alert('deletado tarefa '+id+' com sucesso');

    let newTarefa = tarefas.filter(function(val){
      return val.id != id;
    })

    setTarefas(newTarefa);

    (async () => {
      try{
        await AsyncStorage.setItem('tarefas', JSON.stringify(newTarefa));
        console.log('chamado');
      }catch (error){

      }
    });
  }

  function addtarefa(){

      setModal(!modal);

      let id = 0;
      if(tarefas.length > 0){
        id = tarefas[tarefas.length-1].id + 1;
      }

      let tarefa = {id:id, tarefa:tarefaAtual};

      setTarefas([...tarefas,tarefa]);

      (async () =>{
        try{
          await AsyncStorage.setItem('tarefas', JSON.stringify([...tarefas,tarefa]));
        }catch (error){

        }
      });
  }

  return(
    <ScrollView style={{flex: 1}}>

        <StatusBar hidden />
        <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput onChangeText={text => setTarefaAtual(text)} autoFocus={true}></TextInput>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => addtarefa()}
            >
              <Text style={styles.textStyle}>Adicionar Tarefa</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

          <ImageBackground source={image} style={styles.image}>
            <View style={styles.coverView}>
              <Text style={styles.textHeader}>Lista de tarefas</Text>
            </View>
          </ImageBackground>


        {
          tarefas.map(function(val){
            return(
              <View style={styles.tarefas}>
              <View style={{flex: 1, width: '100%', padding: 10}}>
                <Text>{val.tarefa}</Text>
              </View>
              <View style={{alignItems: 'flex-end', flex: 1, padding: 10}}>
                <TouchableOpacity onPress={() => deletarTarefa(val.id)}><AntDesign name="minuscircleo" size={24} color="black" /></TouchableOpacity>
              </View>
            </View>
            )
          })
        }

        <TouchableOpacity style={styles.bntAddTarefa} onPress={() => setModal(true)}>
          <Text style={{textAlign:'center', color: '#fff'}}>Adicionar Tarefa</Text>
        </TouchableOpacity>


    </ScrollView>
  )
}

const styles = StyleSheet.create({
    image:{
      height: '100%',
      height: 80,
      resizeMode: 'cover',
    },
    coverView: {
      width: '100%',
      height: 80,
      backgroundColor: 'rgba(0,0,0,0.4)'
    },
    textHeader: {
      color: '#fff',
      fontSize: 20,
      textAlign: 'center',
      marginTop: 20,
      fontFamily: 'Lato_400Regular'
    },
    tarefas: {
      marginTop: 30,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      flexDirection: 'row',
      paddingBottom: 10
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:'rgba(0,0,0,0.5)'
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex:5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
      bntAddTarefa: {
        width: 200,
        padding: 8,
        backgroundColor: 'gray',
        marginTop: 20,
        marginLeft: 120
      }

})
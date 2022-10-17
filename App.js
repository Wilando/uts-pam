import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Item = ({todo, cheked, index, deleteTodo}) => {
  
  const [isChecked, setChecked] = useState(cheked);

  return (
    <View style={styles.containerItems}>
      <Checkbox value={isChecked} onValueChange={setChecked} />
      <Text style = {!isChecked ? styles.normalText : styles.strikeText }>{todo}</Text>
      <Button
        title="Hapus"
        onPress={() => deleteTodo(index)}
        color= "red"
      />
    </View>
  )
}

export default function App() {

  const [todo, onChangeTodo] = useState("");
  const [toDoList, setToDoList] = useState([]);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@todoStorage')
        setToDoList(jsonValue != null ? JSON.parse(jsonValue) : [])
      } catch(e) {
        console.log(e)
      }
    }

    getData();
    
  },[]);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@todoStorage', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }


  const tambahTodo = () => {
    if(todo === "") {
      setValid(false);
      return
    }
    const newTodo = {toDo: todo, isCheked: false};
    const todoToStore = [...toDoList, newTodo]  
    setToDoList((current)=> [...current, newTodo]);
    storeData(todoToStore)
    onChangeTodo("")
  }

  const deleteTodo = (deleteIndex) => {
    setToDoList(toDoList.filter((todo, index)=> index != deleteIndex));
    const todoToStore = toDoList.filter((todo, index)=> index != deleteIndex);
    storeData(todoToStore);
  }

  return (
    
      <View style={styles.container}>

        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTodo}
            value={todo}
            onFocus = {()=> {setValid(true)}}
          />
          {!valid &&
            <Text style={styles.textValidation}>Input Masih Kosong</Text>
          }
          <Button
            title="Tambah"
            onPress={tambahTodo}
          />
        </View>

        <ScrollView>
        {
          toDoList.map((todo, index)=>{
            return (
              <Item key={index} index={index} todo={todo.toDo} cheked={todo.isCheked} deleteTodo={deleteTodo} />
            )
          })
        }
        </ScrollView>

      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  containerInput: {
    justifyContent: "center",
    alignItems: "center"
  },
  textValidation: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 10,
  },
  strikeText: {
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid'
  },
  normalText: {
    textDecorationStyle: 'solid'
  },
  input: {
    width: 200,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  containerItems: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

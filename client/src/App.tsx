import React, { useState, useEffect } from 'react';
import './App.css'
import Axios from 'axios'

interface friendTypes {
  _id: string
  name: string;
  age: number;
}

function App() {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [listOfFriends, setListOfFriends] = useState<friendTypes[]>([]);

  const addFriend = () => {
    Axios.post('http://localhost:3001/addfriend', {
      name, age
    })
    .then((res) => {
      // 이 방법쓰면 댓글 달때마다 새로고침 기능 안써도 된다 ㅇㅇ
      setListOfFriends([...listOfFriends, { _id: res.data._id, name, age}])
    }).catch((err) => {
      console.log(err);
    })
  }

  const updateFriend = (id: string) => {
    const newAge = prompt('Enter New age: ');
    Axios.put('http://localhost:3001/update', { newAge, id })
    .then(() => {
      setListOfFriends(listOfFriends.map((val : any) => {
        return val._id === id 
          ? {_id: id, name: val.name, age: newAge} 
          : val;
      }))
    });
  }

  const deleteFriend = (id: string) => {
    Axios.delete(`http://localhost:3001/delete/${id}`)
    .then(() => {
      setListOfFriends(listOfFriends.filter((val: any) => {
        return val._id !== id;
      }))
    })
  }

  useEffect(() => {
    Axios.get('http://localhost:3001/read')
    .then((res) => {
      setListOfFriends(res.data);
    }).catch((err) => {
      console.log(err);
    })   
  }, [])

  return (
    <div className="App">
      <div className="inputs">
        <input 
          type="text" 
          placeholder="Friend name..."
          onChange={(e) => {setName(e.target.value)}}
        />
        <input 
          type="number" 
          placeholder="Friend age..."
          onChange={(e) => {setAge(parseInt(e.target.value))}}
        />
        <button onClick={addFriend}>Add Friend</button>
      </div>

      <div className="listOfFriends">
        {listOfFriends.map((val: friendTypes, key: number) => {
          return (
            <div className="friendContainer">
              <div className="friend">
                <div style={{ display: 'none' }}>{key}</div>
                <h3>Name: {val.name}</h3>
                <h3>Age: {val.age}</h3>
              </div>
              <button 
                onClick={() => updateFriend(val._id)}
              >
                Update
              </button>
              <button 
                id="removeBtn" 
                onClick={() => deleteFriend(val._id)
              }>
                X
              </button>
            </div>
          )
        })} 
      </div>
    </div>
  );
}

export default App;

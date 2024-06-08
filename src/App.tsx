import axios from "axios";
import "./App.css";
import { useState } from "react";

function App() {
  const [datas, setData] = useState<any>([]);
  const [newComment, setNewComment] = useState<{ name: string, email: string, body: string }>({
    name: "",
    email: "",
    body: ""
  });
  const [editMode, setEditMode] = useState<{ id: number | null, name: string, email: string, body: string }>({
    id: null,
    name: "",
    email: "",
    body: ""
  });

  // Get comments from API
  const getApi = () => {
    axios.get('https://jsonplaceholder.typicode.com/comments')
      .then((res) => {
        console.log("Success", res.data);
        setData([...res.data]);
      })
      .catch((err) => console.log(err, "Error"));
  };

  // Add a new comment
  const addComment = () => {
    axios.post('https://jsonplaceholder.typicode.com/comments', { ...newComment })
      .then((res) => {
        setData([...datas, { id: res.data.id, ...newComment }]);
        setNewComment({ name: "", email: "", body: "" });
      })
      .catch((err) => console.log(err, "Error"));
  };

  // Delete a comment
  const deleteComment = (id: number) => {
    axios.delete(`https://jsonplaceholder.typicode.com/comments/${id}`)
      .then(() => {
        setData(datas.filter((comment: any) => comment.id !== id));
      })
      .catch((err) => console.log(err, "Error"));
  };

  // Edit a comment
  const editComment = (id: number) => {
    axios.put(`https://jsonplaceholder.typicode.com/comments/${id}`, { ...editMode })
      .then((res) => {
        setData(datas.map((comment: any) => comment.id === id ? res.data : comment));
        setEditMode({ id: null, name: "", email: "", body: "" });
      })
      .catch((err) => console.log(err, "Error"));
  };

  // Handle edit input changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditMode(prev => ({ ...prev, [name]: value }));
  };

  // Set edit mode
  const startEditComment = (id: number, name: string, email: string, body: string) => {
    setEditMode({ id, name, email, body });
  };

  return (
    <>
      <div>
        <button onClick={getApi}>Load Comments</button>

        <div>
          <h2>Add New Comment</h2>
          <input
            type="text"
            placeholder="Name"
            value={newComment.name}
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newComment.email}
            onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
          />
          <textarea
            placeholder="Body"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>

        {datas.map((x: any) => {
          return (
            <div key={x.id}>
              {editMode.id === x.id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editMode.name}
                    onChange={handleEditChange}
                  />
                  <input
                    type="email"
                    name="email"
                    value={editMode.email}
                    onChange={handleEditChange}
                  />
                  <textarea
                    name="body"
                    value={editMode.body}
                    onChange={handleEditChange}
                  />
                  <button onClick={() => editComment(x.id)}>Save</button>
                </>
              ) : (
                <>
                  <h1>{x.name}</h1>
                  <h3>{x.email}</h3>
                  <p>{x.body}</p>
                  <button onClick={() => deleteComment(x.id)}>Delete</button>
                  <button onClick={() => startEditComment(x.id, x.name, x.email, x.body)}>Edit</button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;

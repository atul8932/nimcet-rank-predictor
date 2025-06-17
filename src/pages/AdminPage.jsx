import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "nimcet_users"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "nimcet_users", id));
    fetchData();
  };

  const handleEdit = (id) => {
    setEditingId(id);
    const user = users.find((u) => u.id === id);
    setEditedData({ ...user });
  };

  const handleSave = async () => {
    await updateDoc(doc(db, "nimcet_users", editingId), editedData);
    setEditingId(null);
    fetchData();
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Admin Panel – NIMCET Submissions</h1>
      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Marks</th>
              <th>Category</th>
              <th>RegNo</th>
              <th>City</th>
              <th>State</th>
              <th>Rank</th>
              <th>Top College</th>
              <th>Fallback College</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                {editingId === u.id ? (
                  <>
                    <td>
                      <input
                        name="name"
                        value={editedData.name}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        name="phone"
                        value={editedData.phone}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        name="marks"
                        value={editedData.marks}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        name="category"
                        value={editedData.category}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        name="regNo"
                        value={editedData.regNo}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        name="city"
                        value={editedData.city}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        name="state"
                        value={editedData.state}
                        onChange={handleChange}
                      />
                    </td>
                    <td>{u.rank}</td>
                    <td>{u.topCollege}</td>
                    <td>{u.fallbackCollege}</td>
                    <td>
                      <button onClick={handleSave}>💾 Save</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.name}</td>
                    <td>{u.phone}</td>
                    <td>{u.marks}</td>
                    <td>{u.category}</td>
                    <td>{u.regNo}</td>
                    <td>{u.city}</td>
                    <td>{u.state}</td>
                    <td>{u.rank}</td>
                    <td>{u.topCollege}</td>
                    <td>{u.fallbackCollege}</td>
                    <td>
                      <button onClick={() => handleEdit(u.id)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(u.id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

"use client"
import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Select, Table, TableRow, TableCell, TableHead, TableBody } from "../../../components/ui";
import axios from "axios";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("/api/feedback");
      if (response.status === 200) {
        setFeedbacks(response.data);
      } else {
        console.error("Failed to fetch feedbacks:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/feedback/${editingId}`, formData);
        setIsEditing(false);
        setEditingId(null);
      } else {
        await axios.post("/api/feedback", formData);
      }
      setFormData({ title: "", description: "", category: "", priority: "", email: "" });
      fetchFeedbacks();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  // Handle edit
  const handleEdit = (feedback) => {
    setFormData(feedback);
    setIsEditing(true);
    setEditingId(feedback._id); // Ensure _id is used consistently
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error("Invalid feedback ID for deletion");
        return;
      }
      await axios.delete(`/api/feedback/${id}`);
      fetchFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feedback Management</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <Input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })} // Simplified handler
            required
          >
            <option value="">Select Category</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="improvement">Improvement</option>
          </Select>
          <Select
            name="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })} // Simplified handler
            required
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
        </div>
        <Textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="mt-4"
        />
        <Button type="submit" className="mt-4">
          {isEditing ? "Update Feedback" : "Add Feedback"}
        </Button>
      </form>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback._id || feedback.id || Math.random()}> {/* Fallback for missing _id */}
              <TableCell>{feedback.title}</TableCell>
              <TableCell>{feedback.email}</TableCell>
              <TableCell>{feedback.category}</TableCell>
              <TableCell>{feedback.priority}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(feedback)} className="mr-2">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(feedback._id)} variant="destructive"> {/* Use _id */}
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeedbackPage;

"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.error("Invalid email address");
      alert("Please enter a valid email address.");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`/api/feedback/${editingId}`, formData);
      } else {
        await axios.post("/api/feedback", formData);
      }
      setFormData({ title: "", description: "", category: "", priority: "", email: "" });
      setIsEditing(false);
      setEditingId(null);
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
    <div className="container mx-auto p-4 bg-blue-100"> {}
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
            value={formData.category || ""}
            onChange={(e) => handleInputChange({ target: { name: "category", value: e.target.value } })} // Fix onChange
            required
          >
            <option value="">Select Category</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="improvement">Improvement</option>
          </Select>
          <Select
            name="priority"
            value={formData.priority || ""}
            onChange={(e) => handleInputChange({ target: { name: "priority", value: e.target.value } })} // Fix onChange
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
        <TableHeader>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback._id || feedback.id}> {/* Remove Math.random fallback */}
              <TableCell>{feedback.title}</TableCell>
              <TableCell>{feedback.email}</TableCell>
              <TableCell>{feedback.category}</TableCell>
              <TableCell>{feedback.priority}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(feedback)} className="mr-2">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(feedback._id || feedback.id)} className="bg-red-500 text-white"> {/* Ensure consistent ID */}
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
